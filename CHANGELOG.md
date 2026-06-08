# سجل التغييرات

يتم إصدار VenomCowork وفقًا للإصدار الدلالي ([SemVer](https://semver.org/lang/ar/)).

## تنسيق الإصدارات

الإصدارات تتبع التنسيق: `MAJOR.MINOR.PATCH`

- **MAJOR**: تغييرات غير متوافقة مع الإصدارات السابقة
- **MINOR**: وظائف جديدة متوافقة مع الإصدارات السابقة
- **PATCH**: إصلاحات أخطاء متوافقة مع الإصدارات السابقة

---

## [Unreleased]

### مضاف
- `pnpm verify` — فحص baseline (typecheck + اختبارات وحدة server/app)
- `.github/workflows/ci.yml` — CI على push/PR
- `docs/local-dev.md` — دليل التطوير المحلي
- `.env.local.example` — متغيرات اختيارية للتشغيل المحلي
- `apps/server/script/run-unit-tests.mjs` — اختبارات server بدون e2e

### تغيير
- إزالة build artifacts من git tracking

### إصلاح
- إصلاح خطأ TypeScript في `venomcoworkEngineVersion` → `opencodeVersion` في `buildCapabilities()`

---

## [0.15.2] - 2026-06-08

### مضاف
- إكمال إعادة تسمية العلامة التجارية من OpenCode إلى VenomCowork
- تحديث جميع ملفات الترجمة (OpenCode → VenomCowork Engine)
- إضافة `scripts/tsconfig.json` لدعم TypeScript في VS Code
- إضافة نظام رموز التصميم OKLCH (5 سمات: obsidian-noir, arctic-bloom, industrial-brutalist, twilight-editorial, neon-depth)
- إضافة مكونات `ThemeProvider` و `ThemeSwitcher` و `useTheme` hook
- إضافة توليد CSS/Tailwind من رموز التصميم مع فحص تباين WCAG

### تغيير
- إعادة تسمية `apps/opencode-router` إلى `apps/venomcowork-router`
- تحديث جميع مراجع الكود (scripts، orchestrator، server) للعلامة التجارية الجديدة
- تحديث متغيرات البيئة من `OPENCODE_*` إلى `VENOMCOWORK_ENGINE_*`
- تحديث `constants.json`: `opencodeVersion` → `venomcoworkEngineVersion`
- تحديث `venomcowork.jsonc` (إزالة schema غير موثوق)
- تحديث `turbo.json` (إزالة schema غير موثوق)
- تحسين سكريبتات إعادة البناء التلقائي للتطبيق المكتبي (`desktop:rebuild`، `desktop:watch`)

### إصلاح
- إزالة schemas غير موثوقة من ملفات JSON (`$schema` من turbo.json و venomcowork.jsonc)
- إصلاح بناء التطبيق المكتبي ليعمل بشكل صحيح مع electron-builder
- تحديث pnpm-lock بعد سكريبتات إعادة البناء

---

## كيفية الإضافة

أضف التغييرات تحت القسم المناسب (مضاف/تغيير/إصلاح) مع وصف واضح:

```markdown
### مضاف
- وصف简短 للتغيير الجديد

### تغيير
- وصف简短 للتغيير الموجود

### إصلاح
- وصف简一本 للإصلاح
```

---

## الإصدارات السابقة

للحصول على سجل التغييرات الكامل، راجع:
- [Git Tags](https://github.com/your-org/venomcowork/tags)
- [GitHub Releases](https://github.com/your-org/venomcowork/releases)
