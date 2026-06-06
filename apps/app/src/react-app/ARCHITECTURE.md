# React App Architecture (`src/react-app/`)

This document captures the domain-based layout for the React runtime being migrated into
`apps/app`. The Solid runtime still ships by default; the React tree is being built up domain by
domain so it can take over in a single hard cut.

## Top-level layout

```text
src/react-app/
â”œâ”€â”€ shell/                     App bootstrap, providers composition, startup effects
â”œâ”€â”€ kernel/                    App-wide state + provider contracts (replaces app/context/*)
â”œâ”€â”€ infra/                     React-only runtime infra
â”œâ”€â”€ design-system/             Reusable presentational primitives + small modal primitives
â””â”€â”€ domains/                   Feature-scoped code, one folder per product domain
    â”œâ”€â”€ session/
    â”‚   â”œâ”€â”€ chat/              Route frame (status bar, question/permission surfaces)
    â”‚   â”œâ”€â”€ surface/           Transcript, composer, markdown, tool-call, debug panel
    â”‚   â”œâ”€â”€ sync/              Session state plumbing (store, runtime, chat adapter)
    â”‚   â””â”€â”€ modals/            Model picker, question, rename-session
    â”œâ”€â”€ workspace/             Create + share + rename workspace flows
    â”œâ”€â”€ settings/
    â”‚   â”œâ”€â”€ state/             Settings-scoped hooks/providers
    â”‚   â”œâ”€â”€ pages/             Plugins, extensions, config, ... (tab bodies)
    â”‚   â””â”€â”€ modals/            Reset modal, ...
    â””â”€â”€ connections/
        â””â”€â”€ modals/            Add-MCP, provider auth, ...
```

Toasts and shell notifications are rendered with `sonner` (`@/components/ui/sonner`),
mounted once via `<Toaster />` in `shell/providers.tsx` and driven imperatively with
`toast()` from anywhere.

## Why domains

The Solid tree grew pseudo-flat (`app/components/*`, `app/context/*`, `app/pages/*`).
The React tree uses explicit domain ownership so every feature has one obvious home.

- `session/` owns everything the session route renders, including the state layer under `sync/`.
- `workspace/` owns every workspace-modal flow, so create/share/rename live together.
- `settings/` owns settings state, the full settings shell once it lands, and each tab body as a
  stateless page under `pages/`.
- `connections/` owns MCP and provider auth UI.

Cross-domain imports go through module boundaries, not a shared blob.

## Data flow

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                     src/index.react.tsx                    â”‚  React entry
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
                              â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  react-app/shell/providers.tsx (AppProviders composition)  â”‚
â”‚   ServerProvider                                           â”‚
â”‚   â””â”€ GlobalSDKProvider                                     â”‚
â”‚      â””â”€ GlobalSyncProvider                                 â”‚
â”‚         â””â”€ LocalProvider                                   â”‚
â”‚            â””â”€ (QueryClientProvider + PlatformProvider      â”‚
â”‚               wrap AppProviders in index.react.tsx)        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
                              â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚               react-app/shell/app-root.tsx                 â”‚  Route root (placeholder today)
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
           â–¼                  â–¼                  â–¼
   domains/session     domains/workspace   domains/settings
           â”‚                  â”‚                  â”‚
           â–¼                  â–¼                  â–¼
  surface/, sync/,    create-/share-/     pages/ (plugins,
   chat/, modals/     rename-*.tsx        config, ...),
                                           modals/, state/
```

## State ownership

- `react-app/kernel/store.ts`: Zustand store, the React replacement for the Solid context bag.
  Domain selectors in `kernel/selectors.ts`.
- `react-app/kernel/{server,global-sdk,global-sync,local}-provider.tsx`: the Solid provider stack
  re-expressed in React context. Same composition order as `app/entry.tsx`.
- `react-app/kernel/platform.tsx`: `PlatformProvider` + `createDefaultPlatform()` helper
  (Tauri-vs-web).
- `react-app/kernel/system-state.ts`: `useSystemState()` for reload + reset modal state.
- `react-app/kernel/model-config.ts`: framework-agnostic model parse/serialize helpers plus
  `useDefaultModel()` (the heavier workspace overrides and auto-compact logic still live in
  Solid and will be ported with the settings shell).
- `react-app/infra/query-client.ts`: TanStack Query singleton.
- Feature-specific state that is tightly coupled to one domain lives inside that domain
  (`domains/session/sync/`, `domains/settings/state/`).

## Active workspace and session

Workspace and session identity are route state, not app-global mutable state.

Canonical workspace-scoped routes:

- `/workspace/:workspaceId/session`
- `/workspace/:workspaceId/session/:sessionId`
- `/workspace/:workspaceId/settings/:tab`
- `/workspace/:workspaceId/settings/extensions/:section`

Use `react-app/shell/workspace-routes.ts` to build these paths. Do not hand-build `/session/...`
or `/settings/...` URLs for workspace-scoped flows.

Rules for agents and future code:

- In session or workspace-scoped settings routes, read the active workspace from the URL
  `workspaceId` param first.
- Read the active session from the URL `sessionId` param. A selected session should never imply a
  different workspace than the URL workspace.
- The legacy `venomcowork.react.activeWorkspace` and `venomcowork.react.sessionByWorkspace` values are
  only restore/fallback memory. They are not authoritative while a workspace-scoped URL is active.
- `/session`, `/session/:sessionId`, and `/settings/*` are compatibility entry points. They should
  redirect to workspace-scoped URLs when the workspace can be resolved.
- Missing URL resources should not silently fall back to the first workspace. Show a not-found state
  and let the user pick a workspace/session from the sidebar.
- Workspace-scoped actions (rename workspace, create session, open MCP/settings tabs, quick actions,
  commands, delete session) should use the URL-derived workspace/session context or receive explicit
  workspace/session ids from the caller.

Practical examples:

- From session B in workspace B, opening settings should navigate to
  `/workspace/B/settings/general`.
- Opening a session from the command palette should navigate to
  `/workspace/<owner-workspace-id>/session/<session-id>`, where the owner is found from the session
  list.
- Creating a new task in a workspace should navigate to
  `/workspace/<workspace-id>/session/<new-session-id>`.

## Framework-agnostic boundary

Anything that is already Solid-free stays under `src/app/` and is re-exported from the React
tree when a domain-scoped import path is clearer. Examples:

- `app/lib/*` (opencode, tauri, den, venomcowork-server, ...) â€” consumed directly by React.
- `app/types.ts`, `app/constants.ts`, `app/theme.ts`, `app/utils/*` â€” shared across both runtimes.
- `app/session/composer-tools.ts` â€” shared session helpers.

## Porting pattern

1. **Move, don't rewrite, for framework-free files.** Re-export from the React domain folder so
   Solid can keep importing through the old path during the transition.
2. **Invert contexts to props** when porting pages that depended on Solid context. The React
   version takes the data/actions it needs as props; the parent wires it up. This lets domain
   pages land before their provider layer is fully ported.
3. **Each port is its own commit.** The Solid runtime stays green the entire time; the React
   entry (`src/index.react.tsx`) builds and typechecks after every commit.

## Active shims

During the transition, files under `src/react/**` are thin re-exports pointing at the new
`react-app/**` locations. They exist so the Solid runtime (which imports from the old paths via
`ReactIsland`) keeps compiling. All `src/react/**` files are deleted in the final Phase 8 cutover
along with the Solid tree under `src/app/**`.
