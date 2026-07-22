"""
Sof Expo Agency — kirish nuqtasi.

Ierarxiyani config/ dan yuklaydi, CMO'ga yillik maqsad beradi. Vazifa pastga
delegatsiya qilinadi (CMO → PM → Head → ...), har bosqichda qat'iy tasdiqlash
(WorkflowManager) va kerak bo'lsa eskalatsiya ishlaydi.

Ishga tushirish (dry-run, API kalitsiz):   python3 main.py
Real rejim (Claude bilan):                 DRY_RUN=0 ANTHROPIC_API_KEY=... python3 main.py
Eskalatsiya demosi:                        FAIL_IDS=targetolog python3 main.py
"""
from __future__ import annotations

import os

from src.core.hierarchy import Hierarchy
from src.core.workflow import TaskState


def main() -> None:
    dry_run = os.getenv("DRY_RUN", "1") != "0"
    fail_ids = {x.strip() for x in os.getenv("FAIL_IDS", "").split(",") if x.strip()}

    h = Hierarchy(dry_run=dry_run, fail_ids=fail_ids)

    print("=" * 70)
    print("SOF EXPO AGENCY — 6 darajali ierarxiya")
    print("=" * 70)
    print("Daraja statistikasi:", h.stats())
    print(f"Ildiz: {h.root_id}\n")
    print("\n".join(h.tree_lines()))
    print("\n" + "=" * 70)
    print(f"DELEGATSIYA OQIMI  (dry_run={dry_run}, fail_ids={fail_ids or '—'})")
    print("=" * 70)

    # Ildiz (CMO)'ga yillik maqsad
    cmo = h.agents[h.root_id]
    goal = h.workflow.create(
        title="2026 yillik marketing maqsadi: 10 Expo, x4 lead o'sishi",
        assigner="ROOT", assignee=cmo.id,
        payload="Xitoy+Qozog'iston ustuvor. Har tadbir uchun voronka to'ldirilsin.",
        acceptance=["Barcha bo'limlar reja topshirdi"],
    )
    h.workflow.transition(goal, TaskState.ASSIGNED, "ROOT → CMO")
    result = cmo.handle(goal)

    print("\n--- XABAR IZI (MessageBus trace) ---")
    print("\n".join(h.bus.trace_lines()))

    print("\n--- VAZIFA HOLATLARI (WorkflowManager audit) ---")
    print("\n".join(h.workflow.audit()))

    # Telegram: yakuniy tasdiq yoki xato signali
    if result.ok:
        h.notify(f"'{goal.title}' — barcha bo'limlar rejani topshirdi.", kind="approval")
    else:
        h.notify(f"'{goal.title}' — YAKUNIY ESKALATSIYA. {result.output}", kind="alert")

    print("\n--- YAKUNIY NATIJA (CMO) ---")
    print(f"Muvaffaqiyat: {result.ok}  ({result.note})")
    print(result.output)


if __name__ == "__main__":
    main()
