# تشغيل المشروع | How to Run

## المتطلبات
- **Node.js** إصدار 20 أو أحدث
- **PostgreSQL** مع امتداد pgvector (أو استخدم Docker لـ Postgres)
- **مفتاح Gemini API** من [Google AI Studio](https://aistudio.google.com/apikey)

---

## 1) إعداد ملف البيئة (مرة واحدة)

من مجلد المشروع:

```bash
cd server
npm run setup-env
```

ثم افتح الملف **`server/.env`** وعدّل:
- **DATABASE_URL:** رابط اتصال قاعدة البيانات، مثال:  
  `postgresql://postgres:كلمة_المرور@localhost:5432/rag_chatbot`
- **GEMINI_API_KEY:** مفتاحك من Google AI Studio

---

## 2) قاعدة البيانات (مرة واحدة)

- أنشئ قاعدة بيانات باسم `rag_chatbot`.
- نفّذ أوامر الجدول من الملف: **`server/src/config/schema.sql`**  
  (إنشاء امتداد vector، جدول documents، والفهرس).

---

## 3) تشغيل السيرفر (Backend)

افتح **طرفية أولى** ونفّذ:

```bash
cd server
npm install
npm run build
npm start
```

انتظر حتى تظهر رسالة مثل: **Server listening on port 4000**  
اترك هذه الطرفية مفتوحة.

---

## 4) تشغيل الواجهة (Frontend)

افتح **طرفية ثانية** ونفّذ:

```bash
cd client
npm install
npm run dev
```

انتظر حتى يظهر أن السيرفر جاهز (عادة مع رابط مثل `http://localhost:3000`).

---

## 5) فتح التطبيق

في المتصفح افتح:

**http://localhost:3000**

---

## ملخص الأوامر

| ماذا تريد        | من أي مجلد | الأمر              |
|------------------|------------|---------------------|
| إعداد `.env`     | `server`   | `npm run setup-env` |
| تثبيت السيرفر   | `server`   | `npm install`      |
| بناء السيرفر     | `server`   | `npm run build`    |
| تشغيل السيرفر   | `server`   | `npm start`        |
| تثبيت الواجهة   | `client`   | `npm install`      |
| تشغيل الواجهة   | `client`   | `npm run dev`      |

يجب أن تعمل **طرفيتان** في نفس الوقت: واحدة للسيرفر (`npm start`) وأخرى للواجهة (`npm run dev`).
