# Changelog

VenomCowork follows [Semantic Versioning](https://semver.org/).

## Version format

Versions follow `MAJOR.MINOR.PATCH`:

- **MAJOR**: incompatible API changes
- **MINOR**: backwards-compatible features
- **PATCH**: backwards-compatible bug fixes

---

## [Unreleased]

### Added
- `pnpm verify` — baseline checks (typecheck + server/app unit tests)
- `.github/workflows/ci.yml` — CI on push/PR
- `docs/local-dev.md` — local development guide
- `.env.local.example` — optional variables for local runs
- `apps/server/script/run-unit-tests.mjs` — server tests without e2e

### Changed
- Removed build artifacts from git tracking

### Fixed
- TypeScript error in `venomcoworkEngineVersion` → `opencodeVersion` in `buildCapabilities()`

---

## [0.15.2] - 2026-06-08

### Added
- Completed rebrand from OpenCode to VenomCowork
- Updated all translation files (OpenCode → VenomCowork Engine)
- Added `scripts/tsconfig.json` for TypeScript support in VS Code
- Added OKLCH design token system (5 themes: obsidian-noir, arctic-bloom, industrial-brutalist, twilight-editorial, neon-depth)
- Added `ThemeProvider`, `ThemeSwitcher`, and `useTheme` hook
- Added CSS/Tailwind generation from design tokens with WCAG contrast checks

### Changed
- Renamed `apps/opencode-router` to `apps/venomcowork-router`
- Updated all code references (scripts, orchestrator, server) for the new brand
- Updated env vars from `OPENCODE_*` to `VENOMCOWORK_ENGINE_*`
- Updated `constants.json`: `opencodeVersion` → `venomcoworkEngineVersion`
- Updated `venomcowork.jsonc` (removed untrusted schema)
- Updated `turbo.json` (removed untrusted schema)
- Improved desktop auto-rebuild scripts (`desktop:rebuild`, `desktop:watch`)

### Fixed
- Removed untrusted schemas from JSON files (`$schema` from turbo.json and venomcowork.jsonc)
- Fixed desktop app build to work correctly with electron-builder
- Updated pnpm-lock after rebuild scripts

---

## How to add entries

Add changes under the appropriate section (Added/Changed/Fixed) with a clear description:

```markdown
### Added
- Brief description of the new change

### Changed
- Brief description of the existing change

### Fixed
- Brief description of the fix
```

---

## Previous releases

For the full changelog, see:

- [Git Tags](https://github.com/your-org/venomcowork/tags)
- [GitHub Releases](https://github.com/your-org/venomcowork/releases)
