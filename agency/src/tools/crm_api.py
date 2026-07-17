"""
CRM API (Supabase) — lead/deal bazasi (Level 6). Sxema: agency/db/migrations.

env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
Kalit yo'q bo'lsa — stub: xotiradagi ro'yxatga yozadi (voronka sinovi uchun).
"""
from __future__ import annotations

import os

from .base_tool import BaseTool


class CRMClient(BaseTool):
    id = "crm_api"
    env_key = "SUPABASE_SERVICE_ROLE_KEY"

    def __init__(self) -> None:
        self._mem: list[dict] = []   # stub rejim uchun xotira

    def available(self) -> bool:
        return bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

    # --- lead yozish ---
    def upsert_company(self, company: dict) -> dict:
        if not self.available():
            self._mem.append(company)
            return {"mode": "stub", "stored": len(self._mem), "company": company.get("name")}
        return self._rest("POST", "companies", company)

    # --- lead o'qish ---
    def list_companies(self, status: str | None = None) -> list[dict]:
        if not self.available():
            return [c for c in self._mem if not status or c.get("status") == status]
        path = "companies" + (f"?status=eq.{status}" if status else "")
        return self._rest("GET", path)

    def _rest(self, method: str, path: str, body: dict | None = None):
        import httpx
        base = os.environ["SUPABASE_URL"].rstrip("/")
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=representation",
        }
        url = f"{base}/rest/v1/{path}"
        try:
            r = httpx.request(method, url, headers=headers, json=body, timeout=30)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            return {"error": str(e), "path": path}
