# المساهمة في VenomCowork

شكرًا لاهتمامك بالمساهمة في VenomCowork! هذا الدليل يساعدك على البدء.

## المتطلبات

- **Node.js** 20+
- **pnpm** 10+
- **Bun** 1.3+ (للاختبارات)

## التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-org/venomcowork.git
cd venomcowork

# تثبيت التبعيات
pnpm install

# توليد الأيقونات المطلوبة
node scripts/generate-icons.mjs
```

## التطوير

```bash
# تشغيل Electron كامل
pnpm dev

# واجهة المستخدم فقط (بدون Electron)
pnpm dev:ui

# ملعب مكونات UI
pnpm dev:ui-demo

# خادم Den API (Cloud Control Plane)
pnpm dev:den

# خادم API فقط
pnpm dev:den:api
```

## إرشادات الكود

### TypeScript
- **Strict mode** مطلوب - لا تستخدم `any`
- استخدم الأنواع المناسبة لكل دالة ومتغير
- فضّل `interface` على `type` للأشكال objects

### React
- اتبع نمط **domains** في `apps/app/src/app/`
- استخدم **shadcn/ui** على **Base UI**
- استخدم **Zustand** لإدارة الحالة المحلية
- استخدم **React Query** للبيانات من الخادم

### تنظيم الملفات
- ضع الكود بالقرب من استخدامه (colocation)
- اجمع الملفات المتعلقة في domain واحد
- تجنب المجلدات العميقة

## الاختبار

```bash
# اختبارات شاملة
pnpm test:e2e

# فحص صحي سريع
pnpm test:health

# Type check
pnpm typecheck
```

## Pull Requests

### قبل فتح PR
- اجعل جميع الاختبارات تمر
- تأكد من `pnpm typecheck` بدون أخطاء
- أضف اختبارات للتغييرات الجديدة
- حدّث التوثيق إذا لزم الأمر

### عنوان PR
- استخدم صيغة واضحة: `feat: وصف مختصر` أو `fix: وصف مختصر`
- أضف مرجع للissue إن وُجد: `fixes #123`

### بعد فتح PR
- طلب مراجعة من الفريق
- الرد على التعليقات
- تحديث الكود بناءً على الملاحظات

## اصطلاحات التسمية

### الحزم (Packages)
- **Scoped libraries** (@venom-cowork/*): كود مشترك، مكونات UI، أنواع
- **Executable binaries** (venomcowork-*): أدوات CLI وخوادم
- **Upstream-compatible** (opencode-*): جسور لـ OpenCode

### الأمثلة
- ✅ `@venom-cowork/ui` (مكتبة مشتركة)
- ✅ `venomcowork-server` (قابل للتنفيذ)
- ✅ `opencode-router` (جسر لـ OpenCode)

## Pre-commit Hooks (اختياري)

المشروع يستخدم **Husky + lint-staged** للتنسيق التلقائي:

```bash
# التثبيت (أول مرة فقط)
pnpm add -D husky
pnpm exec husky init
```

**ملاحظة:** الـ hooks اختيارية للتنسيق المحلي؛ الدمج يعتمد على CI. لتخطي hook مرة واحدة:

```bash
git commit --no-verify
```

## الأسئلة؟

- افتح **Discussion** على GitHub
- أو انضم إلى مجتمعنا على Discord

شكرًا لمساهمتك! 🚀
