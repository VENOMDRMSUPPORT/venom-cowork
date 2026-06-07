#!/usr/bin/env node
/**
 * VenomCowork Desktop - Auto-Rebuild Watcher
 *
 * Watches the source folders that affect the Electron build, debounces
 * changes, and runs `electron-build.mjs` automatically. After a successful
 * rebuild, the "VenomCowork" shortcut on your Desktop will open the new
 * exe on the next launch (the shortcut target is the same path).
 *
 * Usage:
 *   pnpm desktop:watch                # watch + rebuild
 *   pnpm desktop:watch -- --launch    # rebuild, then launch the new exe
 *
 * Watched paths (relative to repo root):
 *   - apps/desktop/electron/**
 *   - apps/desktop/server/**
 *   - apps/desktop/resources/**
 *   - apps/desktop/package.json
 *   - apps/desktop/electron-builder.yml
 *   - apps/server/src/**
 *   - apps/app/src/**
 *
 * Ctrl+C to stop.
 */

import { spawn } from "node:child_process";
import * as fs from "node:fs";
import { existsSync, statSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..", "..");

const WATCH_GLOBS = [
  "apps/desktop/electron",
  "apps/desktop/server",
  "apps/desktop/resources",
  "apps/desktop/package.json",
  "apps/desktop/electron-builder.yml",
  "apps/server/src",
  "apps/app/src",
];

const DEBOUNCE_MS = 1500;
const args = new Set(process.argv.slice(2));
const shouldLaunch = args.has("--launch");

const buildScript = resolve(__dirname, "electron-build.mjs");
const exePath = resolve(
  repoRoot,
  "apps",
  "desktop",
  "dist-electron",
  "win-unpacked",
  "VenomCowork.exe",
);

function color(s, c) {
  const codes = { red: 31, green: 32, yellow: 33, cyan: 36, dim: 90 };
  return process.stdout.isTTY ? `\x1b[${codes[c]}m${s}\x1b[0m` : s;
}

function logInfo(msg) {
  console.log(`${color("[desktop:watch]", "cyan")} ${msg}`);
}
function logOk(msg) {
  console.log(`${color("[desktop:watch]", "green")} ${msg}`);
}
function logWarn(msg) {
  console.log(`${color("[desktop:watch]", "yellow")} ${msg}`);
}
function logErr(msg) {
  console.error(`${color("[desktop:watch]", "red")} ${msg}`);
}

let pending = null; // { timer, files: Set<string> }
let building = false;

function recordChange(file) {
  if (!pending) {
    pending = { timer: null, files: new Set() };
  }
  pending.files.add(file);
  if (pending.timer) clearTimeout(pending.timer);
  pending.timer = setTimeout(flushChanges, DEBOUNCE_MS);
}

function flushChanges() {
  const files = pending ? Array.from(pending.files) : [];
  pending = null;
  if (building) {
    logWarn("Build already running, queuing next pass in 3s...");
    setTimeout(() => {
      files.forEach(recordChange);
    }, 3000);
    return;
  }
  runBuild(files);
}

function runBuild(triggerFiles) {
  building = true;
  const t0 = Date.now();
  const summary = triggerFiles
    .slice(0, 5)
    .map((f) => `  - ${relative(repoRoot, f)}`)
    .join("\n");
  const more = triggerFiles.length > 5 ? `\n  ... and ${triggerFiles.length - 5} more` : "";
  logInfo(`Change detected (${triggerFiles.length} file${triggerFiles.length === 1 ? "" : "s"}):\n${summary}${more}`);
  logInfo("Running full rebuild (compile + asar pack)...");

  // Step 1: electron-build.mjs (compile TS, bundle, copy assets)
  const step1 = spawn(process.execPath, [buildScript], {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
  });

  step1.on("exit", (code) => {
    if (code !== 0) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      building = false;
      logErr(`Compile step FAILED (exit ${code}) after ${elapsed}s. Watcher still running.`);
      return;
    }
    logInfo("Compile OK. Packing asar...");

    // Step 2: electron-builder --dir (pack asar + win-unpacked)
    const pnpmCmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
    const step2 = spawn(pnpmCmd, ["exec", "electron-builder", "--config", "electron-builder.yml", "--dir"], {
      cwd: desktopRoot,
      stdio: "inherit",
      shell: true,
      env: process.env,
    });

    step2.on("exit", (code2) => {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      building = false;
      if (code2 === 0) {
        logOk(`Full rebuild complete in ${elapsed}s. The VenomCowork shortcut on your Desktop will open the new exe.`);
        if (shouldLaunch) launchExe();
      } else {
        logErr(`Asar pack FAILED (exit ${code2}) after ${elapsed}s. Watcher still running.`);
      }
    });
  });
}

function launchExe() {
  if (!existsSync(exePath)) {
    logErr(`exe not found at ${exePath}`);
    return;
  }
  logInfo("Launching VenomCowork.exe...");
  const child = spawn(exePath, [], {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

function watchPath(absolutePath) {
  if (!existsSync(absolutePath)) {
    logWarn(`Skipping (not found): ${relative(repoRoot, absolutePath)}`);
    return;
  }
  try {
    const stat = statSync(absolutePath);
    if (stat.isDirectory()) {
      // Recursive directory watch (Node 20+ supports { recursive: true } on Windows).
      const watcher = fs.watch(
        absolutePath,
        { recursive: true },
        (eventType, filename) => {
          if (!filename) return;
          recordChange(resolve(absolutePath, filename));
        },
      );
      watcher.on("error", (err) => logErr(`Watcher error on ${relative(repoRoot, absolutePath)}: ${err.message}`));
      logInfo(`Watching: ${relative(repoRoot, absolutePath)}`);
    } else {
      // Single-file watch.
      const watcher = fs.watch(absolutePath, () => {
        recordChange(absolutePath);
      });
      watcher.on("error", (err) => logErr(`Watcher error on ${relative(repoRoot, absolutePath)}: ${err.message}`));
      logInfo(`Watching: ${relative(repoRoot, absolutePath)}`);
    }
  } catch (err) {
    logErr(`Could not watch ${relative(repoRoot, absolutePath)}: ${err.message}`);
  }
}

console.log("");
logInfo("VenomCowork auto-rebuild watcher");
logInfo(`Repo: ${repoRoot}`);
logInfo(`Build script: ${relative(repoRoot, buildScript)}`);
logInfo(`Output exe:    ${relative(repoRoot, exePath)}`);
logInfo(`Debounce:      ${DEBOUNCE_MS}ms`);
logInfo(`Launch after build: ${shouldLaunch ? "yes" : "no (use --launch)"}`);
console.log("");

for (const rel of WATCH_GLOBS) {
  watchPath(resolve(repoRoot, rel));
}

console.log("");
logInfo("Ready. Edit any source file under the watched paths to trigger a rebuild.");
logInfo("Press Ctrl+C to stop.");
console.log("");

// Keep process alive.
process.on("SIGINT", () => {
  logInfo("Stopping watcher...");
  process.exit(0);
});
