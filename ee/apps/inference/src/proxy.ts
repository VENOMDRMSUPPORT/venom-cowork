import { createHash } from "node:crypto"
import type { Hono } from "hono"
import { env } from "./env.js"
import { findActiveInferenceKey, getOpenRouterProviderKey } from "./keys.js"
import { ensureUsableBuckets } from "./limits.js"
import { resolveModelAlias } from "./model-catalog.js"

type JsonObject = Record<string, unknown>

function readApiKey(request: Request) {
  const auth = request.headers.get("authorization")
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim()
  }
  return request.headers.get("x-api-key")?.trim() ?? null
}

function isJsonRequest(request: Request) {
  return request.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false
}

function sanitizeHeaders(request: Request, apiKey: string, venomcoworkRequestId: string) {
  const headers = new Headers(request.headers)
  for (const name of ["authorization", "x-api-key", "host", "content-length", "connection", "accept-encoding"]) {
    headers.delete(name)
  }
  headers.set("authorization", `Bearer ${apiKey}`)
  headers.set("x-venomcowork-request-id", venomcoworkRequestId)
  if (env.proxyBaseUrl) {
    headers.set("http-referer", env.proxyBaseUrl)
  }
  headers.set("x-title", "VenomCowork Inference")
  return headers
}

function openAiError(status: number, code: string, message: string) {
  return Response.json({ error: { message, type: "invalid_request_error", code } }, { status })
}

function logProxyError(message: string, details: Record<string, unknown>) {
  console.error(`[inference-proxy] ${message}`, details)
}

async function logUpstreamError(input: {
  upstream: Response
  upstreamUrl: URL
  venomcoworkRequestId: string
  modelAlias: string
  upstreamModel: string | null
}) {
  let bodySnippet: string | null = null
  try {
    const text = await input.upstream.clone().text()
    bodySnippet = text.slice(0, 2000)
  } catch (error) {
    bodySnippet = `Failed to read upstream error body: ${error instanceof Error ? error.message : String(error)}`
  }

  logProxyError("Upstream OpenRouter request failed", {
    venomcoworkRequestId: input.venomcoworkRequestId,
    upstreamUrl: input.upstreamUrl.toString(),
    status: input.upstream.status,
    statusText: input.upstream.statusText,
    modelAlias: input.modelAlias,
    upstreamModel: input.upstreamModel,
    bodySnippet,
  })
}

function buildRequestId() {
  return createHash("sha256").update(`${Date.now()}:${Math.random()}`).digest("hex").slice(0, 32)
}

function secondsUntil(date: Date) {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000))
}

function trackStream(body: ReadableStream<Uint8Array> | null, done: () => Promise<void>, fail: () => Promise<void>) {
  if (!body) return body
  const reader = body.getReader()
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const chunk = await reader.read()
        if (chunk.done) {
          await done()
          controller.close()
          return
        }
        controller.enqueue(chunk.value)
      } catch (error) {
        await fail()
        controller.error(error)
      }
    },
    async cancel(reason) {
      await fail()
      await reader.cancel(reason)
    },
  })
}

async function prepareBody(request: Request, input: {
  organizationId: string
  orgMembershipId: string
  inferenceKeyId: string
  venomcoworkRequestId: string
}) {
  if (!isJsonRequest(request)) {
    return { body: request.body, modelAlias: "unknown", upstreamModel: null as string | null }
  }

  const body = await request.json() as JsonObject
  if (typeof body.model !== "string") {
    logProxyError("Missing model in JSON request body", {
      venomcoworkRequestId: input.venomcoworkRequestId,
      organizationId: input.organizationId,
      orgMembershipId: input.orgMembershipId,
    })
    return { error: openAiError(400, "model_required", "JSON request body must include a string model.") }
  }
  const model = resolveModelAlias(body.model)
  if (!model) {
    logProxyError("Unknown VenomCowork model alias", {
      venomcoworkRequestId: input.venomcoworkRequestId,
      organizationId: input.organizationId,
      orgMembershipId: input.orgMembershipId,
      requestedModel: body.model,
    })
    return { error: openAiError(404, "model_not_found", `Unknown VenomCowork model alias: ${body.model}`) }
  }

  body.model = model.upstreamModel
  body.user = input.orgMembershipId
  body.session_id = typeof body.session_id === "string" ? body.session_id : input.venomcoworkRequestId
  body.trace = {
    trace_id: input.venomcoworkRequestId,
    trace_name: "VenomCowork Inference",
    generation_name: model.alias,
    org_membership_id: input.orgMembershipId,
    inference_key_id: input.inferenceKeyId,
    venomcowork_request_id: input.venomcoworkRequestId,
  }

  return {
    body: JSON.stringify(body),
    modelAlias: model.alias,
    upstreamModel: model.upstreamModel,
  }
}

export function registerProxyRoutes(app: Hono) {
  app.all("/api/v1/*", async (c) => {
    const rawKey = readApiKey(c.req.raw)
    if (!rawKey) {
      logProxyError("Missing inference API key", { path: c.req.path, method: c.req.method })
      return c.json({ error: { message: "Missing VenomCowork inference API key.", type: "authentication_error", code: "missing_api_key" } }, 401)
    }

    const inferenceKey = await findActiveInferenceKey(rawKey)
    if (!inferenceKey) {
      logProxyError("Invalid inference API key", { path: c.req.path, method: c.req.method })
      return c.json({ error: { message: "Invalid VenomCowork inference API key.", type: "authentication_error", code: "invalid_api_key" } }, 401)
    }

    const limits = await ensureUsableBuckets(inferenceKey.organization_id)
    if (!limits.ok) {
      logProxyError("Inference usage limit exceeded", {
        path: c.req.path,
        organizationId: inferenceKey.organization_id,
        orgMembershipId: inferenceKey.org_membership_id,
        limitedBy: limits.limitedBy,
      })
      c.header("x-venomcowork-limit-bucket-id", limits.limitedBy)
      c.header("x-venomcowork-limit-window-type", limits.windowType)
      const limitedBucket = "limitedBucket" in limits ? limits.limitedBucket : null
      if (limitedBucket) {
        const retryAfter = secondsUntil(limitedBucket.windowEndAt)
        c.header("retry-after", String(retryAfter))
        c.header("x-ratelimit-limit-tokens", String(limitedBucket.limitAmount))
        c.header("x-ratelimit-remaining-tokens", "0")
        c.header("x-ratelimit-reset-tokens", `${retryAfter}s`)
      }
      return c.json({
        error: {
          message: `Rate limit reached for organization ${inferenceKey.organization_id}.`,
          type: "tokens",
          param: null,
          code: "rate_limit_exceeded",
        },
      }, 429)
    }

    const providerKey = await getOpenRouterProviderKey(inferenceKey.organization_id)
    if (!providerKey) {
      logProxyError("Missing active OpenRouter provider key", {
        path: c.req.path,
        organizationId: inferenceKey.organization_id,
        orgMembershipId: inferenceKey.org_membership_id,
      })
      return c.json({ error: { message: "No active OpenRouter provider key configured for organization.", type: "invalid_request_error", code: "missing_provider_key" } }, 400)
    }

    const venomcoworkRequestId = buildRequestId()
    const prepared = await prepareBody(c.req.raw, {
      organizationId: inferenceKey.organization_id,
      orgMembershipId: inferenceKey.org_membership_id,
      inferenceKeyId: inferenceKey.id,
      venomcoworkRequestId,
    })
    if ("error" in prepared) {
      logProxyError("Invalid inference proxy request", {
        venomcoworkRequestId,
        path: c.req.path,
        organizationId: inferenceKey.organization_id,
        orgMembershipId: inferenceKey.org_membership_id,
      })
      return prepared.error
    }

    const upstreamPath = c.req.path.replace(/^\/api\/v1/, "")
    const upstreamUrl = new URL(`${env.openRouterUpstreamUrl}${upstreamPath}${new URL(c.req.url).search}`)
    let upstream: Response
    try {
      upstream = await fetch(upstreamUrl, {
        method: c.req.method,
        headers: sanitizeHeaders(c.req.raw, providerKey.encrypted_api_key, venomcoworkRequestId),
        body: ["GET", "HEAD"].includes(c.req.method) ? undefined : prepared.body,
        duplex: "half",
      } as RequestInit)
    } catch (error) {
      logProxyError("Failed to reach OpenRouter upstream", {
        venomcoworkRequestId,
        upstreamUrl: upstreamUrl.toString(),
        modelAlias: prepared.modelAlias,
        upstreamModel: prepared.upstreamModel,
        error: error instanceof Error ? error.message : String(error),
      })
      return c.json({ error: { message: "Failed to reach OpenRouter upstream.", type: "api_error", code: "upstream_unreachable" } }, 502)
    }

    if (!upstream.ok) {
      await logUpstreamError({
        upstream,
        upstreamUrl,
        venomcoworkRequestId,
        modelAlias: prepared.modelAlias,
        upstreamModel: prepared.upstreamModel,
      })
    }

    const headers = new Headers(upstream.headers)
    headers.set("x-venomcowork-request-id", venomcoworkRequestId)
    return new Response(trackStream(
      upstream.body,
      async () => {},
      async () => {},
    ), { status: upstream.status, statusText: upstream.statusText, headers })
  })
}
