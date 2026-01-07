# استخدام Node.js 18 Alpine (صغير وسريع)
FROM node:18-alpine

# تثبيت أدوات البناء اللازمة لـ sqlite3
RUN apk add --no-cache python3 make g++

# إنشاء مجلد العمل
WORKDIR /app

# نسخ ملفات package أولاً (للاستفادة من Docker cache)
COPY package*.json ./

# تثبيت المكتبات
RUN npm ci --only=production

# نسخ كل ملفات المشروع
COPY . .

# إنشاء مستخدم غير root للأمان
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# التبديل للمستخدم الجديد
USER nodejs

# المنفذ الافتراضي (يمكن تغييره بـ environment variable)
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${PORT}/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# تشغيل التطبيق
CMD ["node", "server.js"]
