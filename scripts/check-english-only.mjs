#!/usr/bin/env node
/**
 * Fail if Arabic script appears in tracked project text files.
 * Run: node scripts/check-english-only.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFE]/;

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "dist-electron",
  "build",
  "out",
  "coverage",
  ".turbo",
  "target",
]);

const SKIP_FILES = new Set(["pnpm-lock.yaml", "package-lock.json", "yarn.lock", "config.json"]);

const TEXT_EXTENSIONS = new Set([
  ".md",
  ".mdc",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonc",
  ".yml",
  ".yaml",
  ".html",
  ".css",
  ".scss",
  ".txt",
  ".sh",
  ".ps1",
  ".sql",
]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (SKIP_DIRS.has(entry)) continue;
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, files);
    } else if (st.isFile()) {
      files.push(full);
    }
  }
  return files;
}

const violations = [];

for (const file of walk(root)) {
  const base = path.basename(file);
  if (SKIP_FILES.has(base)) continue;
  const ext = path.extname(file).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext)) continue;

  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  // Ignore UTF-8 BOM (U+FEFF) — not Arabic text
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }

  if (!ARABIC_RE.test(content)) continue;

  const rel = path.relative(root, file).replace(/\\/g, "/");
  const lineNo =
    content.split(/\r?\n/).findIndex((line) => ARABIC_RE.test(line)) + 1;
  violations.push(`${rel}:${lineNo}`);
}

if (violations.length > 0) {
  console.error("[check-english-only] Arabic script found in project files:\n");
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  console.error(
    "\nThis repository is English-only. Translate Arabic text to English and re-run.",
  );
  process.exit(1);
}

console.log("[check-english-only] OK — no Arabic script in tracked text files.");
