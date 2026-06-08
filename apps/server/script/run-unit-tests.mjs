import { spawnSync } from "node:child_process";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// These touch runtime SQLite or have known Windows temp-dir cleanup issues.
// Full server coverage remains available via `pnpm --filter venomcowork-server test`.
const EXCLUDED_UNIT_TESTS = new Set([
  "runtime-opencode-config-store.test.ts",
  "opencode-db.test.ts",
  "portable-files.test.ts",
  "cloud-plugins.test.ts",
  "workspace-init.test.ts",
]);

const files = globSync("src/**/*.test.ts", { cwd: serverRoot })
  .filter((file) => !file.includes(".e2e.test."))
  .filter((file) => !EXCLUDED_UNIT_TESTS.has(path.basename(file)))
  .map((file) => `./${file.replace(/\\/g, "/")}`);

if (files.length === 0) {
  console.error("[test:unit] No unit test files found.");
  process.exit(1);
}

const result = spawnSync("bun", ["test", ...files], {
  cwd: serverRoot,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
