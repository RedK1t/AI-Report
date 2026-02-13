# تعليمات تشغيل المشروع

## الطريقة الأولى: استخدام Docker (الأسهل)

### المتطلبات:
- Docker Desktop يجب أن يكون قيد التشغيل

### خطوات التشغيل:
```bash
# تشغيل المشروع
docker-compose up --build

# أو في الخلفية
docker-compose up -d --build
```

### الوصول للتطبيق:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### إيقاف المشروع:
```bash
docker-compose down
```

---

## الطريقة الثانية: التشغيل اليدوي

### المتطلبات:
1. Python 3.11+ (تثبيت من python.org)
2. Node.js 20+ (موجود ✓)
3. npm أو yarn

### خطوات تشغيل Backend:

```bash
# الانتقال لمجلد Backend
cd backend

# إنشاء بيئة افتراضية (اختياري لكن موصى به)
python -m venv venv

# تفعيل البيئة الافتراضية
# على Windows PowerShell:
.\venv\Scripts\Activate.ps1
# أو على CMD:
venv\Scripts\activate.bat

# تثبيت المكتبات المطلوبة
pip install -r requirements.txt

# تشغيل السيرفر
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### خطوات تشغيل Frontend:

```bash
# في نافذة Terminal جديدة
cd frontend

# تثبيت المكتبات
npm install

# تشغيل السيرفر
npm run dev
```

### الوصول للتطبيق:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## ملاحظات مهمة:

1. **WeasyPrint** (لتصدير PDF) يحتاج مكتبات نظام:
   - على Windows: قد تحتاج تثبيت GTK+ runtime
   - أو استخدام Docker لتجنب مشاكل التبعيات

2. **CORS**: تم تكوين CORS للسماح بـ `localhost:5173` و `localhost:3000`

3. **Ports**: تأكد أن المنافذ 8000 و 5173 غير مستخدمة
