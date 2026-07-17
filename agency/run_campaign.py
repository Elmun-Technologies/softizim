"""
Sof Expo Agency — bitta Expo uchun TO'LIQ kampaniya sikli (End-to-End).

Zanjir: g'oya → CMO dekompozitsiya → bo'limlar (kontent/dizayn/reklama/lead) →
qat'iy tasdiqlash/eskalatsiya → Telegram signal → Apify B2B (KZ/CN/global) → Supabase CRM.

Ishga tushirish (dry-run):  python3 run_campaign.py build-pro-expo
To'liq jonli:               DRY_RUN=0 ANTHROPIC_API_KEY=... APIFY_TOKEN=... \
                            SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
                            TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... \
                            python3 run_campaign.py build-pro-expo
"""
from __future__ import annotations

import os
import sys

from src.core.hierarchy import Hierarchy
from src.core.workflow import TaskState

# Tadbir → soha (config/L6 va docs bilan mos)
EVENTS = {
    "promotors-show": ("Promotors Show", "promo"),
    "build-pro-expo": ("Build Pro Expo", "build"),
    "food-era": ("Food Era", "food"),
    "agro-pro-expo": ("Agro Pro Expo", "agro"),
    "edu-expo": ("Edu Expo", "edu"),
}


def bar(t: str) -> None:
    print("\n" + "█" * 70 + f"\n█ {t}\n" + "█" * 70)


def main() -> None:
    event_id = sys.argv[1] if len(sys.argv) > 1 else os.getenv("ACTIVE_EVENT", "build-pro-expo")
    if event_id not in EVENTS:
        print(f"Noma'lum tadbir: {event_id}. Mavjud: {', '.join(EVENTS)}")
        sys.exit(1)
    name, sector = EVENTS[event_id]
    dry = os.getenv("DRY_RUN", "1") != "0"

    h = Hierarchy(dry_run=dry)
    h.context = {"event": event_id, "event_name": name, "sector": sector, "lead_limit": 5}

    bar(f"SOF EXPO KAMPANIYA — {name}  (dry_run={dry})")
    print(f"Soha: {sector} · Ustuvor: Xitoy(CN)+Qozog'iston(KZ)+global(EN)")
    print(f"Ierarxiya: {h.stats()}  ·  tools: {[f'{t}:{o.mode}' for t,o in h.tools.items()]}")

    # 1) G'OYA → CMO (butun tashkilot ishga tushadi)
    idea = (f"{name} uchun 120 exponent yig'ish kampaniyasi. Byudjet $5000. "
            f"Xitoy va Qozog'iston ustuvor. Ipak Yo'li — Samarqand pozitsiyasi. "
            f"Kontent, dizayn, reklama va lead voronkasi tayyorlansin.")
    cmo = h.agents[h.root_id]
    goal = h.workflow.create(title=f"{name}: 120 exponent kampaniyasi", assigner="ROOT",
                             assignee=cmo.id, payload=idea, acceptance=["Barcha bo'limlar bajardi"])
    h.workflow.transition(goal, TaskState.ASSIGNED, "ROOT → CMO")

    bar("1) DEKOMPOZITSIYA + IJRO (CMO → PM → Head → Worker → Sub)")
    result = h.notify_wrap(cmo, goal)

    # 2) Natijalar hisoboti
    bar("2) LEAD VORONKASI (Apify B2B → Supabase `leads`)")
    crm = h.tools["crm_api"]
    leads = crm.list_leads()
    print(f"CRM ulanishi: {crm.ping()}")
    print(f"Yig'ilgan B2B lead (KZ+CN+global): {len(leads)} kompaniya")
    for c in leads[:6]:
        print(f"  · {c.get('name')} [{c.get('country')}] {c.get('email','')} {c.get('instagram','')}")

    bar("3) SIGNALLAR VA AUDIT — Supabase loglariga yozish")
    kinds: dict[str, int] = {}
    for m in h.bus.trace:
        kinds[m.kind.value] = kinds.get(m.kind.value, 0) + 1
    print(f"Xabarlar (MessageBus): {kinds}")
    print(f"Vazifalar (WorkflowManager): {len(h.workflow.tasks)}")

    # Loglarni DB'ga yozish (jonli bo'lsa campaign_logs / tasks jadvallariga)
    msgs = [{"kind": m.kind.value, "frm": m.frm, "to_agent": m.to, "task_id": m.task_id, "note": m.note}
            for m in h.bus.trace]
    states = [{"task_id": t.id, "assigner": t.assigner, "assignee": t.assignee,
               "title": t.title, "state": t.state.value} for t in h.workflow.tasks.values()]
    print(f"  campaign_logs: {crm.insert('campaign_logs', msgs)}")
    print(f"  tasks:         {crm.insert('tasks', states)}")

    bar("4) YAKUNIY NATIJA (CMO)")
    print(f"Muvaffaqiyat: {result.ok}  ({result.note})")
    print(result.output[:800])
    print("\n✅ End-to-End kampaniya sikli tugadi.")


if __name__ == "__main__":
    main()
