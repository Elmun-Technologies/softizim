# Sof Expo Agency — 6 Darajali Ierarxik Marketing Tizimi

`msitarzewski/agency-agents` karkasi (markdown persona kutubxonasi) asosida, uni **Python
runtime ierarxiyasi + YAML config + Hermes xotira** bilan kengaytirgan tizim. Yiliga 10 ta
xalqaro Expo marketingini boshqarish uchun.

> **Holat:** ARXITEKTURA SKELETI. Python fayllari hozircha bo'sh (docstring + TODO) — kod
> keyingi bosqichda yoziladi. YAML config va Hermes xotira shablonlari to'ldirilgan.

---

## Ierarxiya (6 daraja)

```
L1  CMO ───────────────────────────────── Bosh Marketing Direktori
L2  └─ PM ──────────────────────────────── Loyiha Menejeri (operatsion)
L3     ├─ Head of SMM ─ Head of Lead Gen ─ Head of Content ─ Head of Traffic ─ Head of Tech
L4     │   ├─ Insta Worker (x10), Audience RU/EN/ZH   (SMM ostida)
L4     │   ├─ Lead Researcher                          (Lead Gen ostida)
L4     │   ├─ Blog Post                                (Content ostida)
L4     │   ├─ Targetolog                               (Traffic ostida)
L4     │   └─ Web Manager                              (Tech ostida)
L5     │       ├─ Caption Writer, Visual Designer, Trend Auditor  (Insta Worker ostida)
L5     │       └─ Scraper, Outreach                               (Lead Researcher ostida)
L6     └─ Tools: Midjourney · Apify · Telegram Bot · CRM (Supabase) · Meta Ads
```

To'liq xarita: [`config/divisions.yaml`](config/divisions.yaml).

---

## Papka strukturasi

```
agency/
├── config/                 # Har agent uchun .yaml (rol, boshliq, delegatsiya, KPI, tools)
│   ├── divisions.yaml      # ← butun ierarxiya xaritasi (yagona manba)
│   ├── L1_cmo.yaml … L3_head_*.yaml
│   ├── level4/*.yaml
│   ├── level5/*.yaml
│   └── L6_tools.yaml       # tools (integratsiyalar)
├── src/
│   ├── core/               # base_agent, message_bus, hierarchy, memory (SKELET)
│   ├── agents/             # cmo, pm, heads/, workers/, subagents/ (SKELET)
│   └── tools/              # midjourney, apify, telegram_bot, crm_api, meta_ads (SKELET)
├── memory/                 # Hermes .md — har agentning uzoq muddatli xotirasi
│   ├── _TEMPLATE.md
│   ├── heads/  workers/  subagents/
│   └── insta/              # Insta Worker x10 — har nusxa alohida fayl
├── main.py                 # kirish nuqtasi (SKELET)
├── requirements.txt
└── .env.example
```

---

## Ishlash prinsipi (loyihalangan)

1. **Delegatsiya (yuqoridan pastga):** CMO → PM → Head → Worker → Sub-agent. Har agent
   o'z `manages` ro'yxatidagilarga vazifa bo'lib beradi.
2. **Eskalatsiya (pastdan yuqoriga):** hal qilolmagan masala `escalates_to` bo'yicha boshliqqa.
3. **Xotira (Hermes):** har agent sessiya boshida o'z `memory/*.md` ni o'qiydi, oxirida
   yangi darslarni qo'shadi. Bir yozuv = bir dars, sir yozilmaydi.
4. **Model taqsimoti:** L1-L3 = `claude-opus-4-8` (strategiya), L4 = `claude-sonnet-5`,
   L5 = `claude-haiku-4-5` (arzon, tez).
5. **Tools (L6):** faqat integratsiya — agentlar env kalit orqali chaqiradi.

---

## Config sxemasi (har agent .yaml)

```yaml
id: head_smm
level: 3
role: "Head of SMM"
role_uz: "SMM Bo'lim Boshlig'i"
model: claude-opus-4-8
reports_to: pm
manages: [insta_worker, audience_ru, audience_en, audience_zh]
mission: >
  ...
responsibilities: [...]
kpis: [...]
tools: [telegram_bot]
memory_file: memory/heads/head_smm.md
delegation:
  can_delegate_to: [...]
  escalates_to: pm
```

---

## Aloqadorlik

- CRM (`crm_api`) — `../system/db/migrations` dagi Supabase sxema bilan bir xil (umumiy baza).
- Strategiya asosi — `../docs/` (pozitsiya, byudjet, jalb playbook).

## Keyingi bosqich (tasdiqdan keyin)

`src/core/base_agent.py` va `message_bus.py` ni yozish → CMO→PM→Head delegatsiya oqimini
ishga tushirish → tools'ni real API'larga ulash.
