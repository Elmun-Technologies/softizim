# 06 — AI-Agent Marketing Konveyeri (Arxitektura)

> Maqsad: marketing jarayonining deyarli barchasini AI-agentlarga topshirish — konveyer kabi.
> Bu fayl **arxitektura** (nima nima qiladi). Real kod keyingi bosqichda ulangan tool'lar orqali
> quriladi: Meta Ads · Gmail · Google Calendar · Supabase · Mobbin · 21st.dev.

---

## Konveyer mantig'i (voronka bosqichlari)

```
[1] TOPISH  →  [2] BOYITISH  →  [3] ISITISH  →  [4] OUTREACH  →  [5] YOPISH  →  [6] SAQLASH
  Lead gen      Enrichment      Nurturing       Multichannel     Sales close    Retention
```

Har bosqichda 1 ta ixtisoslashgan agent ishlaydi. Barcha lead va holat **Supabase (CRM)** da yashaydi.

## Agentlar va rollari

| # | Agent | Vazifa | Manba (bilim bazasi) | Tool |
| --- | --- | --- | --- | --- |
| 1 | **Lead Hunter** | Raqib Expo bazasi, Alibaba, bojxona/tender ro'yxati, elchixona/diaspora'dan potentsial exponent topish | `01`, `02 §9`, `03` | Web, Supabase |
| 2 | **Enrichment** | Kompaniya ma'lumotini boyitish: soha, davlat, kontakt, Instagram, ehtiyoj → CRM'ga yozish | `01` | Supabase |
| 3 | **Content Studio** | Har tadbir uchun Reels ssenariysi, post, press-reliz, kontent-voronka (jahon etalonlaridan hook/montaj o'rganib) | `01` TOP ro'yxat, `02 §7`, `04`, `05` | Mobbin, 21st.dev |
| 4 | **Outreach** | 3-kanalli hujum: shaxsiy email (Gmail), WhatsApp matni, DM, AI-video ssenariysi — segment bo'yicha | `02 §2`, `03 §8` | Gmail, Supabase |
| 5 | **Ad Manager** | Meta Ads kampaniyalari: Istanbul/Guangzhou/Tehran target, "factory owner/export manager" auditoriya, CPL kuzatuvi | `03`, `04` | Meta Ads |
| 6 | **Sales Copilot** | FOMO/joy xaritasi holatini yuritish, narx zinapoyasi, paket taklifi, buyer uchrashuvlarini rejalashtirish | `02 §3,§4,§8` | Calendar, Supabase |
| 7 | **Retention** | 48 soatlik follow-up, so'rovnoma, referral/elchi/umrbod dasturi, yopiq klub kontenti | `02 §6` | Gmail, Supabase |
| 8 | **Analytics** | x4 richaglarini kuzatish (lead/konversiya/chek/retention), haftalik hisobot, KPI (`04`) | barcha | Supabase, Meta Ads |

## Ma'lumot modeli (Supabase — dastlabki sxema)

Kerakli jadvallar (keyingi bosqichda migratsiya bilan yaratiladi):

- `events` — tadbirlar (Promotors Show, Build Pro, Food Era, Agro Pro, Edu Expo)
- `companies` — potentsial/mavjud exponentlar (soha, davlat, manba, Instagram, holat)
- `contacts` — kompaniya ichidagi shaxslar (direktor, sotuv boshlig'i, til)
- `deals` — sotuv voronkasi (paket, narx, bosqich, joy raqami)
- `outreach_log` — har kontaktga yuborilgan xabarlar (kanal, sana, javob)
- `content` — Reels/post/press-reliz reja va holati
- `partners` — elchixona, assotsiatsiya, media, bank/lizing, co-organizer

## Lead segmentatsiyasi (outreach uchun)

| Segment | Manba | Xabar burchagi |
| --- | --- | --- |
| Raqib Expo qatnashchisi | `01` ochiq ro'yxatlar | "Istanbulda X$ to'lagansiz — Samarqandda 3x arzon" |
| Alibaba/import eksportyori | Alibaba, bojxona | "Allaqachon O'zbekistonga sotasiz — 50 distributor bilan tanishing" |
| Diaspora / mavjud diler | LinkedIn, tarmoq | "Milliy pavilyon / bosh distribyutor maqomi" |
| O'tgan yilgi exponent | CRM | "Qaytish 20% + do'st olib kel 15%" |
| Mahalliy zavod (viloyat) | Roadshow, tender | "Jamoa effekti — Farg'onadan 4 zavod qo'shildi" |

## Bosqichma-bosqich yo'l xaritasi

- **Faza 0 (hozir):** ✅ Bilim bazasi saralandi (bu repo).
- **Faza 1:** Supabase CRM sxemasi + mavjud exponent bazasini import. Agent arxitekturasini tasdiqlash.
- **Faza 2:** Content Studio + Outreach agentlari — 1 ta tadbir (Build Pro Expo, oktabr) pilot.
- **Faza 3:** Ad Manager (Meta Ads) + Analytics — CPL va konversiyani real o'lchash.
- **Faza 4:** To'liq konveyer — 5 tadbirga kengaytirish, xalqaro segment (`03`).

## Ochiq savollar (tasdiqlash kerak)

1. **Ustuvor 2 davlat** xalqaro jalb uchun? (Turkiya / Xitoy / Eron / Rossiya / Hindiston)
2. **Shior** (A/B/C — `05`) — brendni qulflash uchun.
3. **Byudjet va kanal raqamlari** — Ad Manager va x4 modelini aniq sozlash uchun (`00` data gaps).
4. **Mavjud exponent bazasi** qaysi formatda (Excel/CRM)? — import uchun.
5. Qaysi tadbirdan **pilot** boshlaymiz? (tavsiya: Build Pro Expo — oktabr, eng yaqin).
