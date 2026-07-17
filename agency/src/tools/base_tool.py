"""
BaseTool — tashqi API integratsiyalari uchun asosiy shablon (Level 6).

Har tool env kalit orqali ulanadi. Kalit yo'q bo'lsa `stub` rejimda ishlaydi
(xavfsiz namunaviy javob qaytaradi) — bu dry-run va sinovni imkon beradi.
"""
from __future__ import annotations

import os


class BaseTool:
    id: str = "base"
    env_key: str = ""          # asosiy autentifikatsiya kaliti (env nomi)

    def available(self) -> bool:
        """Real API uchun kalit bormi?"""
        return bool(os.getenv(self.env_key)) if self.env_key else True

    @property
    def mode(self) -> str:
        return "live" if self.available() else "stub"

    def health(self) -> dict:
        return {"tool": self.id, "env_key": self.env_key, "mode": self.mode}
