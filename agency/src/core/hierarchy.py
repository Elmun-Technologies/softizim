"""
Hierarchy — config/ dagi per-agent YAML fayllardan 6 darajali ierarxiyani yuklaydi.

Har agent .yaml (id, level 1-5) yuklanadi; L6 tools va divisions.yaml o'tkazib yuboriladi.
reports_to/manages bo'yicha daraxt quriladi va validatsiya qilinadi (bitta ildiz, sikl yo'q,
har agentning boshlig'i mavjud). Agentlar BaseAgent sifatida instansiyalanadi.
"""
from __future__ import annotations

from pathlib import Path

import yaml

from ..tools import TOOL_CLASSES
from .base_agent import BaseAgent
from .message_bus import MessageBus
from .workflow import WorkflowManager

CONFIG_DIR = Path(__file__).resolve().parents[2] / "config"
SKIP = {"divisions", "L6_tools"}


class Hierarchy:
    def __init__(self, dry_run: bool = True, fail_ids: set[str] | None = None) -> None:
        self.workflow = WorkflowManager()
        self.bus = MessageBus()
        self.configs: dict[str, dict] = {}
        self.agents: dict[str, BaseAgent] = {}
        self.tools = {tid: cls() for tid, cls in TOOL_CLASSES.items()}  # Level 6
        self.context: dict = {}          # kampaniya konteksti (sector, event, lead_limit...)
        self.root_id: str | None = None
        self._load_configs()
        self._instantiate(dry_run, fail_ids)
        self.validate()

    def _load_configs(self) -> None:
        for path in sorted(CONFIG_DIR.rglob("*.yaml")):
            if path.stem in SKIP:
                continue
            data = yaml.safe_load(path.read_text(encoding="utf-8"))
            if not isinstance(data, dict) or "id" not in data or "level" not in data:
                continue
            self.configs[data["id"]] = data

    def _instantiate(self, dry_run: bool, fail_ids: set[str] | None) -> None:
        for aid, cfg in self.configs.items():
            self.agents[aid] = BaseAgent(cfg, self, dry_run=dry_run, fail_ids=fail_ids)
            if cfg.get("reports_to") in (None, "null"):
                self.root_id = aid

    def validate(self) -> None:
        """Ierarxiya butunligini tekshiradi: ildiz bor, boshliqlar mavjud, sikl yo'q."""
        if not self.root_id:
            raise ValueError("Ildiz agent (reports_to: null) topilmadi")
        for aid, cfg in self.configs.items():
            boss = cfg.get("reports_to")
            if boss and boss != "null" and boss not in self.configs:
                raise ValueError(f"{aid}: boshliq '{boss}' mavjud emas")
        # sikl tekshiruvi: har agentdan ildizga yo'l bo'lishi kerak
        for aid in self.configs:
            seen, cur = set(), aid
            while cur and cur != "null":
                if cur in seen:
                    raise ValueError(f"Sikl aniqlandi: {aid} zanjirida")
                seen.add(cur)
                cur = self.configs.get(cur, {}).get("reports_to")

    def tree_lines(self, aid: str | None = None, depth: int = 0) -> list[str]:
        aid = aid or self.root_id
        assert aid is not None
        cfg = self.configs[aid]
        out = [f"{'  ' * depth}L{cfg['level']} {aid}  ·  {cfg.get('role_uz', '')}"]
        for m in cfg.get("manages") or []:
            if m in self.configs:              # tool bo'lmasa
                out += self.tree_lines(m, depth + 1)
        return out

    def stats(self) -> dict[str, int]:
        levels: dict[int, int] = {}
        for cfg in self.configs.values():
            levels[cfg["level"]] = levels.get(cfg["level"], 0) + 1
        return {f"L{k}": levels[k] for k in sorted(levels)}

    # --- Telegram bildirishnoma (xato / eskalatsiya / yakuniy tasdiq) ---
    def notify(self, text: str, kind: str = "info") -> dict:
        prefix = {"alert": "🚨", "approval": "✅", "info": "ℹ️"}.get(kind, "ℹ️")
        tg = self.tools.get("telegram_bot")
        if tg is None:
            return {"sent": False, "reason": "telegram_bot yo'q"}
        return tg.notify(f"{prefix} {text}")

    def notify_wrap(self, agent, task):
        """Agentni ishga tushiradi va yakunda Telegram signal (approval/alert) yuboradi."""
        res = agent.handle(task)
        if res.ok:
            self.notify(f"'{task.title}' — barcha bo'limlar bajardi.", "approval")
        else:
            self.notify(f"'{task.title}' — YAKUNIY ESKALATSIYA: {res.output}", "alert")
        return res
