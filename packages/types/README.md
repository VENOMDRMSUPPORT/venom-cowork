# @venom-cowork/types

Shared TypeScript types for VenomCowork.

## Contents

- Domain types
- API contracts
- Shared interfaces
- Utility types

## Usage

```typescript
import { Session, Domain, Permission } from '@venom-cowork/types';
```

## Structure

```
src/
├── domains/      # DOM-related types
├── server/       # Server/API types
└── shared/       # Shared types
```

## Domain types

Define how DOM elements are represented in VenomCowork:

- `Domain` — a region in the DOM
- `DomainElement` — a domain element
- `DomainQuery` — a domain query

## Server types

Define communication between renderer and server:

- `Session` — user session
- `Permission` — file permissions
- `ServerMessage` — messages from the server

## Development

```bash
# Typecheck only
pnpm --filter @venom-cowork/types typecheck
```
