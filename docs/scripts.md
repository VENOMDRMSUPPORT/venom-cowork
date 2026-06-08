# Development scripts

This document lists scripts available in the root `package.json`.

## Desktop development (Electron)

| Script | Description |
|--------|-------------|
| `pnpm dev` | Full Electron app in development mode |
| `pnpm dev:electron` | Electron shell only |
| `pnpm dev:windows` | Windows-specific development mode |
| `pnpm dev:headless` | Headless mode (no UI) |

## UI development

| Script | Description |
|--------|-------------|
| `pnpm dev:ui` | Renderer only (no Electron) |
| `pnpm dev:ui-demo` | UI component playground |
| `pnpm preview` | Preview production build |

## Cloud Control Plane development

| Script | Description |
|--------|-------------|
| `pnpm dev:den` | Local Den API/Web stack |
| `pnpm dev:den:api` | Den API server only |
| `pnpm dev:den:web` | Den Next.js UI only |
| `pnpm dev:den:inference` | Model inference worker |

## Testing

| Script | Description |
|--------|-------------|
| `pnpm test:health` | Quick health check |
| `pnpm test:e2e` | Broader integration tests |
| `pnpm test:refactor` | Typecheck + sanity checks |
| `pnpm test:sessions` | Session management tests |
| `pnpm test:permissions` | Permission tests |

## Build

| Script | Description |
|--------|-------------|
| `pnpm build` | Build entire workspace |
| `pnpm build:ui` | Build renderer only |
| `pnpm build:web` | Build Den web app |
| `pnpm build:desktop` | Build Electron app |

## Tooling

| Script | Description |
|--------|-------------|
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm typecheck` | Run TypeScript type check |

---

## Full script list

```bash
pnpm run
```

Or see [`package.json`](../package.json) directly.
