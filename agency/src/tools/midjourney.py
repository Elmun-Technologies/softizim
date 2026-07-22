"""
Midjourney API — vizual/render generatsiya (Level 6). Visual Designer ishlatadi.

env: MIDJOURNEY_API_KEY. Poydevor — real chaqiruv keyingi bosqichda.
Brend ranglari: Registon ko'ki #0E4D6A + Ipak oltini #D4AF37.
"""
from __future__ import annotations

from .base_tool import BaseTool


class Midjourney(BaseTool):
    id = "midjourney"
    env_key = "MIDJOURNEY_API_KEY"

    def render(self, prompt: str, ar: str = "4:5") -> dict:
        if not self.available():
            return {"mode": "stub", "prompt": prompt, "ar": ar, "image_url": None}
        # TODO: real render chaqiruvi. Hozircha poydevor.
        return {"mode": "live", "prompt": prompt, "ar": ar}
