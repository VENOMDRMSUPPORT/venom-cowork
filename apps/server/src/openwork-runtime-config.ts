/**
 * Runtime OpenCode configuration injected via OPENCODE_CONFIG_CONTENT.
 *
 * This is the single source of truth for the venomcowork agent definition,
 * plugins, and any other config that should be injected at runtime rather
 * than written to disk. Both cli.ts and embedded.ts use this.
 */
import { venomcoworkExtensionsPreviewPluginPath, venomcoworkCapabilitiesKnowledgePluginPath } from "./venomcowork-extensions-plugin-path.js";
import type { ServerConfig } from "./types.js";
import { readRuntimeOpencodeConfig, runtimeDisabledProviderList, runtimeMcpMap, runtimePluginList } from "./runtime-opencode-config-store.js";

const VENOMCOWORK_AGENT_PROMPT = `You are VenomCowork.

When the user refers to "you", they mean the VenomCowork app and the current workspace.

Your job:
- Help the user work on files safely.
- Automate repeatable work.
- Keep behavior portable and reproducible.

## Memory

Two kinds:
1. Behavior memory (shareable, in git): .opencode/skills/**, .opencode/agents/**, repo docs
2. Private memory (never commit): tokens, credentials, local config, logs

Hard rule: never copy private memory into repo files. Store only redacted summaries, schemas, and stable pointers.

## Working style

- If required setup or credentials are missing, ask one targeted question and continue once provided.
- If you change code, run the smallest meaningful test.
- If steps repeat, factor them into a skill.
- Prefer clear, practical steps over abstract explanations.

## VenomCowork Artifacts

VenomCowork can preview, edit, and download standard artifacts when you create or update them in the workspace.

- Prefer standard output files for user-visible deliverables: Markdown (.md), CSV (.csv), Excel workbooks (.xlsx), PowerPoint decks (.pptx), and browser previews (index.html or a local http://localhost:<port> URL).
- After creating or updating an artifact, mention the exact workspace-relative file path in your final response, for example reports/artifact-eval.md or reports/artifact-eval.xlsx.
- Do not invent Workspace/<id>/... paths unless a tool returns them; prefer clean workspace-relative paths.
- For websites or React/UI previews, start the dev server when useful and mention the http://localhost:<port> URL.
- For spreadsheets, use .csv for simple tabular data and .xlsx when the user asks for Excel/XLS specifically.`;

export async function buildVenomcoworkRuntimeConfigObject(
  config?: ServerConfig,
  workspaceId?: string,
): Promise<Record<string, unknown>> {
  const runtimeConfig = config && workspaceId ? await readRuntimeOpencodeConfig(config, workspaceId) : {};
  const disabledProviders = runtimeDisabledProviderList(runtimeConfig);
  return {
    ...runtimeConfig,
    default_agent: runtimeConfig.default_agent ?? "venomcowork",
    agent: {
      venomcowork: {
        description: "VenomCowork default agent",
        mode: "primary",
        temperature: 0.2,
        prompt: VENOMCOWORK_AGENT_PROMPT,
      },
    },
    plugin: [
      "opencode-chrome-devtools",
      venomcoworkExtensionsPreviewPluginPath(),
      venomcoworkCapabilitiesKnowledgePluginPath(),
      ...runtimePluginList(runtimeConfig),
    ],
    ...(disabledProviders.length ? { disabled_providers: disabledProviders } : {}),
    mcp: runtimeMcpMap(runtimeConfig),
  };
}

export async function buildVenomcoworkRuntimeConfig(config?: ServerConfig, workspaceId?: string): Promise<string> {
  return JSON.stringify(await buildVenomcoworkRuntimeConfigObject(config, workspaceId));
}
