# VenomCowork Enterprise Edition

This tree contains optional **Cloud Control Plane** apps for VenomCowork.

## Apps

### Apps (`ee/apps/`)

| App | Description |
|-----|-------------|
| `den-api` | Cloud API server |
| `den-web` | Next.js web app |
| `landing` | Marketing site |
| `inference` | Model inference worker |

### Packages (`ee/packages/`)

| Package | Description |
|---------|-------------|
| `den-db` | Database utilities |
| `utils` | Shared helper functions |

---

## Rebrand status

### Updated
- `productName` strings set to `VenomCowork`
- Branding is consistent across apps

### Not yet updated
- **Upstream domains** still point at `different-ai.com`
- **Support email addresses** are still legacy
- **Update feeds** still reference upstream repos

This is intentional per operator request — update these separately before shipping.

---

## Before shipping

If you plan to ship Cloud features, **you must** update the following:

### 1. Domains and URLs
```bash
# Find all different-ai.com references
grep -r "different-ai.com" ee/

# Find all upstream references
grep -r "opencode.ai" ee/
```

### 2. Support email
```bash
# Find support email references
grep -r "support@" ee/
grep -r "@different-ai.com" ee/
```

### 3. Update feeds
```bash
# Check update URLs
grep -r "UPDATER" ee/
grep -r "update" ee/ -i
```

### 4. Production configuration
- Ensure no embedded API keys
- Verify required environment variables
- Confirm database configuration

---

## Local development

```bash
# Run Den API
pnpm dev:den:api

# Run Den Web
pnpm dev:den:web

# Run inference worker
pnpm dev:den:inference

# Run everything together
pnpm dev:den
```

---

## Notes

- These apps are built with **Deno**
- `den-api` uses the Oak framework
- `den-web` uses Next.js
- `inference` runs as a separate worker

---

## Links

- [`REBRAND_SUMMARY.md`](../REBRAND_SUMMARY.md) — full rebrand details
- [CONTRIBUTING.md](../CONTRIBUTING.md) — how to contribute
