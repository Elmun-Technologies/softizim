# 07 — Agency: 6 Darajali Python Agent Tizimi (implementatsiya)

> Bu — `../agency/` papkasidagi **ishlaydigan** tizimning qisqa xaritasi. To'liq: `../agency/README.md`.
> `agency-agents` karkasi (markdown persona) + Python runtime + YAML config + Hermes xotira.

## Ierarxiya (6 daraja)

```
L1 CMO → L2 PM → L3 (SMM · Lead Gen · Content · Traffic · Tech)
  L4  Insta Worker(x10), Audience RU/EN/ZH · Lead Gen RU/EN/ZH · Blog · Targetolog · Web Manager
  L5  Caption/Visual/Trend · Scraper+Outreach (RU/EN/ZH)
  L6  Tools: Apify · CRM(Supabase) · Telegram · Meta Ads · Midjourney
```

## Yadro (`agency/src/core/`)

| Modul | Vazifa |
| --- | --- |
| `workflow.py` | Task holat mashinasi (CREATED..DONE/ESCALATED) + **qat'iy tasdiqlash** (ruxsatsiz o'tish → InvalidTransition) |
| `message_bus.py` | Agentlararo xabar (assign/result/reject/escalation) + audit trace |
| `base_agent.py` | Config yuklash · Hermes xotira (recall/remember) · **decompose** (ixtisoslashgan sub-brief) · handle/delegate/validate/escalate · tool-driven leaf act() |
| `hierarchy.py` | Config'lardan ierarxiya + tool registri · butunlik validatsiyasi |
| `llm.py` | Claude (Anthropic SDK) yoki OpenRouter |
| `analytics.py` | Voronka metrikalari (lead→kontakt→HOT konversiya) |

## Oqim (E2E, `run_campaign.py`)

1. **Delegatsiya + dekompozitsiya:** CMO → PM → Head → Worker → Sub. Har boshliq umumiy
   brifni bo'ysunuvchiga **ixtisoslashgan** sub-brifga bo'ladi (rekursiv, L1→L5).
2. **Qat'iy tasdiqlash:** har natija validatsiyadan o'tadi; muvaffaqiyatsiz → qayta urinish →
   **eskalatsiya** (chiziqli, yuqoriga). Hermes xotiraga dars yoziladi (append-only).
3. **Tool-driven leaf'lar:**
   - Scraper → Apify B2B (til→davlat: ru=KZ, en=GLOBAL, zh=CN) → CRM `leads`.
   - Outreach → o'z davlati leadlariga xat → CRM `contacts` voronka (engaged/HOT).
   - Targetolog → Meta Ads (KZ) → HOT kontaktlarni retarget.
   - Visual Designer → Midjourney (brend ranglar).
4. **Signal:** eskalatsiya/yakun → Telegram (alert/approval).
5. **Saqlash (Supabase):** `leads · contacts · campaign_logs · tasks · campaign_runs`
   (sxema: `agency/db/migration.sql`).

## Ishga tushirish

```bash
cd agency && pip install -r requirements.txt
python3 status.py                      # jonli-tayyorlik (qaysi tool live/stub)
python3 run_campaign.py build-pro-expo # to'liq E2E (dry-run/stub)
python3 tests/run_tests.py             # 14 test
DRY_RUN=0 python3 run_campaign.py build-pro-expo   # kalitlar .env da bo'lsa — jonli
```

## Model taqsimoti

L1-L3 `claude-opus-4-8` (strategiya) · L4 `claude-sonnet-5` · L5 `claude-haiku-4-5` (arzon/tez).

## Holat

✅ Arxitektura · delegatsiya/dekompozitsiya · qat'iy tasdiqlash + eskalatsiya · LLM ·
Hermes xotira · Tools (Apify/CRM/Telegram/Meta Ads/Midjourney) · E2E · analitika · 14 test.
⏳ Jonli Supabase (bepul limit ochilгач) va real kalitlar bilan uchdan-uchiga jonli run.
