"""
Sof Expo Agency — integratsiya demosi (Dekompozitsiya + Tools + LLM + Hermes).

Ishga tushirish:  python3 demo_integration.py
Real LLM bilan:   DRY_RUN=0 ANTHROPIC_API_KEY=... python3 demo_integration.py
"""
from __future__ import annotations

import os
from pathlib import Path

from src.core.hierarchy import Hierarchy
from src.core.workflow import Task, TaskState

ROOT = Path(__file__).resolve().parent


def section(title: str) -> None:
    print("\n" + "=" * 70 + f"\n{title}\n" + "=" * 70)


def demo_decomposition(h: Hierarchy) -> None:
    section("1) DEKOMPOZITSIYA — PM umumiy brifni har Head uchun ixtisoslashtiradi")
    pm = h.agents["pm"]
    brief = Task(id="B", title="Build Pro Expo — 120 exponent yig'ish kampaniyasi",
                 assigner="cmo", assignee="pm",
                 payload="Byudjet $5000. Xitoy+Qozog'iston ustuvor. Oktabr tadbiri.")
    for head_id in pm.manages:
        head = h.agents[head_id]
        title, payload = pm.decompose(brief, head)
        print(f"\n▶ {head.role} ({head_id})")
        print("  " + payload.replace("\n", "\n  "))


def demo_tools(h: Hierarchy) -> None:
    section("2) TOOLS (Level 6) — jonli/stub + B2B lead pipeline")
    for tid, tool in h.tools.items():
        print(f"  {tid:14} → {tool.health()}")

    print("\n--- Lead Gen pipeline: Apify B2B → CRM save → Telegram signal ---")
    apify, crm, tg = h.tools["apify"], h.tools["crm_api"], h.tools["telegram_bot"]

    print(f"  CRM ulanishi: {crm.ping()}")
    leads = apify.find_b2b(sector="build", country="CN", limit=3)
    print(f"  Apify {apify.mode}: {len(leads)} B2B kompaniya topildi (kontakt bilan)")
    print(f"    namuna: {leads[0]['name']} · {leads[0]['email']} · {leads[0]['instagram']}")
    saved = crm.save_leads(leads)
    print(f"  CRM {crm.mode}: {saved} · jami leads: {len(crm.list_leads())}")
    r = tg.approval(f"Build Pro Expo: {len(leads)} yangi B2B lead (CN) CRM'ga yozildi.")
    print(f"  Telegram {tg.mode}: sent={r.get('sent')}")


def demo_llm(h: Hierarchy) -> None:
    section("3) LLM ULANISHI — persona + Hermes xotira → system prompt")
    agent = h.agents["outreach_zh"]
    print(f"Agent: {agent.id} ({agent.role}), model={agent.model}")
    prompt = agent.build_system_prompt()
    print("--- SYSTEM PROMPT (qisqartma) ---")
    print(prompt[:400] + "...")
    if agent._has_key() and not agent.dry_run:
        t = Task(id="D1", title="Xitoy kafel zavodiga qisqa taklif xati", assigner="demo", assignee=agent.id)
        print("\n--- REAL LLM JAVOBI ---\n" + agent.act(t).output)
    else:
        print("(ℹ️ Real javob: DRY_RUN=0 + ANTHROPIC_API_KEY/OPENROUTER_API_KEY)")


def demo_memory() -> None:
    section("4) HERMES XOTIRA + TELEGRAM — eskalatsiyada dars yozish va signal")
    mem_path = ROOT / "memory/subagents/scraper_zh.md"
    before = mem_path.read_text(encoding="utf-8").count("\n- ")
    h = Hierarchy(dry_run=True, fail_ids={"scraper_zh"})
    lead = h.agents["leadgen_zh"]
    task = h.workflow.create(title="ZH lead voronkasi", assigner="demo", assignee="leadgen_zh")
    h.workflow.transition(task, TaskState.ASSIGNED, "demo")
    lead.handle(task)
    after_text = mem_path.read_text(encoding="utf-8")
    print(f"scraper_zh MEMORY.md — dars yozuvlari: {before} → {after_text.count(chr(10)+'- ')}")
    lessons = after_text.split("## Lessons Learned", 1)[1].split("##", 1)[0].strip().splitlines()
    for line in lessons[:3]:
        print("  " + line)
    alerts = [m for m in h.bus.trace if m.kind.value == "escalation"]
    print(f"\nTelegram eskalatsiya signallari (Hierarchy.notify → alert): {len(alerts)} ta")


def main() -> None:
    dry = os.getenv("DRY_RUN", "1") != "0"
    h = Hierarchy(dry_run=dry)
    print(f"Ierarxiya: {h.stats()}  ·  tools: {list(h.tools)}")
    demo_decomposition(h)
    demo_tools(h)
    demo_llm(h)
    demo_memory()
    print("\n✅ Integratsiya demosi tugadi.")


if __name__ == "__main__":
    main()
