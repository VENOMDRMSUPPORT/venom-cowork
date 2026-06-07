/**
 * Component Preview Manager
 *
 * Detects UI component files, manages dev-server lifecycle,
 * and provides preview URLs for the built-in browser.
 */

/** File extensions that can be previewed in a browser (with dev server) */
export const UI_COMPONENT_EXTENSIONS = new Set([
  ".tsx",
  ".jsx",
  ".vue",
  ".svelte",
  ".astro",
]);

/** File extensions that are directly browser-previewable (no compilation needed) */
export const STATIC_PREVIEW_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".less",
]);

/** All extensions that should trigger a browser preview option */
export const PREVIEWABLE_EXTENSIONS = new Set([
  ...UI_COMPONENT_EXTENSIONS,
  ...STATIC_PREVIEW_EXTENSIONS,
]);

/** Common dev server ports and their frameworks */
const KNOWN_DEV_SERVERS: Record<number, string> = {
  3000: "next",
  3001: "next-alt",
  4200: "angular",
  5173: "vite",
  5174: "vite-alt",
  5175: "vite-preview",
  7007: "nuxt",
  8080: "webpack",
  8081: "webpack-alt",
  9000: "remix",
};

export type DevServerStatus =
  | { status: "none" }
  | { status: "detecting"; port: number }
  | { status: "running"; port: number; url: string; framework: string }
  | { status: "starting"; port: number }
  | { status: "error"; port: number; error: string };

/**
 * Check if a file extension is previewable in the browser.
 */
export function isPreviewableFile(filePath: string): boolean {
  const ext = getExtension(filePath);
  return PREVIEWABLE_EXTENSIONS.has(ext);
}

/**
 * Check if a file needs a dev server (React/Vue/Svelte components).
 */
export function needsDevServer(filePath: string): boolean {
  const ext = getExtension(filePath);
  return UI_COMPONENT_EXTENSIONS.has(ext);
}

/**
 * Check if a file can be opened directly (HTML/CSS).
 */
export function isStaticPreviewable(filePath: string): boolean {
  const ext = getExtension(filePath);
  return STATIC_PREVIEW_EXTENSIONS.has(ext);
}

/**
 * Detect likely dev server port from workspace context.
 * Checks common port patterns and package.json scripts.
 */
export function detectLikelyPort(workspaceRoot: string): number | null {
  // Check package.json for dev scripts
  try {
    const fs = window.require?.("fs") ?? globalThis.require?.("fs");
    if (!fs) return null;

    const pkgPath = `${workspaceRoot}/package.json`;
    if (!fs.existsSync(pkgPath)) return null;

    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const scripts = pkg.scripts ?? {};

    // Detect framework from dependencies
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    // Next.js
    if (allDeps.next || scripts.dev?.includes("next")) return 3000;

    // Vite
    if (allDeps.vite || scripts.dev?.includes("vite")) return 5173;

    // Angular
    if (allDeps["@angular/core"] || scripts.start?.includes("ng serve")) return 4200;

    // Nuxt
    if (allDeps.nuxt || scripts.dev?.includes("nuxt")) return 7007;

    // Remix
    if (allDeps.remix || scripts.dev?.includes("remix")) return 9000;

    // Webpack
    if (allDeps.webpack || scripts.start?.includes("webpack")) return 8080;

    // Parse port from dev script
    const devScript = scripts.dev ?? scripts.start ?? "";
    const portMatch = devScript.match(/--port\s+(\d+)/);
    if (portMatch?.[1]) return parseInt(portMatch[1], 10);

    // Parse from VITE_PORT or PORT env vars in script
    const envPortMatch = devScript.match(/(?:PORT|VITE_PORT)[:=](\d+)/);
    if (envPortMatch?.[1]) return parseInt(envPortMatch[1], 10);

    return null;
  } catch {
    return null;
  }
}

/**
 * Probe a port to check if a dev server is running.
 */
export async function probeDevServer(port: number, timeoutMs = 2000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`http://localhost:${port}`, {
      method: "HEAD",
      signal: controller.signal,
      mode: "no-cors",
    });

    clearTimeout(timer);
    return true; // Any response means server is running
  } catch {
    return false;
  }
}

/**
 * Find a running dev server on common ports.
 */
export async function findRunningDevServer(): Promise<{ port: number; url: string } | null> {
  const commonPorts = [3000, 3001, 5173, 5174, 4200, 8080, 7007, 9000];

  for (const port of commonPorts) {
    if (await probeDevServer(port)) {
      return { port, url: `http://localhost:${port}` };
    }
  }

  return null;
}

/**
 * Build a preview URL for a specific file component.
 * This creates a wrapper HTML that imports and renders the component.
 */
export function buildComponentPreviewUrl(
  filePath: string,
  devServerPort: number,
  baseUrl?: string,
): string {
  const base = baseUrl ?? `http://localhost:${devServerPort}`;
  const normalizedPath = filePath.replace(/\\/g, "/");

  // For Vite-based projects, use the module directly
  // The dev server serves files relative to the project root
  return `${base}/${normalizedPath}`;
}

/**
 * Generate a standalone HTML wrapper for previewing a component.
 * This is used when no dev server is available.
 */
export function generateComponentPreviewHtml(
  componentCode: string,
  filePath: string,
): string {
  const ext = getExtension(filePath);
  const isReact = ext === ".tsx" || ext === ".jsx";

  if (isReact) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview: ${filePath.split("/").pop()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 2rem; background: #0a0a0a; color: #ededed; }
    .preview-container { max-width: 1200px; margin: 0 auto; }
    .preview-header { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #222; }
    .preview-header h1 { font-size: 1.25rem; font-weight: 500; }
    .preview-header p { font-size: 0.875rem; color: #888; margin-top: 0.25rem; }
    .source-code { background: #111; border: 1px solid #222; border-radius: 8px; padding: 1rem; overflow-x: auto; }
    .source-code pre { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; line-height: 1.6; white-space: pre-wrap; }
    .note { background: #1a1a2e; border: 1px solid #333; border-radius: 8px; padding: 1rem; margin-top: 1rem; font-size: 0.875rem; color: #aaa; }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-header">
      <h1>Component Preview</h1>
      <p>${filePath}</p>
    </div>
    <div class="note">
      This is a React/JSX component that requires a dev server to render properly.
      Start the dev server with <code>pnpm dev</code> and the component will render live.
    </div>
    <div class="source-code">
      <pre>${escapeHtml(componentCode)}</pre>
    </div>
  </div>
</body>
</html>`;
  }

  // For plain HTML/CSS, return as-is
  return componentCode;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getExtension(filePath: string): string {
  const name = filePath.split("/").pop() ?? "";
  const dotIndex = name.lastIndexOf(".");
  return dotIndex >= 0 ? name.slice(dotIndex).toLowerCase() : "";
}

/**
 * Get the framework name from a file path or project context.
 */
export function detectFramework(workspaceRoot: string): string {
  try {
    const fs = window.require?.("fs") ?? globalThis.require?.("fs");
    if (!fs) return "unknown";

    const pkgPath = `${workspaceRoot}/package.json`;
    if (!fs.existsSync(pkgPath)) return "unknown";

    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    if (allDeps.next) return "next";
    if (allDeps.nuxt) return "nuxt";
    if (allDeps["@angular/core"]) return "angular";
    if (allDeps.svelte || allDeps["@sveltejs/kit"]) return "svelte";
    if (allDeps.vue || allDeps.nuxt) return "vue";
    if (allDeps.remix || allDeps["@remix-run/react"]) return "remix";
    if (allDeps.vite) return "vite";
    if (allDeps.webpack) return "webpack";

    return "unknown";
  } catch {
    return "unknown";
  }
}
