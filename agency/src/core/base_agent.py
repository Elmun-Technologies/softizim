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

    # --- boshqaradigan tool'lar (Level 6) ---
    @property
    def tools(self) -> dict:
        return {t: self.h.tools[t] for t in self.manages if t in self.h.tools}

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
        subtask = wf.create(
            title=f"{sub.role}: {parent.title}",
            assigner=self.id, assignee=sub.id,
            payload=parent.payload,
            acceptance=[f"{sub.role} natijasi bo'sh emas va mezonga mos"],
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

    # --- barg agent ishni bajaradi ---
    def act(self, task: Task) -> Result:
        if self.id in self.fail_ids:
            return Result(True, f"FAIL: {self.id} vazifani bajarolmadi (demo eskalatsiya)", "forced-fail")
        if self.dry_run or not self._has_key():
            note = "dry-run" + (f" (feedback: {task.feedback})" if task.feedback else "")
            return Result(True, f"[{self.id}] bajarildi: {task.title}", note)
        return self._act_llm(task)

    def _act_llm(self, task: Task) -> Result:
        """Real rejim — Claude (Anthropic yoki OpenRouter) orqali, persona + xotira bilan."""
        user = f"Vazifa: {task.title}\n{task.payload}".strip()
        if task.feedback:
            user += f"\n\nOLDINGI RAD ETISH IZOHI (buni hisobga olib tuzat): {task.feedback}"
        text = LLMClient().complete(self.build_system_prompt(), user, self.model, max_tokens=1500)
        return Result(True, text or f"[{self.id}] (bo'sh javob)", "llm")
