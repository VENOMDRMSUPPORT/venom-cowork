# تكوين VenomCowork

هذا المستند يوضح جميع خيارات التكوين ومتغيرات البيئة المتاحة في VenomCowork.

## متغيرات البيئة

### التحديثات التلقائية

| المتغير | الافتراضي | الوصف |
|---------|----------|-------|
| `VENOMCOWORK_UPDATER_STABLE_URL` | فارغ | رابط feed التحديثات المستقرة |
| `VENOMCOWORK_UPDATER_ALPHA_URL` | فارغ | رابط feed التحديثات التجريبية |
| `VENOMCOWORK_RELEASE_PAGE_URL` | فارغ | صفحة الإصدارات |

### التوثيق والدعم

| المتغير | الافتراضي | الوصف |
|---------|----------|-------|
| `VENOMCOWORK_DOCS_URL` | فارغ | رابط التوثيق (Desktop) |
| `VITE_VENOMCOWORK_DOCS_URL` | فارغ | رابط التوثيق (Renderer) |
| `VITE_VENOMCOWORK_FEEDBACK_URL` | فارغ | رابط إرسال Feedback |
| `VITE_VENOMCOWORK_DOWNLOAD_URL` | فارغ | رابط تحميل الويب |
| `VENOMCOWORK_SUPPORT_CONTACT` | عام | جهة الاتصال للدعم |
| `VITE_VENOMCOWORK_SUPPORT_CONTACT` | عام | جهة الاتصال للدعم (Renderer) |
| `VENOMCOWORK_REPORT_ISSUE_URL` | فارغ | ر柄ر الإبلاغ عن مشكلة |

### Cloud Control Plane

| المتغير | الافتراضي | الوصف |
|---------|----------|-------|
| `VITE_DEN_BASE_URL` | فارغ | رابط قاعدة Den API (Renderer) |
| `VENOMCOWORK_DEN_BASE_URL` | فارغ | رابط قاعدة Den API (Desktop) |
| `VENOMCOWORK_MODELS_URL` | فارغ | رابط دليل النماذج المستضافة |

### Skill Hub

| المتغير | الافتراضي | الوصف |
|---------|----------|-------|
| `VENOMCOWORK_HUB_OWNER` | فارغ | مالك repo hub skills |
| `VENOMCOWORK_HUB_REPO` | فارغ | اسم repo hub skills |
| `VENOMCOWORK_HUB_REF` | فارغ | الفرع/المرجع (اختياري) |
| `VITE_VENOMCOWORK_HUB_OWNER` | فارغ | مالك hub (Renderer) |
| `VITE_VENOMCOWORK_HUB_REPO` | فارغ | اسم repo hub (Renderer) |
| `VITE_VENOMCOWORK_HUB_REF` | فارغ | الفرع/المرجع (اختياري، Renderer) |

### Sidecar Downloads

| المتغير | الافتراضي | الوصف |
|---------|----------|-------|
| `VENOMCOWORK_SIDECAR_BASE_URL` | فارغ | رابط تحميل sidecar (CLI) |
| `VENOMCOWORK_ORCHESTRATOR_DOWNLOAD_BASE_URL` | فارغ | رابط تحميل Orchestrator |

### التطوير

| المتغير | الافتراضي | الوصف |
|---------|----------|-------|
| `VENOMCOWORK_DEV_MODE` | غير محدد | تفعيل وضع التطوير |
| `VENOMCOWORK_SERVER_PORT` | 3000 | منفذ الخادم المحلي |

---

## ملفات التكوين الحرجة

### `apps/desktop/electron-builder.yml`
- `appId`: `com.venom.cowork` (dev: `com.venom.cowork.dev`)
- `productName`: `VenomCowork`
- `protocols`: `venomcowork://`
- بدون `publish:` block (لا توجد روابط خارجية)

### `apps/desktop/electron/main.mjs`
- `APP_NAME`: `VenomCowork`
- `APP_IDENTIFIER`: `com.venom.cowork`
- جميع قنوات IPC تستخدم `venomcowork:` prefix

### `turbo.json`
- تكوين Turborepo للبناء المتوازي

### `pnpm-workspace.yaml`
- تعريف workspace packages
- إصدارات React catalog

---

## البناء

### متغيرات البناء

```bash
# تفعيل Cloud features
VITE_DEN_BASE_URL=https://your-den-api.com

# تفعيل Skill Hub
VITE_VENOMCOWORK_HUB_OWNER=your-org
VITE_VENOMCOWORK_HUB_REPO=venomcowork-skills

# تفعيل Feedback
VITE_VENOMCOWORK_FEEDBACK_URL=https://your-feedback.com

# تفعيل الدعم
VITE_VENOMCOWORK_SUPPORT_CONTACT=support@example.com
```

### توقيع البناء (Windows)

```bash
CSC_LINK=path/to/certificate.p12
CSC_KEY_PASSWORD=your-password
```

---

## ملاحظات مهمة

1. **جميعEndpoints فارغة افتراضيًا** - يجب على المشغل إعدادها
2. **التحديثات التلقائية تعتمد على hosted feed** - يجب استضافة `latest.yml`
3. **Cloud features معطلة افتراضيًا** - يتطلب `VITE_DEN_BASE_URL`
4. **Skill Hub فارغ افتراضيًا** - يتطلب متغيرات `HUB_*`

للمزيد من التفاصيل، راجع [`REBRAND_SUMMARY.md`](../REBRAND_SUMMARY.md).
