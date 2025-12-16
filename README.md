# تعویض روغن یار

یک اپلیکیشن وب برای مدیریت و یادآوری تعویض روغن خودرو با استفاده از React + Vite، Supabase و Clerk.

## ویژگی‌ها

- ✅ مدیریت چند خودرو برای هر کاربر
- ✅ ثبت تاریخچه تعویض روغن
- ✅ محاسبه خودکار تاریخ و کیلومتر تعویض بعدی
- ✅ یادآوری با Google Calendar
- ✅ احراز هویت با Clerk
- ✅ ذخیره‌سازی داده در Supabase

## اجرای محلی

**پیش‌نیازها:** Node.js 18+

1. نصب وابستگی‌ها:
   ```bash
   npm install
   ```

2. ساخت فایل `.env.local` در ریشه پروژه:
   ```bash
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   VITE_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   ```

3. اجرای اپلیکیشن:
   ```bash
   npm run dev
   ```

## ساخت برای Production

```bash
npm run build
```

خروجی در پوشه `dist` قرار می‌گیرد.

## Deploy روی Vercel

1. پروژه را به GitHub push کنید
2. در [Vercel](https://vercel.com) یک پروژه جدید بسازید و ریپوی GitHub را متصل کنید
3. در تنظیمات Vercel → Environment Variables، این متغیرها را اضافه کنید:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLERK_PUBLISHABLE_KEY`
4. Deploy کنید!

Vercel به صورت خودکار `vite build` را اجرا می‌کند و از `dist` به عنوان output directory استفاده می‌کند.
