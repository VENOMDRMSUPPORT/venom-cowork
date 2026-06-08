#!/usr/bin/env node
/**
 * Extract English release notes for a version from CHANGELOG.md.
 *
 * Usage:
 *   node scripts/release/extract-notes.mjs 0.15.2
 *   node scripts/release/extract-notes.mjs v0.15.2 > notes.md
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const versionArg = process.argv[2];

if (!versionArg) {
  console.error("Usage: node scripts/release/extract-notes.mjs <version>");
  process.exit(1);
}

const version = versionArg.replace(/^v/, "");
const changelog = readFileSync(path.join(root, "CHANGELOG.md"), "utf8").replace(/^\uFEFF/, "");

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFE]/;
if (ARABIC_RE.test(changelog)) {
  console.error("[extract-notes] CHANGELOG.md contains Arabic script. Translate to English first.");
  process.exit(1);
}

const headerRe = new RegExp(`^## \\[${version.replace(/\./g, "\\.")}\\][^\n]*$`, "m");
const match = headerRe.exec(changelog);

if (!match) {
  console.error(`[extract-notes] No section found for version ${version} in CHANGELOG.md`);
  process.exit(1);
}

const start = match.index;
const rest = changelog.slice(start + match[0].length);
const nextHeader = rest.search(/^## \[/m);
const section = rest.slice(0, nextHeader === -1 ? undefined : nextHeader).trim();

if (!section) {
  console.error(`[extract-notes] Empty section for version ${version}`);
  process.exit(1);
}

console.log(`## VenomCowork v${version}\n\n${section}`);
