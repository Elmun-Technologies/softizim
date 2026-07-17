"""
Meta Ads API — Qozog'iston reklama kampaniyalari (Level 6). Targetolog ishlatadi.

env: META_ADS_ACCOUNT_ID, META_ADS_TOKEN. Poydevor — real chaqiruv keyingi bosqichda.
"""
from __future__ import annotations

import os

from .base_tool import BaseTool


class MetaAds(BaseTool):
    id = "meta_ads"
    env_key = "META_ADS_TOKEN"

    def create_campaign(self, name: str, budget_usd: int, country: str = "KZ") -> dict:
        if not self.available():
            return {"mode": "stub", "campaign": name, "budget_usd": budget_usd, "country": country}
        # TODO: Graph API chaqiruvi (act_<id>/campaigns). Hozircha poydevor.
        return {"mode": "live", "campaign": name, "account": os.getenv("META_ADS_ACCOUNT_ID")}
