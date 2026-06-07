#!/usr/bin/env node
/**
 * VenomCowork Desktop - Manual Rebuild
 *
 * Runs the same pipeline as `pnpm --filter @venom-cowork/desktop build:electron`
 * and prints a clear summary. Use this from the project root:
 *
 *   pnpm desktop:rebuild
 *
 * The "VenomCowork" shortcut on your Desktop points to the win-unpacked
 * directory, so any successful rebuild is immediately usable.
 */

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const desktopRoot = resolve(__dirname, "..");
const repoRoot = resolve(desktopRoot, "../..");
const buildScript = resolve(__dirname, "electron-build.mjs");
const exePath = resolve(
  desktopRoot,
  "dist-electron",
  "win-unpacked",
  "VenomCowork.exe",
);

const t0 = Date.now();
console.log("[desktop:rebuild] Starting rebuild...");
console.log(`[desktop:rebuild] cwd: ${repoRoot}`);

const result = spawnSync(process.execPath, [buildScript], {
  cwd: repoRoot,
  stdio: "inherit",
});

if (result.status !== 0) {
  console.error(`[desktop:rebuild] BUILD FAILED (exit ${result.status})`);
  process.exit(result.status ?? 1);
}

const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
console.log("");
console.log(`[desktop:rebuild] OK in ${elapsed}s`);
console.log(`[desktop:rebuild] exe: ${exePath}`);
console.log("[desktop:rebuild] Double-click the 'VenomCowork' shortcut on your Desktop to launch the new build.");
