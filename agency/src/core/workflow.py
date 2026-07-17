"""
WorkflowManager — vazifa holat mashinasi va qat'iy tasdiqlash (State Validation).

Har delegatsiya bir Task yaratadi. Task qat'iy belgilangan holatlar bo'yicha o'tadi;
ruxsatsiz o'tish `InvalidTransition` xatosini beradi — bu "qat'iy tasdiqlash"ning yadrosi.
Holatlar: CREATED → ASSIGNED → IN_PROGRESS → SUBMITTED → (VALIDATED → DONE | REJECTED → ...
→ ESCALATED).
"""
from __future__ import annotations

import itertools
from dataclasses import dataclass, field
from enum import Enum


class TaskState(str, Enum):
    CREATED = "created"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    VALIDATED = "validated"
    DONE = "done"
    REJECTED = "rejected"
    ESCALATED = "escalated"


# Ruxsat etilgan o'tishlar (holat mashinasi). Boshqasi — InvalidTransition.
ALLOWED: dict[TaskState, set[TaskState]] = {
    TaskState.CREATED: {TaskState.ASSIGNED},
    TaskState.ASSIGNED: {TaskState.IN_PROGRESS},
    TaskState.IN_PROGRESS: {TaskState.SUBMITTED},
    TaskState.SUBMITTED: {TaskState.VALIDATED, TaskState.REJECTED},
    TaskState.VALIDATED: {TaskState.DONE},
    TaskState.REJECTED: {TaskState.ASSIGNED, TaskState.ESCALATED},
    TaskState.ESCALATED: {TaskState.ASSIGNED, TaskState.DONE, TaskState.REJECTED},
    TaskState.DONE: set(),
}


class InvalidTransition(Exception):
    """Holat mashinasi ruxsat bermagan o'tish."""


@dataclass
class Task:
    id: str
    title: str
    assigner: str                       # kim topshirdi (agent id)
    assignee: str                       # kimga (agent id)
    payload: str = ""                   # vazifa mazmuni
    acceptance: list[str] = field(default_factory=list)  # tasdiqlash mezonlari
    parent_id: str | None = None
    state: TaskState = TaskState.CREATED
    result: str | None = None
    attempts: int = 0
    history: list[tuple[str, str]] = field(default_factory=list)  # (holat, izoh)

    def __post_init__(self) -> None:
        self.history.append((self.state.value, "yaratildi"))


class WorkflowManager:
    """Vazifalarni yaratadi va holat o'tishlarini qat'iy nazorat qiladi."""

    def __init__(self) -> None:
        self._tasks: dict[str, Task] = {}
        self._counter = itertools.count(1)

    def create(self, title: str, assigner: str, assignee: str, payload: str = "",
               acceptance: list[str] | None = None, parent_id: str | None = None) -> Task:
        tid = f"T{next(self._counter):03d}"
        task = Task(id=tid, title=title, assigner=assigner, assignee=assignee,
                    payload=payload, acceptance=acceptance or [], parent_id=parent_id)
        self._tasks[tid] = task
        return task

    def transition(self, task: Task, new_state: TaskState, note: str = "") -> None:
        if new_state not in ALLOWED[task.state]:
            raise InvalidTransition(
                f"{task.id}: {task.state.value} → {new_state.value} ruxsat etilmagan"
            )
        task.state = new_state
        task.history.append((new_state.value, note))

    @property
    def tasks(self) -> dict[str, Task]:
        return self._tasks

    def audit(self) -> list[str]:
        """Barcha vazifalarning holat tarixini o'qiladigan ko'rinishda qaytaradi."""
        lines: list[str] = []
        for t in self._tasks.values():
            trail = " → ".join(h[0] for h in t.history)
            lines.append(f"{t.id} [{t.assigner}→{t.assignee}] {t.title}: {trail}")
        return lines
