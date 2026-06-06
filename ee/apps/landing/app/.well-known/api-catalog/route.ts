export const dynamic = "force-static"

const linkset = {
  linkset: [
    {
      anchor: "https://api.venomcowork.local",
      "service-desc": [
        {
          href: "https://api.venomcowork.local/openapi.json",
          type: "application/vnd.oai.openapi+json;version=3.1",
          title: "VenomCowork Den API â€” OpenAPI 3.1 document",
        },
      ],
      "service-doc": [
        {
          href: "https://venomcowork.local/docs/api-reference",
          type: "text/html",
          title: "VenomCowork Den API â€” human documentation",
        },
      ],
      status: [
        {
          href: "https://api.venomcowork.local/health",
          type: "application/json",
          title: "VenomCowork Den API â€” health endpoint",
        },
      ],
      "service-meta": [
        {
          href: "https://venomcowork.local/llms.txt",
          type: "text/plain",
          title: "VenomCowork llms.txt â€” agent-facing site guide",
        },
      ],
    },
  ],
}

export function GET() {
  return new Response(JSON.stringify(linkset, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
