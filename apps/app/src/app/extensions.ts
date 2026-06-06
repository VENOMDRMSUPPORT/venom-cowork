import type { ReloadReason } from "./types";

export type VenomCoworkExtensionSourceFormat =
  | "venomcowork-builtin"
  | "venomcowork-extension-manifest"
  | "claude-plugin"
  | "opencode-plugin"
  | "mcp-directory"
  | "manual";

export type VenomCoworkExtensionSource = {
  format: VenomCoworkExtensionSourceFormat;
  trusted: boolean;
  origin?: "builtin" | "den" | "workspace" | "local";
  reference?: string;
};

export type VenomCoworkExtensionResourceType =
  | "skill"
  | "agent"
  | "command"
  | "tool"
  | "mcp"
  | "opencode-plugin"
  | "provider"
  | "hook"
  | "context"
  | "secret"
  | "file"
  | "local-service"
  | "native-binary";

export type VenomCoworkExtensionResource = {
  type: VenomCoworkExtensionResourceType;
  id: string;
  label?: string;
  description?: string;
  path?: string;
  command?: string[];
  envKey?: string;
  packageName?: string;
  providerId?: string;
  mcpServerName?: string;
  localCommandRef?: "venomcowork.computerUseMcp" | "venomcowork.uiMcp";
  required?: boolean;
};

export type VenomCoworkExtensionContributionType =
  | "settings-panel"
  | "setup-instructions"
  | "composer-prompt"
  | "session-side-panel"
  | "session-rail-item"
  | "control-actions"
  | "server-route"
  | "native-capability"
  | "test-action";

export type VenomCoworkExtensionContribution = {
  type: VenomCoworkExtensionContributionType;
  ref?: string;
  label?: string;
  description?: string;
  prompt?: string;
  location?: "settings-detail" | "composer" | "session-right-pane" | "session-rail" | "server" | "native";
};

export type VenomCoworkExtensionSetup = {
  instructions?: string;
  primaryCta?: string;
  secondaryCta?: string;
  requiredEnv?: string[];
  testActionRef?: string;
};

export type VenomCoworkExtensionLifecycle = {
  reload?: ReloadReason[];
  detection?: string[];
};

// ---------------------------------------------------------------------------
// Enablement â€” declarative conditions for extension "active" state
// ---------------------------------------------------------------------------

export type EnablementConditionType =
  | "mcp-connected"
  | "plugin-loaded"
  | "provider-connected"
  | "env-set"
  | "permission-granted"
  | "toggle-enabled";

export type EnablementCondition = {
  type: EnablementConditionType;
  /** What to check â€” MCP server name, plugin id, env key, etc. */
  ref: string;
  /** Human-readable label shown in the UI. */
  label: string;
};

/** Result of evaluating a single enablement condition at runtime. */
export type EnablementResult = {
  condition: EnablementCondition;
  met: boolean;
};

export type VenomCoworkExtensionManifest = {
  schemaVersion: 1;
  id: string;
  name: string;
  description: string;
  preview?: boolean;
  source: VenomCoworkExtensionSource;
  icon?: {
    src?: string;
    simpleIconSlug?: string;
  };
  composer?: {
    prompt: string;
  };
  setup?: VenomCoworkExtensionSetup;
  resources: VenomCoworkExtensionResource[];
  contributions?: VenomCoworkExtensionContribution[];
  lifecycle?: VenomCoworkExtensionLifecycle;
  /** Declarative conditions that must ALL be true for the extension to be "active". */
  enablement?: EnablementCondition[];
  defaultEnabled?: boolean;
  defaultHidden?: boolean;
  platform?: Array<"darwin" | "linux" | "windows" | "web">;
};

export function extensionContribution(
  manifest: VenomCoworkExtensionManifest | undefined,
  type: VenomCoworkExtensionContributionType,
): VenomCoworkExtensionContribution | undefined {
  return manifest?.contributions?.find((contribution) => contribution.type === type);
}

export function extensionResource(
  manifest: VenomCoworkExtensionManifest | undefined,
  type: VenomCoworkExtensionResourceType,
): VenomCoworkExtensionResource | undefined {
  return manifest?.resources.find((resource) => resource.type === type);
}

export function isTrustedBuiltInExtension(manifest: VenomCoworkExtensionManifest | undefined): boolean {
  return manifest?.source.origin === "builtin" && manifest.source.trusted;
}

export const BUILT_IN_VENOMCOWORK_EXTENSION_MANIFESTS: VenomCoworkExtensionManifest[] = [
  {
    schemaVersion: 1,
    id: "venomcowork-browser",
    name: "VenomCowork Browser",
    description: "Automate the built-in browser panel that stays visible inside VenomCowork.",
    source: { format: "venomcowork-builtin", origin: "builtin", trusted: true },
    icon: { src: "/venomcowork-mark.svg" },
    composer: { prompt: "Use the VenomCowork Browser extension to " },
    setup: {
      instructions: "VenomCowork Browser is ready by default in desktop workspaces.",
    },
    resources: [
      {
        type: "opencode-plugin",
        id: "opencode-chrome-devtools",
        packageName: "opencode-chrome-devtools",
        required: true,
      },
    ],
    contributions: [
      { type: "settings-panel", ref: "venomcowork.browser.settings", location: "settings-detail" },
      { type: "session-side-panel", ref: "venomcowork.browser.panel", location: "session-right-pane" },
      { type: "composer-prompt", prompt: "Use the VenomCowork Browser extension to ", location: "composer" },
    ],
    enablement: [
      { type: "toggle-enabled", ref: "venomcowork-browser", label: "Enabled" },
    ],
    lifecycle: { reload: ["plugins", "agents"], detection: ["plugin:opencode-chrome-devtools"] },
    defaultEnabled: true,
  },
  {
    schemaVersion: 1,
    id: "computer-use",
    name: "Computer Use",
    description: "Mac only: control Mac apps through semantic accessibility refs, screenshots, background-safe clicks, keyboard input, and strict mode.",
    preview: true,
    source: { format: "venomcowork-builtin", origin: "builtin", trusted: true },
    icon: { src: "/venomcowork-mark.svg" },
    composer: { prompt: "Use Computer Use to " },
    setup: {
      instructions: "Computer Use is Mac only. It runs as a local MCP server backed by the macOS accessibility runtime. Grant Accessibility and Screen Recording permissions when macOS asks, then connect the MCP server in this workspace.",
      primaryCta: "Connect Computer Use MCP",
      secondaryCta: "Check macOS permissions",
      testActionRef: "venomcowork.computerUse.healthCheck",
    },
    resources: [
      {
        type: "mcp",
        id: "computer-use-mcp",
        label: "Computer Use MCP",
        mcpServerName: "computer-use",
        command: ["npx", "-y", "@venom-cowork/handsfree", "mcp"],
        localCommandRef: "venomcowork.computerUseMcp",
        required: true,
      },
      {
        type: "native-binary",
        id: "computer-use-native",
        label: "macOS accessibility runtime",
        packageName: "@venom-cowork/handsfree",
        required: true,
      },
    ],
    contributions: [
      { type: "setup-instructions", ref: "venomcowork.computerUse.setup", location: "settings-detail" },
      { type: "native-capability", ref: "venomcowork.computerUse.axPermissions", label: "Accessibility and Screen Recording" },
      { type: "test-action", ref: "venomcowork.computerUse.healthCheck", label: "Verify Computer Use MCP" },
      { type: "composer-prompt", prompt: "Use Computer Use to ", location: "composer" },
    ],
    enablement: [
      { type: "mcp-connected", ref: "computer-use", label: "MCP server connected" },
      { type: "permission-granted", ref: "accessibility", label: "Accessibility permission" },
      { type: "permission-granted", ref: "screenRecording", label: "Screen Recording permission" },
    ],
    lifecycle: { reload: ["mcp"], detection: ["mcp:computer-use"] },
    platform: ["darwin"],
  },
  {
    schemaVersion: 1,
    id: "openai-image-gen",
    name: "OpenAI Image Gen",
    description: "Generate image artifacts with gpt-image-2.",
    source: { format: "venomcowork-builtin", origin: "builtin", trusted: true },
    icon: { src: "/ext-openai.svg" },
    composer: { prompt: "Use the OpenAI Image Gen extension to " },
    setup: {
      instructions: "Add an OpenAI API key, then agents can generate image artifacts through VenomCowork extension actions.",
      primaryCta: "Enable image generation",
      secondaryCta: "Generate test image",
      requiredEnv: ["OPENAI_API_KEY"],
      testActionRef: "venomcowork.imageGen.testGenerate",
    },
    resources: [
      { type: "secret", id: "openai-api-key", envKey: "OPENAI_API_KEY", required: true },
      { type: "local-service", id: "openai-image-generation-service", label: "OpenAI image generation", required: true },
      { type: "tool", id: "openai-image-generate", label: "Image generation", required: true },
    ],
    contributions: [
      { type: "settings-panel", ref: "venomcowork.imageGen.settings", location: "settings-detail" },
      { type: "test-action", ref: "venomcowork.imageGen.testGenerate", label: "Generate test image" },
      { type: "composer-prompt", prompt: "Use the OpenAI Image Gen extension to ", location: "composer" },
    ],
    enablement: [
      { type: "env-set", ref: "OPENAI_API_KEY", label: "OpenAI API key" },
    ],
    lifecycle: { reload: ["config"], detection: ["env:OPENAI_API_KEY"] },
  },
  {
    schemaVersion: 1,
    id: "venomcowork-voice",
    name: "Voice Mode",
    description: "Talk to VenomCowork through a Realtime voice panel that drives the same semantic UI controls as VenomCowork UI MCP.",
    preview: true,
    source: { format: "venomcowork-builtin", origin: "builtin", trusted: true },
    icon: { src: "/venomcowork-mark.svg" },
    composer: { prompt: "Use Voice Mode to " },
    setup: {
      instructions: "Voice Mode uses OpenAI Realtime. Save an OpenAI API key in VenomCowork env vars, then open the session rail panel and speak or send a typed voice command.",
      primaryCta: "Save OpenAI key",
      secondaryCta: "Test Realtime",
      requiredEnv: ["OPENAI_REALTIME_API_KEY", "OPENAI_API_KEY"],
      testActionRef: "venomcowork.voice.testRealtime",
    },
    resources: [
      { type: "secret", id: "openai-realtime-api-key", envKey: "OPENAI_REALTIME_API_KEY", required: false },
      { type: "secret", id: "openai-api-key", envKey: "OPENAI_API_KEY", required: true },
      { type: "local-service", id: "venomcowork-voice-realtime-session", label: "Realtime client-secret minting", required: true },
    ],
    contributions: [
      { type: "settings-panel", ref: "venomcowork.voice.settings", location: "settings-detail" },
      { type: "session-side-panel", ref: "venomcowork.voice.panel", location: "session-right-pane" },
      { type: "session-rail-item", ref: "venomcowork.voice.rail", label: "Voice Mode", location: "session-rail" },
      { type: "server-route", ref: "POST /voice/realtime/session", location: "server" },
      { type: "control-actions", ref: "venomcowork.voice.controlActions" },
      { type: "test-action", ref: "venomcowork.voice.testRealtime", label: "Test Realtime" },
      { type: "composer-prompt", prompt: "Use Voice Mode to ", location: "composer" },
    ],
    enablement: [
      { type: "toggle-enabled", ref: "venomcowork-voice", label: "Enabled" },
      { type: "env-set", ref: "OPENAI_API_KEY", label: "OpenAI API key" },
    ],
    lifecycle: { reload: ["config"], detection: ["env:OPENAI_REALTIME_API_KEY", "env:OPENAI_API_KEY"] },
  },
  {
    schemaVersion: 1,
    id: "google-workspace",
    name: "Google Workspace",
    description: "Let VenomCowork help with meetings, selected Drive files, and Gmail drafts.",
    preview: true,
    source: { format: "venomcowork-builtin", origin: "builtin", trusted: true },
    icon: { simpleIconSlug: "google" },
    composer: { prompt: "Use Google Workspace to " },
    setup: {
      instructions: "Connect your Google account to use Calendar, Drive, and Gmail drafts in VenomCowork.",
      primaryCta: "Connect Google Workspace",
      secondaryCta: "Test connection",
      testActionRef: "venomcowork.googleWorkspace.testConnection",
    },
    resources: [
      { type: "provider", id: "google-oauth", label: "Google account", providerId: "google-workspace", required: true },
      { type: "local-service", id: "google-workspace-connector", label: "Secure local connection", required: true },
      { type: "tool", id: "google-calendar-read", label: "Calendar", required: true },
      { type: "tool", id: "google-gmail-drafts", label: "Gmail drafts", required: true },
      { type: "tool", id: "google-drive-selected-files", label: "Selected Drive files", required: true },
    ],
    contributions: [
      { type: "settings-panel", ref: "venomcowork.googleWorkspace.settings", location: "settings-detail" },
      { type: "test-action", ref: "venomcowork.googleWorkspace.testConnection", label: "Test Google Workspace" },
      { type: "composer-prompt", prompt: "Use Google Workspace to ", location: "composer" },
    ],
    lifecycle: { reload: ["config"], detection: ["provider:google-workspace"] },
  },
  {
    schemaVersion: 1,
    id: "ollama",
    name: "Ollama",
    description: "Local model provider at http://localhost:11434.",
    source: { format: "venomcowork-builtin", origin: "builtin", trusted: true },
    icon: { src: "/ext-ollama.svg" },
    composer: { prompt: "Use the Ollama extension to " },
    setup: {
      instructions: "Run Ollama locally, choose or pull a model, then add it as an OpenCode provider.",
      primaryCta: "Add Ollama model",
      secondaryCta: "Pull model",
    },
    resources: [
      { type: "local-service", id: "ollama-api", label: "Ollama API", description: "http://localhost:11434", required: true },
      { type: "provider", id: "ollama", providerId: "ollama", packageName: "@ai-sdk/openai-compatible", required: true },
    ],
    contributions: [
      { type: "settings-panel", ref: "venomcowork.ollama.settings", location: "settings-detail" },
      { type: "test-action", ref: "venomcowork.ollama.listModels", label: "Check local models" },
      { type: "composer-prompt", prompt: "Use the Ollama extension to ", location: "composer" },
    ],
    enablement: [
      { type: "provider-connected", ref: "ollama", label: "Ollama provider" },
    ],
    lifecycle: { reload: ["config"], detection: ["provider:ollama"] },
  },
];
