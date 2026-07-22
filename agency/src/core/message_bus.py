"""
MessageBus — agentlararo muloqot substrati.

Ierarxik yo'nalish: delegatsiya (boshliq → bo'ysunuvchi) va eskalatsiya (bo'ysunuvchi → boshliq).
Xabarlar navbatga tushadi (poll bilan olinadi) va TO'LIQ trace uchun qayd etiladi.
Runtime — xotirada; keyinchalik Supabase `agent_messages` jadvaliga ulash mumkin.
"""
from __future__ import annotations

from collections import defaultdict, deque
from dataclasses import dataclass
from enum import Enum


class MsgType(str, Enum):
    ASSIGN = "assign"          # boshliq → bo'ysunuvchi: vazifa
    RESULT = "result"          # bo'ysunuvchi → boshliq: natija
    REJECT = "reject"          # boshliq → bo'ysunuvchi: qayta ishlash
    ESCALATION = "escalation"  # bo'ysunuvchi → boshliq: hal qilolmadim


@dataclass
class Message:
    kind: MsgType
    frm: str
    to: str
    task_id: str
    note: str = ""


class MessageBus:
    def __init__(self) -> None:
        self._queues: dict[str, deque[Message]] = defaultdict(deque)
        self.trace: list[Message] = []   # to'liq audit izi

    def send(self, msg: Message) -> None:
        self._queues[msg.to].append(msg)
        self.trace.append(msg)

    def poll(self, agent_id: str) -> Message | None:
        q = self._queues[agent_id]
        return q.popleft() if q else None

    def trace_lines(self) -> list[str]:
        return [f"{m.kind.value:11} {m.frm:16}→ {m.to:16} [{m.task_id}] {m.note}" for m in self.trace]
