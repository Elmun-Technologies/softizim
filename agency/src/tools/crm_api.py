"""
CRM API (Supabase) — lead/deal bazasi (Level 6). Sxema: agency/db/migrations.

env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
Kalit yo'q bo'lsa — stub: xotiradagi ro'yxatga yozadi (voronka sinovi uchun).

Jadvallar: companies (name+country unique), contacts (company_id FK).
"""
from __future__ import annotations

import os

from .base_tool import BaseTool


class CRMClient(BaseTool):
    id = "crm_api"
    env_key = "SUPABASE_SERVICE_ROLE_KEY"

    def __init__(self) -> None:
        self._companies: list[dict] = []   # stub rejim
        self._contacts: list[dict] = []

    def available(self) -> bool:
        return bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

    # --- ulanish tekshiruvi ---
    def ping(self) -> dict:
        if not self.available():
            return {"mode": "stub", "ok": True, "note": "kalitsiz — xotira rejimi"}
        res = self._rest("GET", "companies?select=id&limit=1")
        ok = isinstance(res, list)
        return {"mode": "live", "ok": ok, "detail": res if not ok else "ulandi"}

    # --- bitta kompaniya (companies) ---
    def upsert_company(self, company: dict) -> dict:
        if not self.available():
            self._companies.append(company)
            return {"mode": "stub", "stored": len(self._companies), "company": company.get("name")}
        return self._rest("POST", "companies?on_conflict=name,country", company)

    # --- ko'p lead (batch) ---
    def save_leads(self, leads: list[dict]) -> dict:
        if not self.available():
            self._companies.extend(leads)
            return {"mode": "stub", "saved": len(leads), "total": len(self._companies)}
        res = self._rest("POST", "companies?on_conflict=name,country", leads)
        n = len(res) if isinstance(res, list) else 0
        return {"mode": "live", "saved": n, "detail": res if not n else "ok"}

    # --- kontakt (contacts) ---
    def add_contact(self, company_id: str, contact: dict) -> dict:
        row = {"company_id": company_id, **contact}
        if not self.available():
            self._contacts.append(row)
            return {"mode": "stub", "stored": len(self._contacts)}
        return self._rest("POST", "contacts", row)

    # --- umumiy insert (loglar: agent_runs / agent_messages / task_states / agent_lessons) ---
    def insert(self, table: str, rows: list[dict] | dict) -> dict:
        rows = rows if isinstance(rows, list) else [rows]
        if not self.available():
            return {"mode": "stub", "table": table, "rows": len(rows)}
        res = self._rest("POST", table, rows)
        n = len(res) if isinstance(res, list) else 0
        return {"mode": "live", "table": table, "inserted": n, "detail": res if not n else "ok"}

    # --- lead o'qish ---
    def list_companies(self, status: str | None = None) -> list[dict]:
        if not self.available():
            return [c for c in self._companies if not status or c.get("status") == status]
        path = "companies?select=*" + (f"&status=eq.{status}" if status else "")
        res = self._rest("GET", path)
        return res if isinstance(res, list) else []

    # --- REST yordamchi ---
    def _rest(self, method: str, path: str, body=None):
        import httpx
        base = os.environ["SUPABASE_URL"].rstrip("/")
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=representation",
        }
        try:
            r = httpx.request(method, f"{base}/rest/v1/{path}", headers=headers, json=body, timeout=30)
            r.raise_for_status()
            return r.json() if r.content else []
        except Exception as e:
            return {"error": str(e), "path": path}
