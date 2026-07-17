"""
Sof Expo Agency — integratsiya demosi (LLM + Tools + Hermes memory).

Ishga tushirish:  python3 demo_integration.py
Real LLM bilan:   DRY_RUN=0 ANTHROPIC_API_KEY=... python3 demo_integration.py
"""
from __future__ import annotations

import os
from pathlib import Path

from src.core.hierarchy import Hierarchy

ROOT = Path(__file__).resolve().parent


def section(title: str) -> None:
    print("\n" + "=" * 70 + f"\n{title}\n" + "=" * 70)


def demo_llm(h: Hierarchy) -> None:
    section("1) LLM ULANISHI — persona + Hermes xotira → system prompt")
    agent = h.agents["outreach_zh"]
    print(f"Agent: {agent.id} ({agent.role}), model={agent.model}")
    prompt = agent.build_system_prompt()
    print("\n--- Yaratilgan SYSTEM PROMPT (persona + MEMORY.md) ---")
    print(prompt[:600] + ("..." if len(prompt) > 600 else ""))
    if agent._has_key() and not agent.dry_run:
        from src.core.workflow import Task
        t = Task(id="D1", title="Xitoy kafel zavodiga taklif xati (qisqa)", assigner="demo", assignee=agent.id)
        print("\n--- REAL LLM JAVOBI ---")
        print(agent.act(t).output)
    else:
        print("\n(ℹ️ Real javob uchun: DRY_RUN=0 va ANTHROPIC_API_KEY/OPENROUTER_API_KEY kerak)")


def demo_tools(h: Hierarchy) -> None:
    section("2) TOOLS (Level 6) — health + namunaviy chaqiruv")
    for tid, tool in h.tools.items():
        print(f"  {tid:14} → {tool.health()}")

    print("\n--- Kim qaysi tool'ni boshqaradi ---")
    for aid in ["scraper_ru", "outreach_ru", "targetolog", "visual_designer"]:
        owned = list(h.agents[aid].tools.keys())
        print(f"  {aid:16} → {owned}")

    print("\n--- Lead Gen oqimi (stub): Apify scrape → CRM upsert → Telegram notify ---")
    apify = h.tools["apify"]
    crm = h.tools["crm_api"]
    tg = h.tools["telegram_bot"]
    leads = apify.scrape_leads(source="alibaba", query="ceramic tile Uzbekistan", limit=3)
    print(f"  Apify {apify.mode}: {len(leads)} lead topildi")
    for lead in leads:
        crm.upsert_company({"name": lead["name"], "source": lead["source"], "status": "new", "instagram": lead.get("instagram")})
    print(f"  CRM {crm.mode}: bazada {len(crm.list_companies())} kompaniya")
    r = tg.notify(f"📊 CMO hisobot: {len(leads)} yangi lead (ZH) — CRM'ga yozildi.")
    print(f"  Telegram {tg.mode}: sent={r.get('sent')}  →  {r.get('text', '')[:50]}")


def demo_memory() -> None:
    section("3) HERMES XOTIRA — rad etishda dars yozish (append-only)")
    mem_path = ROOT / "memory/subagents/scraper_zh.md"
    before = mem_path.read_text(encoding="utf-8").count("\n- ")
    # scraper_zh ni ataylab muvaffaqiyatsiz qilib, leadgen_zh orqali rad ettiramiz
    h = Hierarchy(dry_run=True, fail_ids={"scraper_zh"})
    from src.core.workflow import Task, TaskState
    lead = h.agents["leadgen_zh"]
    task = h.workflow.create(title="ZH lead voronkasi", assigner="demo", assignee="leadgen_zh")
    h.workflow.transition(task, TaskState.ASSIGNED, "demo")
    lead.handle(task)
    after_text = mem_path.read_text(encoding="utf-8")
    after = after_text.count("\n- ")
    print(f"scraper_zh MEMORY.md — dars yozuvlari: {before} → {after}")
    print("\n--- Lessons Learned bo'limi (yangi yozuvlar) ---")
    section_txt = after_text.split("## Lessons Learned", 1)[1].split("##", 1)[0]
    print("## Lessons Learned" + section_txt.rstrip())


def main() -> None:
    dry = os.getenv("DRY_RUN", "1") != "0"
    h = Hierarchy(dry_run=dry)
    print(f"Ierarxiya yuklandi: {h.stats()}  ·  tools: {list(h.tools)}")
    demo_llm(h)
    demo_tools(h)
    demo_memory()
    print("\n✅ Integratsiya demosi tugadi.")


if __name__ == "__main__":
    main()
