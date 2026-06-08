# Contributing to VenomCowork

Thank you for your interest in contributing to VenomCowork! This guide helps you get started.

## Requirements

- **Node.js** 20+
- **pnpm** 10+
- **Bun** 1.3+ (for tests)

## Install

```bash
# Clone the repository
git clone https://github.com/your-org/venomcowork.git
cd venomcowork

# Install dependencies
pnpm install

# Generate required icons
node scripts/generate-icons.mjs
```

## Development

```bash
# Full Electron desktop app
pnpm dev

# Renderer only (no Electron)
pnpm dev:ui

# UI component playground
pnpm dev:ui-demo

# Den API server (Cloud Control Plane)
pnpm dev:den

# API server only
pnpm dev:den:api
```

## Code guidelines

### TypeScript
- **Strict mode** is required — do not use `any`
- Use proper types for every function and variable
- Prefer `interface` over `type` for object shapes

### React
- Follow the **domains** pattern in `apps/app/src/app/`
- Use **shadcn/ui** on **Base UI**
- Use **Zustand** for local state
- Use **React Query** for server data

### File organization
- Colocate code near where it is used
- Group related files in one domain
- Avoid deep folder hierarchies

### Language
- **English only** in all committed files (docs, comments, strings, configs).
- Never add Arabic or other non-English text outside i18n locale files.
- Run `node scripts/check-english-only.mjs` before opening a PR.

## Testing

```bash
# Baseline before push (typecheck + unit tests)
pnpm verify

# Broader tests (requires opencode CLI in PATH)
pnpm test:e2e

# Quick health check
pnpm test:health

# Type check
pnpm typecheck
```

See [docs/local-dev.md](docs/local-dev.md) for local run details.

## Pull requests

### Before opening a PR
- Make sure all tests pass
- Ensure `pnpm typecheck` has no errors
- Add tests for new behavior
- Update documentation when needed

### PR title
- Use a clear prefix: `feat: short description` or `fix: short description`
- Reference an issue when applicable: `fixes #123`

### After opening a PR
- Request review from the team
- Respond to comments
- Update code based on feedback

## Naming conventions

### Packages
- **Scoped libraries** (@venom-cowork/*): shared code, UI components, types
- **Executable binaries** (venomcowork-*): CLI tools and servers
- **Upstream-compatible** (opencode-*): bridges to OpenCode

### Examples
- ✅ `@venom-cowork/ui` (shared library)
- ✅ `venomcowork-server` (executable)
- ✅ `opencode-router` (OpenCode bridge)

## Pre-commit hooks (optional)

The project can use **Husky + lint-staged** for automatic formatting:

```bash
# One-time setup
pnpm add -D husky
pnpm exec husky init
```

**Note:** Hooks are optional for local formatting; merge depends on CI. To skip a hook once:

```bash
git commit --no-verify
```

## Questions?

- Open a **Discussion** on GitHub
- Or join our Discord community

Thank you for contributing!
