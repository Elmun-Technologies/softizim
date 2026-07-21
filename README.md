# Sof Expo — Marketing Tizimi (Knowledge Base)

**Sof Expo Markazi** — Samarqand, O'zbekiston. Xalqaro ko'rgazmalar (Expo) tashkilotchisi.
Bu repozitoriy Sof Expo marketingini "konveyer" tizimi sifatida — brend, PR, performance va
AI-agentlar orqali avtomatlashtirilgan holda — qurish uchun bilim bazasi va (keyinchalik) kod.

> **Maqsad:** Sotuvlarni **x4** ga oshirish + xalqaro (Turkiya, Xitoy, Rossiya, Eron, Hindiston)
> exponentlarni Samarqandga jalb qilish. Deyarli barcha marketing jarayoni AI-agentlarga topshiriladi.

---

## Tadbirlar taqvimi (2025–2027)

| Oy | Tadbir | Yo'nalish | Holati |
| --- | --- | --- | --- |
| Sentabr | **Promotors Show** | Reklama / promo / marketing sanoati | Rejalashtirilgan |
| Oktabr | **Build Pro Expo** | Qurilish, interyer, materiallar | Rejalashtirilgan |
| Noyabr | **Food Era** | Oziq-ovqat, ichimlik, HoReCa | Rejalashtirilgan |
| Mart 2027 | **Agro Pro Expo** | Qishloq xo'jaligi, texnika, agro | Rejalashtirilgan |
| Aprel 2027 | **Edu Expo** | Ta'lim, EdTech | Rejalashtirilgan |

---

## Hujjatlar tuzilmasi (bilim bazasi)

| Fayl | Nima haqida |
| --- | --- |
| [`docs/00-loyiha-konteksti.md`](docs/00-loyiha-konteksti.md) | Sof Expo profili, maqsad, x4 reja, hozirgi holat |
| [`docs/01-raqobatchilar-bazasi.md`](docs/01-raqobatchilar-bazasi.md) | 90+ jahon Expo va stend quruvchilar — saralangan, takrorsiz baza |
| [`docs/02-eksponent-jalb-playbook.md`](docs/02-eksponent-jalb-playbook.md) | Exponent jalb qilishning ~30 usuli — kategoriyalarga bo'lingan |
| [`docs/03-xalqaro-jalb-samarkand.md`](docs/03-xalqaro-jalb-samarkand.md) | Chet el kompaniyalarini Samarqandga olib kelish (maxsus) |
| [`docs/04-pr-strategiya.md`](docs/04-pr-strategiya.md) | PR: xalqaro + ichki bozor, 6 oylik taqvim, KPI |
| [`docs/05-brand-strategiya.md`](docs/05-brand-strategiya.md) | Brend: 9 qadam, pozitsiya, vizual, verbal |
| [`docs/06-ai-agent-tizimi.md`](docs/06-ai-agent-tizimi.md) | Marketing konveyeri: qaysi agent nima qiladi (arxitektura) |
| [`docs/07-byudjet.md`](docs/07-byudjet.md) | Byudjet taqsimoti — har Expo uchun $5,000 (Xitoy + Qozog'iston) |
| [`docs/08-agency-python-tizimi.md`](docs/08-agency-python-tizimi.md) | **Ishlaydigan tizim** — 6 darajali Python agent (`agency/`) xaritasi |

---

## Ishlaydigan tizim — `agency/` (Python)

6 darajali ierarxik AI-agent tizimi (CMO→PM→Head→Worker→Sub) qurilgan va sinovdan o'tgan:
delegatsiya/dekompozitsiya · qat'iy tasdiqlash + eskalatsiya · Hermes xotira · LLM
(Anthropic/OpenRouter) · Tools (Apify B2B · Supabase CRM · Telegram · Meta Ads · Midjourney) ·
E2E kampaniya sikli · analitika · 14 test. Batafsil: [`docs/08`](docs/08-agency-python-tizimi.md),
[`agency/README.md`](agency/README.md).

```bash
cd agency && pip install -r requirements.txt
python3 status.py                        # jonli-tayyorlik (qaysi tool live/stub)
python3 run_campaign.py build-pro-expo   # bitta Expo — to'liq E2E (stub)
python3 tests/run_tests.py               # 14 test
```

## Hozirgi bosqich

- [x] Xom ma'lumotni saralash (**sartirovka**) va strategiya bazasi (`docs/`)
- [x] 6 darajali agent tizimi (`agency/`) — arxitektura, delegatsiya, eskalatsiya
- [x] LLM + Hermes xotira + Tools (Apify/CRM/Telegram/Meta Ads) + E2E + testlar
- [ ] Jonli Supabase (bepul limit ochilgach) + real kalitlar bilan uchdan-uchiga jonli run

## Ulangan resurslar

Meta Ads · Gmail · Google Calendar · Supabase · Mobbin · 21st.dev — sessiyaga ulangan.
