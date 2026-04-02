# استكشاف الأخطاء (Troubleshooting)

## خطأ: `EADDRINUSE: address already in use :::4000`

معناه أن المنفذ 4000 مستخدم (غالباً نسخة قديمة من السيرفر ما زالت شغالة).

**الحل الأسرع (من مجلد server):**
```bash
npm run start:fresh
```
هذا يحرّر المنفذ 4000 ثم يشغّل السيرفر.

**أو تحرير المنفذ فقط ثم التشغيل يدوياً:**
```bash
npm run kill-port
npm start
```

**Windows (PowerShell) يدوياً:**
```powershell
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
```

---

## خطأ: `unable to get local issuer certificate` عند تشغيل `npm run ingest:websites`

بعض المواقع تستخدم شهادات SSL لا يثق بها Node افتراضياً. للتجربة المحلية فقط يمكنك تعطيل التحقق:

```bash
set NODE_TLS_REJECT_UNAUTHORIZED=0
npm run ingest:websites
```

أو في سطر واحد (PowerShell):
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npm run ingest:websites
```

**تحذير:** استخدم هذا للتطوير فقط، لا تستخدمه في الإنتاج.

---

## خطأ: `429 Too Many Requests` أو "You exceeded your current quota" عند `npm run ingest:websites`

معناه أنك تجاوزت حد طلبات Gemini (الخطة المجانية محدودة).

**ما تم تطبيقه في السكربت:**
- تأخير 1.5 ثانية بين كل طلب embedding (لتقليل 429).
- عند ظهور 429 يتم الانتظار 60 ثانية ثم إعادة المحاولة مرة واحدة.

**إن استمر الخطأ:**
- قلّل عدد الروابط في `APPROVED_URLS` أو شغّل الـ ingest على دفعات.
- أو زِد التأخير: `set EMBED_DELAY_MS=3000` ثم `npm run ingest:websites` (3 ثوانٍ بين الطلبات).
- راجع الحصة والاستخدام: https://ai.google.dev/gemini-api/docs/rate-limits

---

## خطأ: `Maximum call stack size exceeded` أثناء ingest المواقع

يحدث أحياناً مع صفحات HTML ذات DOM عميق جداً. تمت إضافة معالجة: يتم تخطي تلك الصفحة أو استخدام استخراج نص بسيط. إن ظهر مرة أخرى، السكربت يتخطى الرابط ويكمل.

---

## خطأ: `Could not find a declaration file for module 'pdf-parse'` عند تشغيل `npm run ingest`

تم حلّه بإضافة مرجع النوع في `scripts/ingest.ts`. إذا ظهر مرة ثانية تأكد أن الملف `scripts/pdf-parse.d.ts` موجود.
