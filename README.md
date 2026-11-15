# فروشگاه اینترنتی NOVA

پورتال عمومی فروشگاه NOVA با Next.js App Router و TypeScript. فروشگاه فارسی و انگلیسی، راست‌چین و چپ‌چین، دارای تم روشن و تاریک، فهرست محصولات، صفحه جزئیات محصول و سبد خرید پایدار در مرورگر است.

## وضعیت و محدوده

این پروژه بر پایه سند چالش پیاده‌سازی شده است. API مورد استفاده FakeStoreAPI است؛ بنابراین داده‌ها نمایشی هستند. 

## پیش‌نیازها

- Node.js نسخه 24
- pnpm نسخه 10.14.0

نسخه Node در `.node-version` و نسخه package manager در `package.json` ثبت شده است.

## راه‌اندازی محلی

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

برنامه در [http://127.0.0.1:3000](http://127.0.0.1:3000) در دسترس است. زبان فارسی پیش‌فرض است و نسخه انگلیسی در `/en` قرار دارد.

### متغیرهای محیطی

| متغیر | کاربرد | مقدار نمونه |
| --- | --- | --- |
| `FAKE_STORE_API_URL` | آدرس پایه API که در سمت سرور استفاده می‌شود | `https://fakestoreapi.com` |
| `SITE_URL` | origin عمومی سایت برای metadata و sitemap؛ پیش از build تنظیم شود | `http://localhost:3000` |
| `NEXT_PUBLIC_NOVA_INSTAGRAM_URL` | پیوند اختیاری شبکه اجتماعی | خالی در حالت پیش‌فرض |
| `NEXT_PUBLIC_NOVA_TELEGRAM_URL` | پیوند اختیاری شبکه اجتماعی | خالی در حالت پیش‌فرض |
| `NEXT_PUBLIC_NOVA_LINKEDIN_URL` | پیوند اختیاری شبکه اجتماعی | خالی در حالت پیش‌فرض |
| `NEXT_PUBLIC_NOVA_TWITTER_URL` | پیوند اختیاری شبکه اجتماعی | خالی در حالت پیش‌فرض |
| `NEXT_PUBLIC_NOVA_CONTACT_EMAIL` | ایمیل اختیاری برای پیوند بخش تماس | خالی در حالت پیش‌فرض |

هیچ مقدار محرمانه‌ای نباید در متغیرهای `NEXT_PUBLIC_*` قرار گیرد؛ این مقادیر در مرورگر قابل مشاهده‌اند.

## فرمان‌ها

```bash
pnpm dev           # اجرای توسعه
pnpm build         # ساخت نسخه انتشار
pnpm lint          # اجرای ESLint
pnpm test          # اجرای تست‌های Playwright
```

## ساختار پروژه

```text
src/
├── api/             # Axios instance و اعتبارسنجی پاسخ‌ها
├── app/             # App Router، صفحات locale، API route، robots و sitemap
│   └── [locale]/    # layout و routeهای زبان‌محور
├── assets/          # فونت‌ها و آیکون‌ها
├── components/      # اجزای صفحات کاتالوگ، سبد و layout
├── context/         # Providerها، theme و پیکربندی SSR برای Styled Components
├── dictionary/      # ترجمه‌ها و تنظیمات مسیریابی next-intl
├── modals/          # دیالوگ‌های تأیید سبد
├── requests/        # query و درخواست‌های داده کاتالوگ
├── shared/          # کنترل‌ها و اجزای عمومی
├── storage/         # Zustand store و ماندگاری سبد
├── types/           # مدل‌ها و enumها
├── utils/           # قالب‌بندی، مسیرها و منطق کاتالوگ
├── validations/     # اعتبارسنجی ورودی جست‌وجو
├── i18n.ts          # پیکربندی next-intl
└── proxy.ts         # مسیریابی locale در نسخه جاری Next.js
```

## معماری و مدیریت داده

صفحات از App Router و مسیرهای زبان‌محور `[locale]` استفاده می‌کنند. `next-intl` پیام‌ها و مسیریابی دو زبانه را مدیریت می‌کند. `proxy.ts` درخواست‌های locale را هدایت می‌کند. Styled Components با registry سمت سرور پیکربندی شده تا styleهای رندر اولیه جمع‌آوری شوند.

درخواست‌های سرویس کاتالوگ از Axios instance مستقل عبور می‌کنند و `FAKE_STORE_API_URL` را در سمت سرور می‌خوانند. صفحه اولیه با داده رندر سمت سرور ارائه می‌شود و همان داده، TanStack Query را seed می‌کند تا هنگام hydration درخواست تکراری لازم نباشد. برای retry از مرورگر، یک route هم‌مبدأ `/api/catalog` وجود دارد. فیلترها، مرتب‌سازی و صفحه از URL خوانده می‌شوند.

## منابع

- [مستند FakeStoreAPI](https://fakestoreapi.com/docs)
