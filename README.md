# VenomCowork

**VenomCowork** is the open-source alternative to Claude Cowork / Codex as a
desktop app. Run local and remote agentic workflows from one place, powered by
[OpenCode](https://github.com/sst/opencode).

This repository is a vanilla rebrand of [OpenWork v0.15.2](https://github.com/different-ai/openwork).
All upstream external endpoints (release feeds, doc sites, support emails,
GitHub orgs) have been removed. Operators are expected to bring their own
update feed, support contact, documentation site, and skill hub before
shipping this build to end users.

> **Not a hosted service.** This fork does not auto-publish anywhere. You build
> the binaries, you sign them, you host them. The in-app updater is a no-op
> until you point it at a feed URL you control.

---

## Core Philosophy

- **Local-first, cloud-ready.** VenomCowork runs on your machine in one click
  and can connect to remote workers when you need them.
- **Server-consumption first.** The desktop app is a client of the local
  VenomCowork server surface; it does not invent a parallel control plane.
- **Composable.** Use the desktop app, the orchestrator CLI, or the opencode
  router — whatever fits the task.
- **Ejectable.** Anything OpenCode can do is available from VenomCowork, even
  before a dedicated UI surface exists.
- **Sharing is caring.** Start solo on `localhost`, then opt into a remote
  worker when your team is ready.

## What is in the box

| App / Package | Path | Purpose |
|---|---|---|
| Desktop shell | `apps/desktop` | Electron shell that wraps the renderer, server, and sidecars into a Windows / macOS / Linux app |
| Renderer UI | `apps/app` | React + Vite + shadcn/ui (Base UI) — the user-facing surface |
| Local server | `apps/server` | Filesystem-backed API for the renderer; hosts skills, plugins, MCP, and the skill hub |
| Orchestrator CLI | `apps/orchestrator` | `venomcowork` binary — orchestrates opencode + venomcowork-server + opencode-router |
| OpenCode router | `apps/opencode-router` | Slack + Telegram bridge that routes messages to a running `opencode` server |
| UI demo | `apps/ui-demo` | Standalone UI playground (no server) |
| `@venom-cowork/venomcowork-ui-mcp` | `packages/venomcowork-ui-mcp` | MCP server exposing UI snapshot / actions / execute as tools |
| `@venom-cowork/email` | `packages/email` | React Email templates (password reset, org invite) |
| `@venom-cowork/types` | `packages/types` | Shared TypeScript types |
| `@venom-cowork/ui` | `packages/ui` | Shared UI primitives |
| `@venom-cowork/handsfree` | `packages/handsfree` | Voice / hands-free control glue |

The `ee/` tree contains the optional VenomCowork Cloud control plane (Den
API, Den Web, landing site, inference, etc.). It is shipped untouched in this
fork — the rebrand only updates the `productName` strings there so the
brand is consistent. To remove the `ee/` apps from your workspace, delete
the directory and any `ee` references in `pnpm-workspace.yaml`.

---

## Quick start

### Requirements

- Node.js 20+ and `pnpm` 10+ (`corepack enable` if you do not have pnpm)
- Bun 1.3+ for building the opencode-plugins and the orchestrator binaries
  (`bun --version`)

### Install

```bash
pnpm install
```

The install may take a few minutes — pnpm fetches Windows, macOS, and Linux
native binaries for `node-pty`, `better-sqlite3`, and a few other packages.
The install only needs to succeed once per checkout.

### Run the desktop app in dev mode

```bash
pnpm dev
```

`pnpm dev` automatically sets `VENOMCOWORK_DEV_MODE=1` and a dedicated
`VENOMCOWORK_ELECTRON_REMOTE_DEBUG_PORT` so desktop development uses an
isolated OpenCode state instead of your personal global config.

### Run the renderer only (no Electron shell)

```bash
pnpm dev:ui
```

### Build a Windows / macOS / Linux desktop installer

```bash
node apps/desktop/scripts/electron-build.mjs
cd apps/desktop && pnpm exec electron-builder --config electron-builder.yml
```

The unpacked output lives at:

- Windows: `apps/desktop/dist-electron/win-unpacked/VenomCowork.exe`
- macOS:   `apps/desktop/dist-electron/mac-arm64/VenomCowork.app` (or `mac/`)
- Linux:   `apps/desktop/dist-electron/linux-unpacked/venomcowork`

To produce a real installer (NSIS / dmg / AppImage), drop `--dir`:

```bash
cd apps/desktop && pnpm exec electron-builder --config electron-builder.yml
```

The installer is `apps/desktop/dist-electron/venomcowork-windows-x64-0.15.2.exe`
(or the matching platform/arch name).

To sign the build, set `CSC_LINK` and `CSC_KEY_PASSWORD` environment variables
before running electron-builder. Without them, the build is unsigned and
Windows will show a SmartScreen prompt on first launch.

### Run the orchestrator CLI from source

```bash
pnpm --filter venomcowork-orchestrator dev -- \
  start --workspace /path/to/workspace --approval auto --allow-external
```

### Verify the install

```bash
# Typecheck the renderer
pnpm typecheck

# Sanity-check the sidecar resolution
pnpm --filter @venom-cowork/desktop exec node -e "console.log(require('./package.json').opencodeRouterVersion)"
```

---

## Architecture (high level)

When you open VenomCowork, the desktop shell does the following:

1. Spawns the **VenomCowork server** (`apps/server`) on a free local port.
2. Spawns **OpenCode** via the orchestrator (or, in fallback, `opencode serve`
   directly).
3. Loads the **renderer UI** (`apps/app/dist`) inside an Electron window.
4. Wires the renderer to the server's REST + SSE endpoints.

The renderer uses `@opencode-ai/sdk` to talk to the server, which in turn
talks to OpenCode. The whole thing runs on `127.0.0.1` by default — no
remote calls are made unless you opt in.

### Folder layout

```
apps/
  app/                React renderer (Vite)
  desktop/            Electron shell + electron-builder config
    electron/         main.mjs, preload.mjs, updater.mjs
    resources/        icons, sidecars, computer-use helper
    server/           snapshot of apps/server/dist copied at build time
  server/             Filesystem-backed API (Bun + TypeScript)
  orchestrator/       CLI that orchestrates opencode + server + router
  opencode-router/    Slack + Telegram bridge
  ui-demo/            Standalone UI playground
packages/
  venomcowork-ui-mcp/ MCP server exposing UI as tools
  email/              React Email templates
  types/              Shared TypeScript types
  ui/                 Shared UI primitives
  handsfree/          Voice / hands-free control
ee/                   Optional cloud control plane (untouched)
brand/                Logo SVGs (master + variants)
```

---

## Operator configuration

This fork ships with **no external endpoints wired in**. Every default that
used to point at the upstream operator's hosted services now resolves to an
empty string and is only activated when you set the matching env var.

| Feature | Env var | Effect when set |
|---|---|---|
| In-app auto-updates (stable) | `VENOMCOWORK_UPDATER_STABLE_URL` | electron-updater `generic` feed URL for the stable channel |
| In-app auto-updates (alpha) | `VENOMCOWORK_UPDATER_ALPHA_URL` | electron-updater `generic` feed URL for the alpha channel |
| External release download page | `VENOMCOWORK_RELEASE_PAGE_URL` | Where the `Open external releases page` button points |
| External docs page | `VENOMCOWORK_DOCS_URL` (desktop) or `VITE_VENOMCOWORK_DOCS_URL` (renderer) | Where the in-app docs link opens |
| In-app feedback button | `VITE_VENOMCOWORK_FEEDBACK_URL` (build time) | Where the feedback form POSTs |
| Web download page (renderer) | `VITE_VENOMCOWORK_DOWNLOAD_URL` (build time) | Where the "Download VenomCowork Desktop" banner links |
| Support contact (diagnostics) | `VENOMCOWORK_SUPPORT_CONTACT` (runtime) or `VITE_VENOMCOWORK_SUPPORT_CONTACT` (build) | Email or URL shown in remote-workspace error messages |
| Den (cloud) control plane | `VITE_DEN_BASE_URL` (build time) or `VENOMCOWORK_DEN_BASE_URL` (Electron) | Enables Cloud features; leave unset to keep the app fully local |
| VenomCowork Cloud MCP quick-connect | `VITE_DEN_BASE_URL` (build time) | The MCP entry in Settings appears only when this is set |
| Hosted model catalog | `VENOMCOWORK_MODELS_URL` | Where the embedded server looks for managed model data |
| Default skill hub | `VENOMCOWORK_HUB_OWNER` + `VENOMCOWORK_HUB_REPO` (+ `VENOMCOWORK_HUB_REF`) on the server, or `VITE_VENOMCOWORK_HUB_OWNER` + `VITE_VENOMCOWORK_HUB_REPO` (+ `VITE_VENOMCOWORK_HUB_REF`) in the renderer | Default GitHub repo the in-app Skills tab lists; per-request `?owner=...&repo=...` overrides work without these |
| Sidecar fallback base | `VENOMCOWORK_SIDECAR_BASE_URL` (CLI) or `VENOMCOWORK_ORCHESTRATOR_DOWNLOAD_BASE_URL` (postinstall) | Where the orchestrator fetches its `venomcowork-orchestrator` sidecars from when npm's optional platform package is missing |
| "Report an issue" button | `VENOMCOWORK_REPORT_ISSUE_URL` (renderer build env) | URL opened from Settings -> General -> Report issue |

If you fork this further, prefer **env vars over hard-coded URLs**. Hard
coding a release feed, docs link, or support contact into a fresh fork
re-creates the same lock-in this rebrand was designed to remove.

---

## Tech stack

- **Electron 35** desktop shell (no Tauri)
- **React 19 + Vite 6 + shadcn/ui (Base UI)** for the renderer
- **TypeScript** end-to-end (strict)
- **Bun 1.3+** for the opencode-plugins and the orchestrator binaries
- **pnpm 10+** workspaces
- **electron-updater** with the `generic` provider (no GitHub release feed
  hard-coded; set `VENOMCOWORK_UPDATER_STABLE_URL` to point it at a host you
  control)
- **better-sqlite3** + Drizzle for server-side state
- **node-pty** for the in-app terminal

## Coding guidelines

- TypeScript everywhere. No `any`, no `as`, no type casts unless the
  surrounding type genuinely demands it.
- Use `pnpm`. No `npm` or `yarn`.
- Use the components under `apps/app/src/components` (shadcn/ui on Base UI)
  before inventing new primitives.
- Tailwind + tokens for styling. Match the dark-mode-first aesthetic.
- Keep diffs small. If a problem can be solved in a simpler way, propose
  the simpler way.

## License

MIT — see `LICENSE`.
