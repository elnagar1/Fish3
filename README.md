# 🐟 مستشار مزارع الأسماك - Fish Farm Consultant

نظام استشاري ذكي متكامل لمزارعي الأسماك باستخدام الذكاء الاصطناعي

---

## 🚀 التشغيل السريع

### باستخدام Docker (موصى به):

```bash
# بناء الصورة
docker build -t fish-farm .

# تشغيل الحاوية
docker run -p 8080:8080 fish-farm
```

أو باستخدام Docker Compose:

```bash
docker-compose up
```

افتح المتصفح: `http://localhost:8080`

---

### بدون Docker:

```bash
# تثبيت المكتبات
npm install

# تشغيل السيرفر
node server.js
```

---

## 🌐 النشر على السيرفرات

### Railway.app:
1. ارفع المشروع على GitHub
2. اربط Repository بـ Railway
3. سيتم Deploy تلقائياً!

### Render.com:
1. اذهب إلى https://render.com
2. New → Web Service
3. اختر Repository
4. Build Command: `npm install`
5. Start Command: `node server.js`

### Google Cloud Run:
```bash
gcloud run deploy fish-farm --source . --port 8080
```

### أي سيرفر Docker:
```bash
docker pull your-registry/fish-farm
docker run -d -p 80:8080 your-registry/fish-farm
```

---

## 📋 المتطلبات

- Node.js 18+
- Docker (اختياري)

---

## 🔧 المنافذ (Ports)

- **Development:** `8080`
- **Production:** يتم تحديده تلقائياً من `PORT` environment variable

---

## 📝 الترخيص

MIT License

---

**صُنع بـ ❤️ لمزارعي الأسماك**
