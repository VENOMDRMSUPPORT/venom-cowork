# VenomCowork Enterprise Edition

هذا الدليل يحتوي على خيارات **Cloud Control Plane** لـ VenomCowork.

## 📦 التطبيقات

### Apps (`ee/apps/`)

| التطبيق | الوصف |
|---------|-------|
| `den-api` | خادم API السحابي |
| `den-web` | تطبيق Next.js على الويب |
| `landing` | موقع التسويق |
| `inference` | عامل Model inference |

### Packages (`ee/packages/`)

| الحزمة | الوصف |
|-------|-------|
| `den-db` | أدوات قاعدة البيانات |
| `utils` | وظائف مساعدة مشتركة |

---

## ⚠️ حالة Rebrand

### ما تم تحديثه ✅
- سلاسل `productName` محدثة إلى `VenomCowork`
- العلامة التجارية متسقة في جميع التطبيقات

### ما لم يتم تحديثه ⚠️
- **عناوين upstream** لا تزال تشير إلى `different-ai.com`
- **عناوين البريد الإلكتروني** للدعم لا تزال قديمة
- **خلاصات التحديث** تشير إلى upstream repos

هذا متعمد per request المشغل - يجب تحديثها بشكل منفصل قبل الشحن.

---

## 🔧 قبل الشحن

إذا كنت تخطط لتشحن ميزات Cloud، **يجب** تحديث التالي:

### 1. النطاقات والعناوين
```bash
# ابحث عن all different-ai.com
grep -r "different-ai.com" ee/

# ابحث عن all upstream references
grep -r "opencode.ai" ee/
```

### 2. البريد الإلكتروني للدعم
```bash
# ابحث عن support email references
grep -r "support@" ee/
grep -r "@different-ai.com" ee/
```

### 3. خلاصات التحديث
```bash
# تحقق من update URLs
grep -r "UPDATER" ee/
grep -r "update" ee/ -i
```

### 4. تكوينات الإنتاج
- تأكد من عدم وجود مفاتيح API embedded
- تحقق من متغيرات البيئة المطلوبة
- تأكد من تكوين قاعدة البيانات

---

## 🏗️ التشغيل المحلي

```bash
# تشغيل Den API
pnpm dev:den:api

# تشغيل Den Web
pnpm dev:den:web

# تشغيل Inference worker
pnpm dev:den:inference

# تشغيل الكل معًا
pnpm dev:den
```

---

## 📝 ملاحظات

- هذه التطبيقات مبنية بـ **Deno**
- `den-api` يستخدم Oak framework
- `den-web` يستخدم Next.js
- `inference` يعمل كـ worker منفصل

---

## 🔗 روابط

- [`REBRAND_SUMMARY.md`](../REBRAND_SUMMARY.md) - تفاصيل Rebrand الكاملة
- [CONTRIBUTING.md](../CONTRIBUTING.md) - كيفية المساهمة
