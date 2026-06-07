#!/usr/bin/env node
/**
 * VenomCowork Desktop - Manual Rebuild
 *
 * Runs the FULL build pipeline: electron-build.mjs (compile TS, copy assets)
 * + electron-builder (pack asar, create win-unpacked). This is equivalent to:
 *
 *   pnpm --filter @venom-cowork/desktop run package:electron:dir
 *
 * Use from the project root:
 *
 *   pnpm desktop:rebuild
 *
 * IMPORTANT: build:electron alone does NOT rebuild the asar.
 * Only electron-builder packs the asar, so this script runs both steps.
 * The "VenomCowork" shortcut on your Desktop points to the win-unpacked
 * directory, so any successful rebuild is immediately usable.
 */

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const desktopRoot = resolve(__dirname, "..");
const repoRoot = resolve(desktopRoot, "../..");
const exePath = resolve(
  desktopRoot,
  "dist-electron",
  "win-unpacked",
  "VenomCowork.exe",
);

const pnpmCmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(label, command, args, cwd) {
  console.log(`[desktop:rebuild] ${label}...`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`[desktop:rebuild] ${label} FAILED (exit ${result.status})`);
    process.exit(result.status ?? 1);
  }
  console.log(`[desktop:rebuild] ${label} OK`);
}

const t0 = Date.now();
console.log("[desktop:rebuild] Starting full rebuild (compile + asar pack)...");
console.log(`[desktop:rebuild] cwd: ${repoRoot}`);
console.log("");

// Step 1: compile TS, bundle, copy assets (electron-build.mjs)
run(
  "Step 1/2: electron-build.mjs",
  process.execPath,
  [resolve(desktopRoot, "scripts", "electron-build.mjs")],
  repoRoot,
);

console.log("");

// Step 2: electron-builder packs asar + creates win-unpacked
run(
  "Step 2/2: electron-builder (--dir, no NSIS installer)",
  pnpmCmd,
  ["exec", "electron-builder", "--config", "electron-builder.yml", "--dir"],
  desktopRoot,
);

const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
console.log("");
console.log(`[desktop:rebuild] Full rebuild complete in ${elapsed}s`);
console.log(`[desktop:rebuild] exe: ${exePath}`);
console.log("[desktop:rebuild] Double-click 'VenomCowork' on your Desktop to launch.");
