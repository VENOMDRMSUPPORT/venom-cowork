# VenomCowork configuration

This document lists configuration options and environment variables available in VenomCowork.

## Environment variables

### Auto-updates

| Variable | Default | Description |
|----------|---------|-------------|
| `VENOMCOWORK_UPDATER_STABLE_URL` | empty | Stable update feed URL |
| `VENOMCOWORK_UPDATER_ALPHA_URL` | empty | Alpha update feed URL |
| `VENOMCOWORK_RELEASE_PAGE_URL` | empty | Releases page URL |

### Documentation and support

| Variable | Default | Description |
|----------|---------|-------------|
| `VENOMCOWORK_DOCS_URL` | empty | Docs URL (desktop) |
| `VITE_VENOMCOWORK_DOCS_URL` | empty | Docs URL (renderer) |
| `VITE_VENOMCOWORK_FEEDBACK_URL` | empty | Feedback submission URL |
| `VITE_VENOMCOWORK_DOWNLOAD_URL` | empty | Web download URL |
| `VENOMCOWORK_SUPPORT_CONTACT` | generic | Support contact |
| `VITE_VENOMCOWORK_SUPPORT_CONTACT` | generic | Support contact (renderer) |
| `VENOMCOWORK_REPORT_ISSUE_URL` | empty | Report-issue link |

### Cloud Control Plane

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_DEN_BASE_URL` | empty | Den API base URL (renderer) |
| `VENOMCOWORK_DEN_BASE_URL` | empty | Den API base URL (desktop) |
| `VENOMCOWORK_MODELS_URL` | empty | Hosted model catalog URL |

### Skill Hub

| Variable | Default | Description |
|----------|---------|-------------|
| `VENOMCOWORK_HUB_OWNER` | empty | Skill hub repo owner |
| `VENOMCOWORK_HUB_REPO` | empty | Skill hub repo name |
| `VENOMCOWORK_HUB_REF` | empty | Branch/ref (optional) |
| `VITE_VENOMCOWORK_HUB_OWNER` | empty | Hub owner (renderer) |
| `VITE_VENOMCOWORK_HUB_REPO` | empty | Hub repo name (renderer) |
| `VITE_VENOMCOWORK_HUB_REF` | empty | Branch/ref (optional, renderer) |

### Sidecar downloads

| Variable | Default | Description |
|----------|---------|-------------|
| `VENOMCOWORK_SIDECAR_BASE_URL` | empty | Sidecar download URL (CLI) |
| `VENOMCOWORK_ORCHESTRATOR_DOWNLOAD_BASE_URL` | empty | Orchestrator download URL |

### Development

| Variable | Default | Description |
|----------|---------|-------------|
| `VENOMCOWORK_DEV_MODE` | unset | Enable development mode |
| `VENOMCOWORK_SERVER_PORT` | 3000 | Local server port |

---

## Critical config files

### `apps/desktop/electron-builder.yml`
- `appId`: `com.venom.cowork` (dev: `com.venom.cowork.dev`)
- `productName`: `VenomCowork`
- `protocols`: `venomcowork://`
- No `publish:` block (no external URLs)

### `apps/desktop/electron/main.mjs`
- `APP_NAME`: `VenomCowork`
- `APP_IDENTIFIER`: `com.venom.cowork`
- All IPC channels use the `venomcowork:` prefix

### `turbo.json`
- Turborepo configuration for parallel builds

### `pnpm-workspace.yaml`
- Workspace package definitions
- React catalog versions

---

## Build

### Build-time variables

```bash
# Enable Cloud features
VITE_DEN_BASE_URL=https://your-den-api.com

# Enable Skill Hub
VITE_VENOMCOWORK_HUB_OWNER=your-org
VITE_VENOMCOWORK_HUB_REPO=venomcowork-skills

# Enable feedback
VITE_VENOMCOWORK_FEEDBACK_URL=https://your-feedback.com

# Enable support contact
VITE_VENOMCOWORK_SUPPORT_CONTACT=support@example.com
```

### Code signing (Windows)

```bash
CSC_LINK=path/to/certificate.p12
CSC_KEY_PASSWORD=your-password
```

---

## Important notes

1. **All endpoints default to empty** — operators must configure them
2. **Auto-updates require a hosted feed** — you must host `latest.yml`
3. **Cloud features are off by default** — requires `VITE_DEN_BASE_URL`
4. **Skill Hub is empty by default** — requires `HUB_*` variables

For more details, see [`REBRAND_SUMMARY.md`](../REBRAND_SUMMARY.md).
