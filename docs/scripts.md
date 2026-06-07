# سكريبتات التطوير

هذا المستند يوضح جميع السكريبتات المتاحة في `package.json` الرئيسي.

## تطوير Desktop (Electron)

| السكريبت | الوصف |
|---------|-------|
| `pnpm dev` | تشغيل Electron كامل في وضع التطوير |
| `pnpm dev:electron` | Electron shell فقط |
| `pnpm dev:windows` | وضع التطوير الخاص بـ Windows |
| `pnpm dev:headless` | وضع headless (بدون UI) |

## تطوير UI

| السكريبت | الوصف |
|---------|-------|
| `pnpm dev:ui` | Renderer فقط (بدون Electron) |
| `pnpm dev:ui-demo` | ملعب مكونات UI |
| `pnpm preview` | معاينة إنتاج build |

## تطوير Cloud Control Plane

| السكريبت | الوصف |
|---------|-------|
| `pnpm dev:den` | Den API/Web stack محلي |
| `pnpm dev:den:api` | خادم Den API فقط |
| `pnpm dev:den:web` | واجهة Den Next.js فقط |
| `pnpm dev:den:inference` | عامل Model inference |

## الاختبار

| السكريبت | الوصف |
|---------|-------|
| `pnpm test:health` | فحص صحي سريع |
| `pnpm test:e2e` | اختبارات شاملة |
| `pnpm test:refactor` | Typecheck + فحوصات sanity |
| `pnpm test:sessions` | اختبارات إدارة الجلسات |
| `pnpm test:permissions` | اختبارات الأذونات |

## البناء

| السكريبت | الوصف |
|---------|-------|
| `pnpm build` | بناء workspace كامل |
| `pnpm build:ui` | بناء Renderer فقط |
| `pnpm build:web` | بناء تطبيق Den web |
| `pnpm build:desktop` | بناء Electron app |

## الأدوات

| السكريبت | الوصف |
|---------|-------|
| `pnpm lint` | فحص ESLint |
| `pnpm format` | تنسيق مع Prettier |
| `pnpm typecheck` | فحص TypeScript types |

---

## للحصول على قائمة كاملة

```bash
pnpm run
```

أو راجع [`package.json`](../package.json) مباشرة.
