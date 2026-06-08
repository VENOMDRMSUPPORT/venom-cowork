# Local development (VenomCowork)

This guide covers **local-only** development: desktop app, renderer, and server on your machine. Cloud (`ee/` / Den) is optional and not required here.

## Requirements

- Node.js 20+
- pnpm 10+ (`corepack enable`)
- Bun 1.3+ (server tests and orchestrator binaries)
- Windows: Visual Studio Build Tools with **Desktop development with C++** (for native modules)

## First-time setup

```bash
pnpm install
node scripts/generate-icons.mjs
```

## Run the app

| Goal | Command |
|---|---|
| Full desktop (Windows) | `pnpm dev:windows` |
| Full desktop (macOS/Linux) | `pnpm dev` |
| Renderer only (no Electron) | `pnpm dev:ui` |
| UI component playground | `pnpm dev:ui-demo` |

Dev mode sets `VENOMCOWORK_DEV_MODE=1` and uses an isolated engine state separate from your global OpenCode config.

## Verify before pushing

Run the project baseline checks:

```bash
pnpm verify
```

This runs:

1. `pnpm typecheck` (renderer)
2. Server TypeScript check
3. Server unit tests (excludes `*.e2e.test.ts` and a few SQLite-heavy suites — see `apps/server/script/run-unit-tests.mjs`)
4. App unit tests (excludes a few broken/outdated suites — see `scripts/verify.mjs`)

CI runs the same pipeline on push/PR via `.github/workflows/ci.yml`.

### Optional smoke tests (need `opencode` CLI in PATH)

```bash
pnpm test:refactor   # typecheck + health + sessions against a spawned engine
pnpm test:e2e        # broader integration scripts
```

## Optional configuration

Copy `.env.local.example` to `.env.local` and set only what you need:

- Docs, support, and release URLs for Settings links
- Skill hub GitHub repo (`VENOMCOWORK_HUB_*` / `VITE_VENOMCOWORK_HUB_*`)
- Updater feed URLs when you ship signed builds

Leave **Den / cloud** variables unset to keep the app fully local.

## Project layout (local stack)

```
apps/desktop   Electron shell — spawns server + engine, loads UI
apps/app       React renderer (Vite)
apps/server    Local API — workspaces, skills, MCP, plugins
apps/orchestrator   CLI: venomcowork
```

Data flow: **Renderer → VenomCowork server → OpenCode engine** on `127.0.0.1`.

## Build desktop installer

```bash
node apps/desktop/scripts/electron-build.mjs
cd apps/desktop && pnpm exec electron-builder --config electron-builder.yml
```

See [README.md](../README.md) for platform-specific output paths and signing env vars.

## Troubleshooting (Windows)

- **`node-pty` / native build errors**: run `pnpm dev:windows` (uses VsDevCmd), not raw `pnpm dev`.
- **Port conflicts**: dev server picks ports in 48000–51000; restart if a stale process holds one.
- **Cloud UI showing up**: check that `VITE_DEN_BASE_URL` is not set in your build env.

## Out of scope (local-only)

These are not needed for local desktop work:

- `pnpm dev:den`, `pnpm dev:web`, `pnpm dev:den:api`
- `ee/` packages (Den API, Den Web, inference)

The `ee/` tree remains in the repo for future use but can stay out of your daily workflow.
