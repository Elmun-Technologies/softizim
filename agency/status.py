"""
Sof Expo Agency — jonli-tayyorlik tekshiruvi.

Har tool va LLM uchun 'live' yoki 'stub' holatini va yetishmayotgan .env kalitlarini
ko'rsatadi. Ishga tushirish:  python3 status.py
"""
from __future__ import annotations

import os

from src.core.hierarchy import Hierarchy

# tool_id -> kerakli qo'shimcha env kalitlar (asosiy env_key'dan tashqari)
EXTRA_KEYS = {
    "crm_api": ["SUPABASE_URL"],
    "meta_ads": ["META_ADS_ACCOUNT_ID"],
    "telegram_bot": ["TELEGRAM_CHAT_ID"],
    "apify": ["APIFY_B2B_ACTOR"],
}


def mark(v: bool) -> str:
    return "✅" if v else "—"


def main() -> None:
    h = Hierarchy(dry_run=True)
    print("=" * 64)
    print("SOF EXPO AGENCY — JONLI TAYYORLIK")
    print("=" * 64)

    # Ish rejimi
    dry = os.getenv("DRY_RUN", "1") != "0"
    mem = os.getenv("MEMORY_WRITE", "1") != "0"
    print(f"Rejim: DRY_RUN={'ha (stub LLM)' if dry else 'yo`q (jonli LLM)'} · "
          f"MEMORY_WRITE={'ha' if mem else 'yo`q'}")

    # LLM
    provider = os.getenv("LLM_PROVIDER", "anthropic")
    llm_key = "ANTHROPIC_API_KEY" if provider == "anthropic" else "OPENROUTER_API_KEY"
    print(f"\nLLM provayder: {provider}  ·  {llm_key}: {mark(bool(os.getenv(llm_key)))}")

    # Tools
    print("\nTOOLS:")
    print(f"  {'tool':14} {'holat':6} yetishmayotgan kalitlar")
    print("  " + "-" * 50)
    all_live = True
    for tid, tool in h.tools.items():
        missing = []
        if tool.env_key and not os.getenv(tool.env_key):
            missing.append(tool.env_key)
        for k in EXTRA_KEYS.get(tid, []):
            if not os.getenv(k):
                missing.append(k)
        if tool.mode != "live":
            all_live = False
        print(f"  {tid:14} {tool.mode:6} {', '.join(missing) or '—'}")

    print("\n" + "=" * 64)
    if all_live and os.getenv(llm_key) and not dry:
        print("✅ TO'LIQ JONLI — `DRY_RUN=0 python3 run_campaign.py <event>` tayyor.")
    else:
        print("ℹ️ STUB/qisman. To'liq jonli uchun: yuqoridagi kalitlarni .env ga qo'ying,")
        print("   Supabase sxemasini `db/migration.sql` bilan yarating, DRY_RUN=0 qo'ying.")


if __name__ == "__main__":
    main()
