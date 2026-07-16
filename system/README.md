# Sof Expo — AI-Agent Marketing Tizimi (kod)

Bu — `/docs` dagi strategiyani **real ishlaydigan** avtomatlashtirishga aylantiruvchi
mustaqil ilova. Sizning o'rningizda 8 ta agent ishlaydi: lead topadi, boyitadi, kontent
yozadi, shaxsiy taklif yuboradi, sotuvga yordam beradi, qayta sotadi va hisobot beradi.

**Stek:** TypeScript (Node) · Anthropic Claude (`claude-opus-4-8` + `claude-haiku-4-5`) ·
Supabase (CRM). Ulanadigan: Meta Ads, Gmail, Google Calendar (MCP/API orqali).

---

## Agentlar (marketing konveyeri)

```
TOP → BOYIT → KONTENT → OUTREACH → SOTUV → QAYTA SOTISH → HISOBOT
```

| Agent | Vazifa | Buyruq |
|---|---|---|
| Lead Hunter | Xitoy/Qozog'iston uchun potentsial exponent topish | `npm run hunt -- CN 15` |
| Enrichment | Soha, til, sifat bahosi bilan boyitish | `npm run enrich` |
| Content Studio | Reels/post/press-reliz (uz/ru/zh, voronka bosqichi) | `npm run content -- reels warm uz` |
| Outreach | Shaxsiy taklif xati (til bo'yicha) | `npm run outreach` |
| Sales Copilot | Paket + narx + FOMO tavsiyasi | `npm run sales -- "Kompaniya"` |
| Retention | Mavjud exponentga qayta sotish | `npm run retain` |
| Analytics | x4 richag haftalik hisoboti | `npm run report` |
| **Orkestrator** | **To'liq sikl (hammasi ketma-ket)** | **`npm run cycle`** |

---

## O'rnatish (5 qadam)

```bash
cd system
npm install
cp .env.example .env      # va qiymatlarni to'ldiring (ANTHROPIC_API_KEY, SUPABASE_*)
```

**Supabase CRM sxemasini yarating** — `db/migrations/001_init.sql` va `002_seed.sql` ni
Supabase SQL editorida (yoki Supabase MCP `apply_migration` orqali) qo'llang.

**Sinov:**
```bash
npm run typecheck         # kod tekshiruvi
npm run report            # CRM ulanishini tekshiradi
npm run cycle             # to'liq konveyerni ishga tushiradi
```

---

## Avtomatlashtirish (cron)

Sessiyadan mustaqil, serverda kunlik ishlashi uchun:

```cron
# Har kuni 09:00 da to'liq sikl
0 9 * * *  cd /path/to/system && npm run cycle >> cron.log 2>&1
```

Yoki Supabase Edge Function / GitHub Action orqali rejalashtiring.

---

## Xavfsizlik

- `.env` **hech qachon** gitga tushmaydi (`.gitignore` da).
- Supabase `service_role` kaliti faqat backendda — brauzer/frontendga chiqarmang.
- Outreach xatlari `status: 'drafted'` bilan yaratiladi — yuborishdan oldin ko'rib chiqing
  (haqiqiy yuborish Gmail/WhatsApp integratsiyasi bilan keyingi bosqichda ulanadi).

---

## Keyingi kengaytmalar

- **Ad Manager agenti** — Meta Ads MCP orqali Qozog'iston kampaniyalarini avtomatlash.
- **Gmail/WhatsApp yuborish** — `drafted` xatlarni real yuborishga ulash.
- **AI-video** — HeyGen API bilan xitoy/rus tilida shaxsiy video (03-hujjat §8).
- **Meva/lead import** — 5 yillik Excel bazangizni `companies` jadvaliga import.
