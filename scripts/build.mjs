import { execSync } from "node:child_process";

execSync("pnpm --filter @venom-cowork/desktop build", { stdio: "inherit" });
