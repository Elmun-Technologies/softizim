"""
Telegram Bot API — CMO/PM bildirishnomalari va Outreach yuborish (Level 6).

env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (standart qabul qiluvchi).
Kalit yo'q bo'lsa — stub: xabar konsolga chiqadi (real yuborilmaydi).
"""
from __future__ import annotations

import os

from .base_tool import BaseTool

TG_BASE = "https://api.telegram.org"


class TelegramBot(BaseTool):
    id = "telegram_bot"
    env_key = "TELEGRAM_BOT_TOKEN"

    def notify(self, text: str, chat_id: str | None = None) -> dict:
        """Bildirishnoma yuboradi (masalan CMO/PM'ga hisobot yoki eskalatsiya)."""
        chat_id = chat_id or os.getenv("TELEGRAM_CHAT_ID", "")
        if not self.available() or not chat_id:
            return {"mode": "stub", "chat_id": chat_id or "(yo'q)", "text": text, "sent": False}
        return self._send(text, chat_id)

    def _send(self, text: str, chat_id: str) -> dict:
        import httpx
        token = os.environ["TELEGRAM_BOT_TOKEN"]
        try:
            r = httpx.post(
                f"{TG_BASE}/bot{token}/sendMessage",
                json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
                timeout=30,
            )
            r.raise_for_status()
            return {"mode": "live", "chat_id": chat_id, "sent": True, "result": r.json().get("ok")}
        except Exception as e:
            return {"mode": "live", "chat_id": chat_id, "sent": False, "error": str(e)}
