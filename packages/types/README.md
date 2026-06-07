# @venom-cowork/types

أنواع TypeScript المشتركة لـ VenomCowork.

## المحتوى

- Domain types
- API contracts
- Shared interfaces
- Utility types

## الاستخدام

```typescript
import { Session, Domain, Permission } from '@venom-cowork/types';
```

## الهيكل

```
src/
├── domains/      # أنواع DOM-related
├── server/       # أنواع server/API
└── shared/       # أنواع مشتركة
```

## Domain Types

تحدد كيفية تمثيل DOM elements في VenomCowork:

- `Domain` - منطقة في DOM
- `DomainElement` - عنصر domain
- `DomainQuery` - استعلام domain

## Server Types

تحدد شكل الاتصال بين renderer و server:

- `Session` - جلسة مستخدم
- `Permission` - أذونات الملفات
- `ServerMessage` - رسائل من الخادم

## التطوير

```bash
# typecheck فقط
pnpm --filter @venom-cowork/types typecheck
```
