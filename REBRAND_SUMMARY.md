# Venom Cowork Rebrand — Summary

## Overview

Forked [OpenWork v0.15.2](https://github.com/different-ai/openwork) (commit
`41fa709`) and rebranded it to **VenomCowork / Venom Cowork** — a standalone
Windows desktop app with **no external repository links, no hosted doc
site, no support email, no auto-published release feed**. Operators are
expected to bring their own update server, documentation site, and skill
hub before shipping this build to end users.

## Build artifact

| Field | Value |
|---|---|
| Executable | `apps/desktop/dist-electron/win-unpacked/VenomCowork.exe` |
| Size | 201,214,464 bytes (~192 MB) |
| Platform | Windows x64 |
| Electron | 35.7.5 |
| App ID | `com.venom.cowork` (dev: `com.venom.cowork.dev`) |
| Protocol | `venomcowork://` |
| Icon | `apps/desktop/resources/icons/icon.ico` (multi-res 16/24/32/48/64/128/256) |
| Sidecars | `venomcowork-orchestrator.exe`, `opencode.exe`, `versions.json` |
| Plugins | `venomcowork-capabilities-knowledge.js`, `venomcowork-extensions-preview.js` |

## Smoke test

Built and launched the `.exe` twice during the rebrand. The main window
opens with the title `VenomCowork` and the four expected Electron
processes (main + 3 helpers) stay alive until stopped. No crashes, no
window title regressions.

## What changed

### Brand identity

- Product name: `OpenWork` → `VenomCowork` (window title, tray, dock, About)
- App identifier: `com.differentai.openwork` → `com.venom.cowork`
- URL protocol: `openwork://` → `venomcowork://`
- Env-var prefix: `OPENWORK_*` → `VENOMCOWORK_*` (15+ vars in `package.json`)
- localStorage keys: `openwork.*` → `venomcowork.*`
- Event channels: `openwork:*` → `venomcowork:*`
- Dark-mode-first logo with venom-green (`#22D37A`) accent — see `brand/`

### Packages and folders

| Old | New |
|---|---|
| `@openwork/*` workspace deps | `@venom-cowork/*` |
| `@openwork-ee/*` | `@venom-cowork-ee/*` |
| `openwork-orchestrator` | `venomcowork-orchestrator` |
| `openwork-server` | `venomcowork-server` |
| `openwork-ui-mcp` | `venomcowork-ui-mcp` |
| `packages/openwork-ui-mcp/` | `packages/venomcowork-ui-mcp/` |
| `apps/orchestrator/bin/openwork` | `apps/orchestrator/bin/venomcowork` |

17 source files renamed inside `apps/app/src/` and `apps/server/src/`
(see commit history).

### Critical configs

- `apps/desktop/electron-builder.yml` — `appId`, `productName`, `protocols`,
  no `publish:` block (user asked for no external repo links), `artifactName`
- `apps/desktop/electron/main.mjs` — `APP_NAME`, `APP_IDENTIFIER`, protocol,
  IPC channels, all `RELEASE_*_URL` and `DOCS_*_URL` constants gated behind
  env vars
- `apps/desktop/electron/updater.mjs` — `ELECTRON_UPDATER_FEEDS` empty by
  default; operator passes `VENOMCOWORK_UPDATER_STABLE_URL` /
  `VENOMCOWORK_UPDATER_ALPHA_URL`
- `apps/app/src/app/lib/release-channels.ts` and `electron-alpha.ts` —
  endpoints empty by default
- `apps/server/src/skill-hub.ts` and `server.ts` — `DEFAULT_HUB_REPO`
  resolved from `VENOMCOWORK_HUB_OWNER` / `VENOMCOWORK_HUB_REPO` /
  `VENOMCOWORK_HUB_REF` env vars; `/hub/skills` returns 503 when unset
- `apps/app/src/app/lib/den.ts` — `BUILD_DEN_BASE_URL` empty by default;
  operator sets `VITE_DEN_BASE_URL` to enable Cloud features
- `apps/app/src/app/lib/feedback.ts` — `buildFeedbackUrl()` throws when
  `VITE_VENOMCOWORK_FEEDBACK_URL` is unset
- `apps/app/src/react-app/domains/workspace/venomcowork-den-help-link.tsx` —
  support contact is `VENOMCOWORK_SUPPORT_CONTACT` /
  `VITE_VENOMCOWORK_SUPPORT_CONTACT`; the help dialog adapts its copy when
  no contact is configured
- `apps/app/src/react-app/design-system/web-unavailable-surface.tsx` — the
  "Download VenomCowork Desktop" link is hidden unless
  `VITE_VENOMCOWORK_DOWNLOAD_URL` is set
- `apps/orchestrator/src/cli.ts` and `scripts/postinstall.mjs` — both throw
  a clear error when no sidecar base URL is configured (instead of
  silently pointing at a non-existent release host)
- `package.json` (root) — workspace name, dev scripts, dead scripts
  (`dev:sandbox`, `dev:den-docker`, all `release:*`) removed; remaining
  scripts use `VENOMCOWORK_*` env vars

### External endpoints (all now operator-controlled)

| Feature | Env var | Default |
|---|---|---|
| Stable auto-update feed | `VENOMCOWORK_UPDATER_STABLE_URL` | empty (no-op) |
| Alpha auto-update feed | `VENOMCOWORK_UPDATER_ALPHA_URL` | empty (no-op) |
| Releases page | `VENOMCOWORK_RELEASE_PAGE_URL` | empty |
| Docs page (desktop) | `VENOMCOWORK_DOCS_URL` | empty |
| Docs page (renderer) | `VITE_VENOMCOWORK_DOCS_URL` | empty |
| Feedback URL | `VITE_VENOMCOWORK_FEEDBACK_URL` | throws if used |
| Web download URL | `VITE_VENOMCOWORK_DOWNLOAD_URL` | empty (link hidden) |
| Support contact | `VENOMCOWORK_SUPPORT_CONTACT` / `VITE_VENOMCOWORK_SUPPORT_CONTACT` | generic "contact your administrator" |
| Report-issue URL | `VENOMCOWORK_REPORT_ISSUE_URL` | button is a no-op when unset |
| Den (cloud) base | `VITE_DEN_BASE_URL` (renderer) / `VENOMCOWORK_DEN_BASE_URL` (desktop) | empty (Cloud features disabled) |
| Hosted model catalog | `VENOMCOWORK_MODELS_URL` | empty |
| Default skill hub | `VENOMCOWORK_HUB_OWNER` + `VENOMCOWORK_HUB_REPO` (+ `VENOMCOWORK_HUB_REF`) on the server; `VITE_VENOMCOWORK_HUB_OWNER` + `VITE_VENOMCOWORK_HUB_REPO` (+ `VITE_VENOMCOWORK_HUB_REF`) in the renderer | empty (Skills tab empty) |
| Sidecar fallback base | `VENOMCOWORK_SIDECAR_BASE_URL` (orchestrator CLI) / `VENOMCOWORK_ORCHESTRATOR_DOWNLOAD_BASE_URL` (postinstall) | throws if used |

### Logo and icons

- `brand/venomcowork-logo.svg` — 512×512 master (V monogram + venom fang)
- `brand/venomcowork-logo-square.svg` — 512×512 square
- `brand/venomcowork-mark.svg` — 512×512 mark only (favicon source)
- `brand/venomcowork-logo-transparent.svg` — 1024×1024 transparent
- `venomcowork-logo-transparent.svg` at repo root — 1024×1024
- `apps/desktop/resources/icons/icon.ico` — multi-res Windows ICO
  (16/24/32/48/64/128/256) generated via `ico-endec` (not a PNG-renamed
  file, which Windows rejected as `Reserved header is not 0`)
- `apps/desktop/resources/icons/icon.png` — 512×512 for Linux builds
- `apps/app/public/venomcowork-{logo,logo-square,mark}.svg` — web variants
- `apps/app/public/favicon-{16,32}x{16,32}.png`, `apple-touch-icon.png`
- Old `openwork-*.svg` files deleted from `apps/app/public/`

### Removed (upstream-only, recycled)

- `.github/`, `.devcontainer/`, `.opencode/`
- `changelog/`, `evals/`, `examples/`, `packaging/`, `patches/`, `prds/`
- `translated_readmes/`, `docs/` (root), `packages/docs/`
- `.infisical.json`, `.nvmrc`, `.vercelignore`, `skills-lock.json`
- `STATS.md`, `STATS_V2.md`, `SUPPORT.md`, `TRANSLATIONS.md`,
  `CODE_OF_CONDUCT.md`, `SECURITY.md`
- `scripts/migration/` (Tauri → Electron migration, already done)
- `scripts/aur/` (Arch User Repo, irrelevant on Windows)
- `scripts/stats.mjs`, `scripts/stats.test.mjs`, `scripts/generate-changelog.mjs`
- `scripts/release/ship.mjs`, `scripts/release/publish-electron-assets.mjs`
- `scripts/build-microsandbox-openwork-image.sh`,
  `scripts/create-daytona-openwork-snapshot.sh` (referenced deleted paths)
- `scripts/openwork-debug.sh` → renamed to `scripts/venomcowork-debug.sh`
- `apps/opencode-router/install.sh` (referenced the upstream repo)
- `apps/app/.env.migration-release` (Tauri migration config)

`ee/` (Den API, Den Web, landing, inference, etc.) was **left untouched
except for `productName` strings** per the user's direction. The VenomCowork
brand is consistent, but the upstream hosting URLs and email addresses
inside `ee/` are still present. Operators that ship the cloud control
plane should rewrite those separately.

### Fixes discovered during verification

- Removed stray UTF-8 BOM from all 17 `package.json` files
  (`pnpm install` was failing with `Unrecognized token '\ufeff'`)
- Replaced invalid PNG-renamed-to-ICO with a proper multi-res Windows ICO
  via `ico-endec` (Windows rejected the old file as
  `Reserved header is not 0`)
- Re-initialized `.git/` after a corrupt-index incident; previous
  rebrand script had touched `.git/HEAD/config/index` paths during a
  mass-rename pass

## Repository state

| Field | Value |
|---|---|
| Branch | `rebrand/venom-cowork` (local) |
| Commits | 3 (bulk rebrand, fixes, build verification) |
| Remote | none (operator adds their own) |
| Working tree | clean aside from the new `apps/desktop/dist-electron/` build output |

## Next steps for the operator

1. **Add a remote** — `git remote add origin <your-git-url>`
2. **Push** — `git push -u origin rebrand/venom-cowork`
3. **Configure update feed** — host a `latest.yml` (electron-updater
   `generic` provider) and set `VENOMCOWORK_UPDATER_STABLE_URL` in the
   build environment
4. **Sign the build** — set `CSC_LINK` and `CSC_KEY_PASSWORD` before
   invoking `electron-builder` (without them, the build is unsigned and
   Windows shows a SmartScreen prompt on first launch)
5. **Bring your own support / docs** — set `VITE_VENOMCOWORK_DOCS_URL`,
   `VITE_VENOMCOWORK_FEEDBACK_URL`, `VENOMCOWORK_SUPPORT_CONTACT`, and
   `VITE_VENOMCOWORK_DOWNLOAD_URL` to your real endpoints
6. **Optional**: regenerate the macOS ICNS (the Windows ICO is the
   priority for this build; `scripts/generate-icns.mjs` is in the tree
   but currently no-ops on Windows because `png2icons.createICNS` returns
   `null` on this OS)
7. **Optional**: host a skill hub (a public GitHub repo with
   `skills/<name>/SKILL.md` files works) and set `VENOMCOWORK_HUB_OWNER` /
   `VENOMCOWORK_HUB_REPO` on the server, and `VITE_VENOMCOWORK_HUB_OWNER`
   / `VITE_VENOMCOWORK_HUB_REPO` in the renderer build

## License

MIT — same as upstream OpenWork.
