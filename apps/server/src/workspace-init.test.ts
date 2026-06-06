import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile, mkdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ensureWorkspaceFiles } from "./workspace-init.js";
import { venomcoworkExtensionsPreviewPluginPath, venomcoworkPluginPath } from "./venomcowork-extensions-plugin-path.js";

async function withWorkspace(fn: (root: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), "venomcowork-workspace-init-"));
  try {
    await fn(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

describe("ensureWorkspaceFiles", () => {
  test("creates VenomCowork workspace config without writing opencode config", async () => {
    await withWorkspace(async (root) => {
      const result = await ensureWorkspaceFiles(root, "starter");
      const venomcowork = await readFile(join(root, ".opencode", "venomcowork.json"), "utf8");
      await expect(readFile(join(root, "opencode.jsonc"), "utf8")).rejects.toThrow();
      expect(venomcowork).toContain('"authorizedRoots"');
      expect(result.reloadReasons).toEqual([]);

      const secondResult = await ensureWorkspaceFiles(root, "starter");
      expect(secondResult).toEqual({ changed: false, reloadReasons: [] });
    });
  });

  test("uses shipped extension preview plugin", async () => {
    const pluginPath = venomcoworkExtensionsPreviewPluginPath();
    const plugin = await readFile(pluginPath, "utf8");
    expect(pluginPath).toContain(join("opencode-plugins", "venomcowork-extensions-preview.ts"));
    expect(plugin).toContain("venomcowork_extension_call");
  });

  test("uses external resources plugin path in packaged Electron", () => {
    const previousResourcesPath = process.resourcesPath;
    const resourcesPath = join("/Applications", "VenomCowork.app", "Contents", "Resources");
    process.resourcesPath = resourcesPath;
    try {
      const pluginPath = venomcoworkPluginPath(
        "venomcowork-extensions-preview",
        join(resourcesPath, "app.asar", "server", "dist"),
      );

      expect(pluginPath).toBe(join(resourcesPath, "opencode-plugins", "venomcowork-extensions-preview.js"));
      expect(pluginPath).not.toContain("app.asar");
    } finally {
      if (previousResourcesPath) {
        process.resourcesPath = previousResourcesPath;
      } else {
        delete process.resourcesPath;
      }
    }
  });

  test("does not create workspace extension preview plugin", async () => {
    await withWorkspace(async (root) => {
      await ensureWorkspaceFiles(root, "starter");
      await expect(stat(join(root, ".opencode", "plugins", "venomcowork-extensions-preview.ts"))).rejects.toThrow();
    });
  });

  test("does not rewrite existing VenomCowork agents", async () => {
    await withWorkspace(async (root) => {
      await mkdir(join(root, ".opencode", "agents"), { recursive: true });
      await writeFile(join(root, ".opencode", "agents", "venomcowork.md"), "---\ndescription: Old\n---\n\nOld instructions\n", "utf8");
      const result = await ensureWorkspaceFiles(root, "starter");
      const agent = await readFile(join(root, ".opencode", "agents", "venomcowork.md"), "utf8");
      expect(agent).toContain("Old instructions");
      expect(agent).not.toContain("VenomCowork Artifacts");
      expect(result.reloadReasons).toEqual([]);
    });
  });

  test("does not rewrite an existing valid opencode config", async () => {
    await withWorkspace(async (root) => {
      const configPath = join(root, "opencode.jsonc");
      const config = `{
  // User formatting should survive routine workspace resolution.
  "$schema": "https://opencode.ai/config.json",
  "default_agent": "custom"
}
`;
      await writeFile(configPath, config, "utf8");

      const result = await ensureWorkspaceFiles(root, "starter");

      expect(await readFile(configPath, "utf8")).toBe(config);
      expect(result.reloadReasons).not.toContain("config");
    });
  });

  test("does not add a default agent to an existing valid opencode config", async () => {
    await withWorkspace(async (root) => {
      const configPath = join(root, "opencode.jsonc");
      const config = `{
  // Existing project configs must not trigger reload events on route reads.
  "$schema": "https://opencode.ai/config.json"
}
`;
      await writeFile(configPath, config, "utf8");

      const result = await ensureWorkspaceFiles(root, "starter");

      expect(await readFile(configPath, "utf8")).toBe(config);
      expect(result.reloadReasons).not.toContain("config");
    });
  });

  test("does not repair or inject into desktop-created schema-only opencode config", async () => {
    await withWorkspace(async (root) => {
      await mkdir(join(root, ".opencode"), { recursive: true });
      await writeFile(join(root, ".opencode", "venomcowork.json"), "{}\n", "utf8");
      const configPath = join(root, "opencode.jsonc");
      await writeFile(configPath, `{
  "$schema": "https://opencode.ai/config.json"
}
`, "utf8");

      const result = await ensureWorkspaceFiles(root, "starter");
      const config = await readFile(configPath, "utf8");

      expect(config).toBe(`{
  "$schema": "https://opencode.ai/config.json"
}
`);
      expect(result.reloadReasons).not.toContain("config");
    });
  });
});
