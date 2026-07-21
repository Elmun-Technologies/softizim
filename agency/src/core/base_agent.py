"""
BaseAgent — barcha agentlar uchun asosiy klass.

Har agent:
- config/<id>.yaml dan rol, model, delegatsiya, tools yuklaydi (Hierarchy orqali);
- Hermes xotirasini (memory/*.md) o'qiydi (recall) va yozadi (remember);
- boshliqdan vazifa oladi (handle), bo'ysunuvchilarga delegatsiya qiladi;
- bo'ysunuvchi natijasini QAT'IY tasdiqlaydi (validate) — muvaffaqiyatsiz bo'lsa
  qayta topshiradi yoki boshliqqa ESKALATSIYA qiladi;
- barg (leaf) agent bo'lsa — o'zi bajaradi (act): dry-run stub yoki Claude API.
"""
from __future__ import annotations

import datetime
import os
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING

from .llm import LLMClient
from .message_bus import Message, MessageBus, MsgType
from .workflow import Task, TaskState, WorkflowManager

if TYPE_CHECKING:
    from .hierarchy import Hierarchy

MAX_RETRIES = 2   # tasdiqlashdan o'tmasa, shuncha marta qayta topshiriladi, keyin eskalatsiya
AGENCY_ROOT = Path(__file__).resolve().parents[2]


@dataclass
class Result:
    ok: bool
    output: str
    note: str = ""


class BaseAgent:
    def __init__(self, cfg: dict, hierarchy: "Hierarchy",
                 dry_run: bool = True, fail_ids: set[str] | None = None) -> None:
        self.cfg = cfg
        self.id: str = cfg["id"]
        self.level: int = cfg["level"]
        self.role: str = cfg.get("role_uz") or cfg.get("role", self.id)
        self.model: str = cfg.get("model", "claude-haiku-4-5")
        self.reports_to: str | None = cfg.get("reports_to")
        self.manages: list[str] = cfg.get("manages") or []
        self.mission: str = (cfg.get("mission") or "").strip()
        self.memory_file: str = cfg.get("memory_file", "")
        self.h = hierarchy
        self.dry_run = dry_run
        self.fail_ids = fail_ids or set()

    # --- bo'ysunuvchilar (faqat agentlar; tool id'lari registrda yo'q) ---
    @property
    def subordinates(self) -> list["BaseAgent"]:
        return [self.h.agents[m] for m in self.manages if m in self.h.agents]

    # --- boshqaradigan tool'lar (Level 6): manages + config `tools` birlashmasi ---
    @property
    def tools(self) -> dict:
        ids = set(self.manages) | set(self.cfg.get("tools") or [])
        return {t: self.h.tools[t] for t in ids if t in self.h.tools}

    # --- Hermes xotira ---
    def recall(self) -> str:
        p = AGENCY_ROOT / self.memory_file
        return p.read_text(encoding="utf-8") if p.exists() else ""

    def remember(self, lesson: str) -> None:
        """Yangi darsni 'Lessons Learned' bo'limiga append-only qo'shadi (Hermes).

        Faol (standart). O'chirish: MEMORY_WRITE=0. Sana avtomatik qo'shiladi.
        """
        if os.getenv("MEMORY_WRITE", "1") == "0":
            return
        p = AGENCY_ROOT / self.memory_file
        if not p.exists():
            return
        today = datetime.date.today().isoformat()
        entry = f"- {today} · {lesson}\n"
        text = p.read_text(encoding="utf-8")
        marker = "## Lessons Learned"
        if marker not in text:
            text += f"\n{marker}\n{entry}"
        else:
            idx = text.index(marker)
            nl = text.index("\n", idx) + 1     # sarlavha qatoridan keyin
            text = text[:nl] + entry + text[nl:]
        p.write_text(text, encoding="utf-8")

    # --- asosiy oqim: vazifani qabul qilish ---
    def handle(self, task: Task) -> Result:
        wf = self.h.workflow
        wf.transition(task, TaskState.IN_PROGRESS, f"{self.id} boshladi")

        if not self.subordinates:            # BARG — o'zi bajaradi
            res = self.act(task)
            task.result = res.output
            wf.transition(task, TaskState.SUBMITTED, "barg natijasi")
            return res

        # MENEJER — bo'ysunuvchilarga delegatsiya
        child_results: dict[str, str] = {}
        for sub in self.subordinates:
            res = self._delegate(task, sub)
            if not res.ok:                   # eskalatsiya pastdan ko'tarildi
                task.result = res.output
                wf.transition(task, TaskState.SUBMITTED, "eskalatsiya bilan yopildi")
                return Result(False, res.output, "escalated")
            child_results[sub.id] = res.output

        output = self.synthesize(task, child_results)
        task.result = output
        wf.transition(task, TaskState.SUBMITTED, "sintez qilindi")
        return Result(True, output, "synthesized")

    # --- bitta bo'ysunuvchiga delegatsiya + qat'iy tasdiqlash ---
    def _delegate(self, parent: Task, sub: "BaseAgent") -> Result:
        wf, bus = self.h.workflow, self.h.bus
        # DEKOMPOZITSIYA: umumiy brifni bo'ysunuvchi uchun ixtisoslashgan sub-vazifaga bo'lish
        title, payload = self.decompose(parent, sub)
        subtask = wf.create(
            title=title,
            assigner=self.id, assignee=sub.id,
            payload=payload,
            acceptance=[f"{sub.role} o'z yo'nalishi bo'yicha aniq natija berdi"],
            parent_id=parent.id,
        )
        bus.send(Message(MsgType.ASSIGN, self.id, sub.id, subtask.id, subtask.title))
        wf.transition(subtask, TaskState.ASSIGNED, "topshirildi")

        res = sub.handle(subtask)
        ok, reason = self.validate(subtask, res)

        # Bo'ysunuvchi ICHIDA allaqachon eskalatsiya bo'lgan bo'lsa — butun bo'limni
        # qayta ishga tushirmaymiz, darhol yuqoriga uzatamiz (chiziqli eskalatsiya).
        already_escalated = res.note == "escalated"
        while not ok and not already_escalated and subtask.attempts < MAX_RETRIES:
            subtask.attempts += 1
            wf.transition(subtask, TaskState.REJECTED, reason)
            bus.send(Message(MsgType.REJECT, self.id, sub.id, subtask.id, reason))
            # Hermes: quyi agent o'z xatosi va darsini xotiraga yozadi (append-only)
            sub.remember(f"[{self.id} rad etdi] {reason} — vazifa: {subtask.title}")
            subtask.feedback = reason        # keyingi urinishda LLM shu izohni ko'radi
            wf.transition(subtask, TaskState.ASSIGNED, f"qayta urinish #{subtask.attempts}")
            res = sub.handle(subtask)
            ok, reason = self.validate(subtask, res)

        if ok:
            wf.transition(subtask, TaskState.VALIDATED, "tasdiqlandi")
            wf.transition(subtask, TaskState.DONE, "yakunlandi")
            bus.send(Message(MsgType.RESULT, sub.id, self.id, subtask.id, "OK"))
            return Result(True, res.output, "validated")

        # Tasdiqlanmadi — boshliqqa eskalatsiya (avval REJECTED, keyin ESCALATED)
        wf.transition(subtask, TaskState.REJECTED, reason)
        if not already_escalated:            # leaf'ning yakuniy xatosi — darsni yozadi
            sub.remember(f"[{self.id} eskalatsiya qildi] {reason} — vazifa: {subtask.title}")
        wf.transition(subtask, TaskState.ESCALATED, reason)
        boss = self.reports_to or "ROOT"
        bus.send(Message(MsgType.ESCALATION, self.id, boss, subtask.id, reason))
        # Telegram: eskalatsiya signali (xato bildirishnomasi)
        self.h.notify(f"⚠️ ESKALATSIYA: {self.id} → {boss}\nVazifa: {subtask.title}\nSabab: {reason}", kind="alert")
        return Result(False, f"ESKALATSIYA [{sub.id}]: {reason}", "escalated")

    # --- QAT'IY TASDIQLASH (State Validation) ---
    def validate(self, subtask: Task, res: Result) -> tuple[bool, str]:
        if not res.ok:
            return False, res.note or "bo'ysunuvchi muvaffaqiyatsiz"
        if not res.output or not res.output.strip():
            return False, "natija bo'sh"
        if res.output.startswith("FAIL:"):
            return False, res.output[5:].strip() or "sifat mezoniga mos emas"
        # (Real rejimda: shu yerda LLM-sudya orqali acceptance mezonlarini tekshirish mumkin)
        return True, "ok"

    # --- DEKOMPOZITSIYA: umumiy brif → bo'ysunuvchi uchun ixtisoslashgan sub-vazifa ---
    def decompose(self, parent: Task, sub: "BaseAgent") -> tuple[str, str]:
        """Boshliq umumiy brifni bo'ysunuvchining yo'nalishiga qarab bo'lib beradi.

        Dry-run: qoidaga asoslangan (sub missiya/mas'uliyatidan). Real: boshliq LLM
        orqali faqat o'sha bo'ysunuvchiga tegishli sub-vazifani generatsiya qiladi.
        """
        sub_resp = ", ".join(sub.cfg.get("responsibilities") or []) or sub.mission
        title = f"[{sub.role}] {parent.title}"

        if self.dry_run or not self._has_key():
            payload = (
                f"UMUMIY BRIF: {parent.payload or parent.title}\n"
                f"SENING YO'NALISHING ({sub.role}): {sub.mission}\n"
                f"FAQAT SHU FOKUS BO'YICHA BAJAR: {sub_resp}"
            )
            return title, payload

        # Real rejim — boshliq brifni bo'ysunuvchi uchun ixtisoslashtiradi
        user = (
            f"Umumiy brif: {parent.title}\n{parent.payload}\n\n"
            f"Buni FAQAT '{sub.role}' bo'ysunuvching uchun ixtisoslashgan, aniq sub-vazifaga "
            f"aylantir. Uning mas'uliyati: {sub_resp}. Boshqa bo'limlar ishini kiritma. "
            f"Qisqa topshiriq (o'zbekcha, 2-4 gap)."
        )
        payload = LLMClient().complete(self.build_system_prompt(), user, self.model, max_tokens=600)
        return title, payload or f"{sub.role} uchun: {parent.title}"

    # --- menejer natijalarni yig'adi ---
    def synthesize(self, task: Task, child_results: dict[str, str]) -> str:
        parts = [f"  ✓ {cid}: {out}" for cid, out in child_results.items()]
        return f"[{self.id}] '{task.title}' yakunlandi ({len(child_results)} bo'lim):\n" + "\n".join(parts)

    # --- persona + Hermes xotira → LLM system prompt ---
    def build_system_prompt(self) -> str:
        resp = ", ".join(self.cfg.get("responsibilities") or []) or "—"
        kpis = ", ".join(self.cfg.get("kpis") or []) or "—"
        memory = self.recall() or "(hozircha bo'sh)"
        return (
            f"Sen — Sof Expo Agency ierarxiyasidagi agentsan.\n"
            f"Rol: {self.role} (Level {self.level})\n"
            f"Missiya: {self.mission}\n"
            f"Mas'uliyatlar: {resp}\n"
            f"KPI: {kpis}\n\n"
            f"--- Sening uzoq muddatli xotirang (Hermes MEMORY.md) ---\n"
            f"{memory}\n"
            f"--- xotira tugadi ---\n\n"
            f"Vazifani bajarib, aniq va amaliy natija ber (o'zbekcha, qisqa va konkret)."
        )

    def _has_key(self) -> bool:
        return bool(os.getenv("ANTHROPIC_API_KEY") or os.getenv("OPENROUTER_API_KEY"))

    # --- davlat kodi (agent id suffiksidan) ---
    COUNTRY = {"ru": "KZ", "en": "GLOBAL", "zh": "CN"}

    # --- barg agent ishni bajaradi ---
    def act(self, task: Task) -> Result:
        if self.id in self.fail_ids:
            return Result(True, f"FAIL: {self.id} vazifani bajarolmadi (demo eskalatsiya)", "forced-fail")
        if self.id.startswith("scraper"):         # SCRAPER — Apify B2B + CRM
            return self._scrape(task)
        if self.id == "targetolog":               # TARGETOLOG — Meta Ads
            return self._run_ads(task)
        if self.id == "visual_designer":          # VISUAL DESIGNER — Midjourney
            return self._render(task)
        if self.id.startswith("outreach"):        # OUTREACH — issiq kontakt voronkasi
            return self._outreach(task)
        if self.dry_run or not self._has_key():
            note = "dry-run" + (f" (feedback: {task.feedback})" if task.feedback else "")
            return Result(True, f"[{self.id}] bajarildi: {task.title}", note)
        return self._act_llm(task)

    def _scrape(self, task: Task) -> Result:
        """Scraper leaf: Apify B2B → CRM save (jonli yoki stub). Til → davlat."""
        country = self.COUNTRY.get(self.id.rsplit("_", 1)[-1], "GLOBAL")
        sector = self.h.context.get("sector", "build")
        limit = self.h.context.get("lead_limit", 3)
        apify = self.tools["apify"]
        crm = self.h.tools.get("crm_api")
        leads = apify.find_b2b(sector=sector, country=country, limit=limit)
        saved = crm.save_leads(leads) if crm else {}
        n = saved.get("saved", saved.get("total", len(leads)))
        return Result(True, f"{len(leads)} B2B lead ({country}/{sector}) — CRM'ga {n} yozildi "
                            f"[apify:{apify.mode}, crm:{crm.mode if crm else '—'}]", "tool:scrape")

    def _outreach(self, task: Task) -> Result:
        """Outreach leaf: o'z davlati leadlariga xat → CRM contacts voronkasi (engaged/hot)."""
        country = self.COUNTRY.get(self.id.rsplit("_", 1)[-1], "GLOBAL")
        lang = {"ru": "ru", "en": "en", "zh": "zh"}.get(self.id.rsplit("_", 1)[-1], "ru")
        crm = self.h.tools.get("crm_api")
        if not crm:
            return Result(True, f"[{self.id}] outreach (CRM yo'q)", "tool:outreach")
        leads = [l for l in crm.list_leads() if l.get("country") == country][: self.h.context.get("outreach_limit", 5)]
        engaged = hot = 0
        for i, lead in enumerate(leads):
            stage = "hot" if i % 3 == 0 else "engaged"   # heuristika: har 3-chi qiziqdi
            crm.route_contact(lead, stage=stage, lang=lang)
            engaged += 1
            hot += stage == "hot"
        return Result(True, f"Outreach ({country}/{lang}): {engaged} kontakt yaratildi, "
                            f"{hot} HOT → CRM voronka [crm:{crm.mode}]", "tool:outreach")

    def _render(self, task: Task) -> Result:
        """Visual Designer leaf: Midjourney render (brend ranglari bilan)."""
        mj = self.tools["midjourney"]
        sector = self.h.context.get("sector", "build")
        prompt = (f"Sof Expo Samarkand — {sector} expo stend, Registon ko'k #0E4D6A + "
                  f"Ipak oltini #D4AF37, premium, Silk Road, minimalist")
        res = mj.render(prompt, ar="4:5")
        return Result(True, f"Vizual render ({mj.mode}): {sector} · brend ranglar · "
                            f"url={res.get('image_url') or '(stub)'}", "tool:midjourney")

    def _run_ads(self, task: Task) -> Result:
        """Targetolog leaf: Meta Ads kampaniya (KZ), issiq kontaktlarni retarget qiladi."""
        meta = self.tools["meta_ads"]
        crm = self.h.tools.get("crm_api")
        sector = self.h.context.get("sector", "build")
        budget = self.h.context.get("ad_budget_usd", 1700)   # Qozog'iston Meta byudjeti
        hot = crm.list_contacts(stage="hot") if crm else []
        res = meta.launch(name=f"{sector}-KZ-retarget", budget_usd=budget,
                          country="KZ", audience_size=len(hot))
        return Result(True, f"Meta Ads ({meta.mode}): '{res.get('campaign')}' · ${budget} · KZ · "
                            f"{len(hot)} HOT kontakt retarget", "tool:meta_ads")

    def _act_llm(self, task: Task) -> Result:
        """Real rejim — Claude (Anthropic yoki OpenRouter) orqali, persona + xotira bilan."""
        user = f"Vazifa: {task.title}\n{task.payload}".strip()
        if task.feedback:
            user += f"\n\nOLDINGI RAD ETISH IZOHI (buni hisobga olib tuzat): {task.feedback}"
        text = LLMClient().complete(self.build_system_prompt(), user, self.model, max_tokens=1500)
        return Result(True, text or f"[{self.id}] (bo'sh javob)", "llm")
