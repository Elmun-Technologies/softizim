"""
LLMClient — Claude uchun provayder qatlami (Anthropic yoki OpenRouter).

Tanlov: LLM_PROVIDER=anthropic (standart) yoki openrouter.
- anthropic: rasmiy SDK. Kalit: ANTHROPIC_API_KEY.
- openrouter: OpenAI-mos endpoint. Kalit: OPENROUTER_API_KEY.

Eslatma: `thinking` parametri yuborilmaydi — turli modellar (opus-4-8 / sonnet-5 /
haiku-4-5) bo'ylab izchil ishlashi uchun (haiku adaptive thinking'ni qo'llamaydi).
"""
from __future__ import annotations

import os

# OpenRouter uchun model nomlari mapping (kerak bo'lsa .env yoki shu yerda moslang)
OPENROUTER_MAP = {
    "claude-opus-4-8": "anthropic/claude-opus-4",
    "claude-sonnet-5": "anthropic/claude-sonnet-4.5",
    "claude-haiku-4-5": "anthropic/claude-3.5-haiku",
}


class LLMClient:
    def __init__(self, provider: str | None = None) -> None:
        self.provider = provider or os.getenv("LLM_PROVIDER", "anthropic")

    def complete(self, system: str, user: str, model: str, max_tokens: int = 1500) -> str:
        if self.provider == "openrouter":
            return self._openrouter(system, user, model, max_tokens)
        return self._anthropic(system, user, model, max_tokens)

    def _anthropic(self, system: str, user: str, model: str, max_tokens: int) -> str:
        import anthropic  # kechiktirilgan import — dry-run'da kerak emas
        client = anthropic.Anthropic()
        msg = client.messages.create(
            model=model, max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": user}],
        )
        return "".join(b.text for b in msg.content if b.type == "text").strip()

    def _openrouter(self, system: str, user: str, model: str, max_tokens: int) -> str:
        import httpx
        key = os.environ["OPENROUTER_API_KEY"]
        or_model = OPENROUTER_MAP.get(model, model)
        r = httpx.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}"},
            json={
                "model": or_model,
                "max_tokens": max_tokens,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
            },
            timeout=120,
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()
