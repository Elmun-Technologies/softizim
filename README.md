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
src/                          # Next.js veb-sayt (Softizim platformasi)
├── app/                      # App Router sahifalari
│   ├── layout.tsx            # Umumiy layout (Header, Footer, tema)
│   ├── page.tsx              # Bosh sahifa
│   ├── xizmatlar/ loyihalar/ biz-haqimizda/ aloqa/
│   ├── api/contact/          # Aloqa formasi API route
│   └── sitemap.ts robots.ts  # SEO
├── components/ (sections/ cards/ ui/ Header Footer ThemeToggle)
└── lib/site.ts               # Sayt kontenti va konfiguratsiyasi

docs/                         # Sof Expo marketing bilim bazasi (strategiya)
agency/                       # Sof Expo — 6 darajali AI-agent marketing tizimi (Python)
```

## Kontentni tahrirlash

Saytdagi barcha matnlar, xizmatlar, narxlar, loyihalar va savol-javoblar
`src/lib/site.ts` faylida markazlashtirilgan. Kontentni o'zgartirish uchun shu
faylni tahrirlash yetarli.

---

## Sof Expo Marketing Tizimi (`docs/` + `agency/`)

Repo veb-saytdan tashqari **Sof Expo Markazi (Samarqand)** uchun to'liq marketing
avtomatlashtirish tizimini ham o'z ichiga oladi — brend, PR, performance strategiyasi
va 6 darajali ierarxik AI-agent konveyeri.

**Strategiya bazasi — [`docs/`](docs/):**

| Fayl | Nima haqida |
| --- | --- |
| [`00`](docs/00-loyiha-konteksti.md) | Sof Expo profili, maqsad, x4 reja |
| [`01`](docs/01-raqobatchilar-bazasi.md) | 90+ jahon Expo va stend quruvchilar bazasi |
| [`02`](docs/02-eksponent-jalb-playbook.md) | Exponent jalb qilish playbook (~30 usul) |
| [`03`](docs/03-xalqaro-jalb-samarkand.md) | Chet el kompaniyalarini Samarqandga jalb qilish |
| [`04`](docs/04-pr-strategiya.md) · [`05`](docs/05-brand-strategiya.md) | PR + Brend strategiya |
| [`06`](docs/06-ai-agent-tizimi.md) · [`07`](docs/07-byudjet.md) | AI-agent konveyeri + byudjet ($5000/Expo) |
| [`08`](docs/08-agency-python-tizimi.md) | **Ishlaydigan tizim** — 6 darajali Python agent xaritasi |

**Ishlaydigan tizim — [`agency/`](agency/) (Python):**

6 darajali ierarxiya (CMO→PM→Head→Worker→Sub) — delegatsiya/dekompozitsiya · qat'iy
tasdiqlash + eskalatsiya · Hermes xotira · LLM (Anthropic/OpenRouter) · Tools (Apify B2B ·
Supabase CRM · Telegram · Meta Ads · Midjourney) · E2E kampaniya sikli · analitika · 14 test.

```bash
cd agency && pip install -r requirements.txt
python3 status.py                        # jonli-tayyorlik (qaysi tool live/stub)
python3 run_campaign.py build-pro-expo   # bitta Expo — to'liq E2E (stub)
python3 tests/run_tests.py               # 14 test
```

Batafsil: [`agency/README.md`](agency/README.md).

---

© Elmun Technologies
