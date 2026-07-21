"""
Meta Ads API — reklama avtomatizatsiyasi (Level 6). Targetolog ishlatadi.

Qozog'iston (KZ) uchun Meta/Instagram kampaniyalari (Xitoyda Meta bloklangan → outreach).
env: META_ADS_ACCOUNT_ID (act_...), META_ADS_TOKEN. Kalit yo'q → xavfsiz stub.

Pipeline: campaign → adset (geo/audience) → ad (creative).
"""
from __future__ import annotations

import os

from .base_tool import BaseTool

GRAPH = "https://graph.facebook.com/v21.0"

# Davlat kodi → Meta geo targeting
GEO = {"KZ": ["KZ"], "UZ": ["UZ"], "GLOBAL": ["KZ", "UZ", "TR"]}


class MetaAds(BaseTool):
    id = "meta_ads"
    env_key = "META_ADS_TOKEN"

    # --- to'liq pipeline: campaign → adset → ad ---
    def launch(self, name: str, budget_usd: int, country: str = "KZ",
               audience_size: int = 0, objective: str = "OUTCOME_LEADS") -> dict:
        if not self.available():
            return {"mode": "stub", "campaign": name, "budget_usd": budget_usd,
                    "country": country, "objective": objective, "retarget": audience_size,
                    "campaign_id": f"stub_camp_{country}", "adset_id": f"stub_set_{country}",
                    "ad_id": f"stub_ad_{country}"}
        acct = os.getenv("META_ADS_ACCOUNT_ID", "")
        camp = self.create_campaign(acct, name, objective)
        cid = camp.get("id")
        adset = self.create_adset(acct, cid, budget_usd, country) if cid else {}
        sid = adset.get("id")
        ad = self.create_ad(acct, sid, name) if sid else {}
        return {"mode": "live", "campaign": name, "campaign_id": cid,
                "adset_id": sid, "ad_id": ad.get("id"), "country": country}

    def create_campaign(self, acct: str, name: str, objective: str) -> dict:
        return self._post(f"{acct}/campaigns", {
            "name": name, "objective": objective, "status": "PAUSED",
            "special_ad_categories": "[]",
        })

    def create_adset(self, acct: str, campaign_id: str, budget_usd: int, country: str) -> dict:
        return self._post(f"{acct}/adsets", {
            "name": f"{country}-adset",
            "campaign_id": campaign_id,
            "daily_budget": budget_usd * 100 // 30,   # sent (cents), kunlik
            "billing_event": "IMPRESSIONS",
            "optimization_goal": "LEAD_GENERATION",
            "targeting": {"geo_locations": {"countries": GEO.get(country, ["KZ"])}},
            "status": "PAUSED",
        })

    def create_ad(self, acct: str, adset_id: str, name: str) -> dict:
        return self._post(f"{acct}/ads", {
            "name": f"{name}-ad", "adset_id": adset_id, "status": "PAUSED",
        })

    def _post(self, path: str, payload: dict) -> dict:
        import httpx
        token = os.environ["META_ADS_TOKEN"]
        try:
            r = httpx.post(f"{GRAPH}/{path}", params={"access_token": token}, json=payload, timeout=60)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            return {"error": str(e), "path": path}
