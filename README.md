# Softizim

**Zamonaviy dasturiy yechimlar va SaaS platformasi** — Elmun Technologies tomonidan.

Softizim — bizneslar uchun veb, mobil va SaaS mahsulotlarini ishlab chiqadigan
dasturiy injiniring studiyasining marketing va mahsulot platformasi. Ushbu repo
kompaniyaning veb-saytini o'z ichiga oladi: xizmatlar, portfolio, narxlar va
aloqa formasi bilan.

## Texnologiyalar

- **[Next.js 16](https://nextjs.org)** — App Router, Turbopack
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** — CSS-first tema, `.dark` klass strategiyasi
- **ESLint 9** (flat config)

## Imkoniyatlar

- 🎨 Zamonaviy, responsive dizayn (mobil, planshet, desktop)
- 🌗 Yorug'/Qorong'i rejim (FOUC'siz, `localStorage`da saqlanadi)
- 🧩 Qayta ishlatiladigan komponentlar va dizayn tizimi
- 📄 Sahifalar: Bosh sahifa, Xizmatlar, Loyihalar, Biz haqimizda, Aloqa
- 📬 Aloqa formasi + serverda validatsiya (`/api/contact`)
- 🔍 SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt`
- ⚡ Statik generatsiya (SSG) — tez yuklanish

## Ishga tushirish

```bash
npm install       # bog'liqliklarni o'rnatish
npm run dev       # http://localhost:3000 da ishlab chiqish serveri
npm run build     # production build
npm run start     # production serverni ishga tushirish
npm run lint      # ESLint tekshiruvi
npm run typecheck # TypeScript tekshiruvi
```

## Loyiha tuzilishi

```
src/
├── app/                  # Next.js App Router sahifalari
│   ├── layout.tsx        # Umumiy layout (Header, Footer, tema)
│   ├── page.tsx          # Bosh sahifa
│   ├── xizmatlar/        # Xizmatlar sahifasi
│   ├── loyihalar/        # Portfolio sahifasi
│   ├── biz-haqimizda/    # Kompaniya haqida
│   ├── aloqa/            # Aloqa + forma
│   ├── api/contact/      # Aloqa formasi API route
│   ├── sitemap.ts        # sitemap.xml
│   └── robots.ts         # robots.txt
├── components/
│   ├── sections/         # Landing bo'limlari (Hero, Pricing, FAQ, ...)
│   ├── cards/            # ServiceCard, ProjectCard
│   ├── ui/               # Button, Section, Icon (dizayn primitivlari)
│   ├── Header.tsx        # Navigatsiya
│   ├── Footer.tsx        # Pastki qism
│   └── ThemeToggle.tsx   # Tema almashtirgich
└── lib/
    └── site.ts           # Sayt kontenti va konfiguratsiyasi
```

## Kontentni tahrirlash

Saytdagi barcha matnlar, xizmatlar, narxlar, loyihalar va savol-javoblar
`src/lib/site.ts` faylida markazlashtirilgan. Kontentni o'zgartirish uchun shu
faylni tahrirlash yetarli.

---

© Elmun Technologies
