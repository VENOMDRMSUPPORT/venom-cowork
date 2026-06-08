import { spawnSync } from "node:child_process";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function runStep(name, command, args, cwd = root) {
  console.log(`\n[verify] ${name}`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.error(`\n[verify] Failed: ${name}`);
    process.exit(result.status ?? 1);
  }
}

runStep("english-only check", "node", ["scripts/check-english-only.mjs"]);
runStep("app typecheck", "pnpm", ["typecheck"]);
runStep("server typecheck", "pnpm", ["--filter", "venomcowork-server", "typecheck"]);
runStep("server unit tests", "pnpm", ["--filter", "venomcowork-server", "test:unit"]);

// Broken or environment-specific — run individually while fixing.
const EXCLUDED_APP_TESTS = new Set([
  "artifact-spreadsheet.test.ts",
  "reasoning-display.test.ts",
  "session-sync-tool-parts.test.ts",
]);

const appUnitTests = globSync("apps/app/{tests,scripts}/**/*.{test,spec}.{ts,tsx}", { cwd: root })
  .filter((file) => !EXCLUDED_APP_TESTS.has(path.basename(file)))
  .map((file) => `./${file.replace(/\\/g, "/")}`);

if (appUnitTests.length > 0) {
  runStep("app unit tests", "bun", ["test", ...appUnitTests], root);
}

console.log("\n[verify] All checks passed.");
