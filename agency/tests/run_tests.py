"""
Sof Expo Agency — yengil test to'plami (pytest'siz, oddiy assert).

Ishga tushirish:  python3 tests/run_tests.py
Xotira fayllariga tegmaydi (MEMORY_WRITE=0).
"""
from __future__ import annotations

import os
import sys

os.environ["MEMORY_WRITE"] = "0"          # test memory/*.md ga yozmasin
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.hierarchy import Hierarchy
from src.core.workflow import InvalidTransition, TaskState, WorkflowManager

PASS = FAIL = 0


def check(name: str, cond: bool) -> None:
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  ✅ {name}")
    else:
        FAIL += 1
        print(f"  ❌ {name}")


def new_hier(**kw) -> Hierarchy:
    h = Hierarchy(dry_run=True, **kw)
    h.context = {"sector": "build", "lead_limit": 5, "outreach_limit": 5}
    return h


def run_goal(h: Hierarchy, fail=False):
    cmo = h.agents[h.root_id]
    g = h.workflow.create(title="test", assigner="ROOT", assignee=cmo.id)
    h.workflow.transition(g, TaskState.ASSIGNED)
    return cmo.handle(g)


print("1) Ierarxiya yuklash va butunlik")
h = new_hier()
check("stats L1=1,L2=1,L3=5,L4=10,L5=9", h.stats() == {"L1": 1, "L2": 1, "L3": 5, "L4": 10, "L5": 9})
check("ildiz = cmo", h.root_id == "cmo")
check("40 config yuklandi (agentlar)", len(h.configs) >= 25)

print("2) WorkflowManager — qat'iy holat mashinasi")
wf = WorkflowManager()
t = wf.create("x", "a", "b")
raised = False
try:
    wf.transition(t, TaskState.DONE)     # created → done ruxsatsiz
except InvalidTransition:
    raised = True
check("ruxsatsiz o'tish InvalidTransition beradi", raised)

print("3) Delegatsiya — muvaffaqiyatli oqim")
res = run_goal(new_hier())
check("CMO natijasi ok", res.ok)

print("4) Eskalatsiya — leaf muvaffaqiyatsizligi yuqoriga chiqadi")
res = run_goal(new_hier(fail_ids={"scraper_zh"}))
check("scraper_zh fail → CMO ok emas", not res.ok)
check("natijada eskalatsiya izi bor", "ESKALATSIYA" in (res.output or ""))

print("5) Dekompozitsiya — ixtisoslashgan sub-brief")
h = new_hier()
pm = h.agents["pm"]
head = h.agents["head_content"]
parent = h.workflow.create("brief", "cmo", "pm", payload="umumiy")
_, payload = pm.decompose(parent, head)
check("sub-brief head_content missiyasini o'z ichiga oladi", head.mission[:15] in payload)

print("6) Tools — stub rejim va lead/kontakt voronkasi")
h = new_hier()
check("apify stub", h.tools["apify"].mode == "stub")
run_goal(h)
crm = h.tools["crm_api"]
check("scraper leadlar yozdi (9)", len(crm.list_leads()) == 9)
check("outreach hot kontakt yaratdi", len(crm.list_contacts("hot")) >= 1)
ad = h.tools["meta_ads"].launch("t", 1700, "KZ")
check("meta_ads kampaniya qaytardi", ad.get("campaign") == "t")

print("7) Analitika — voronka metrikalari")
from src.core.analytics import campaign_metrics
m = campaign_metrics(crm)
check("leads=9 metrikada", m["leads"] == 9)
check("konversiya foizi hisoblandi", m["lead_to_contact_pct"] > 0)

print("\n" + "=" * 50)
print(f"NATIJA: {PASS} PASS · {FAIL} FAIL")
sys.exit(1 if FAIL else 0)
