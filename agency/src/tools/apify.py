"""
Apify — web/Instagram/Alibaba scraping (Level 6). Lead Gen (Scraper) ishlatadi.

env: APIFY_TOKEN (majburiy real rejim uchun), APIFY_ACTOR (ixtiyoriy, standart actor).
Kalit yo'q bo'lsa — stub rejim: namunaviy lead qaytaradi (voronka sinovi uchun).
"""
from __future__ import annotations

import os

from .base_tool import BaseTool

APIFY_BASE = "https://api.apify.com/v2"


class ApifyScraper(BaseTool):
    id = "apify"
    env_key = "APIFY_TOKEN"

    def scrape_leads(self, source: str, query: str, limit: int = 10) -> list[dict]:
        """Manbadan (source) so'rov (query) bo'yicha lead ro'yxatini yig'adi."""
        if not self.available():
            return self._stub(source, query, limit)
        return self._run_actor(source, query, limit)

    # --- REAL rejim ---
    def _run_actor(self, source: str, query: str, limit: int) -> list[dict]:
        import httpx
        actor = os.getenv("APIFY_ACTOR", "apify~web-scraper")
        token = os.environ["APIFY_TOKEN"]
        url = f"{APIFY_BASE}/acts/{actor}/run-sync-get-dataset-items?token={token}"
        payload = {"query": query, "source": source, "maxItems": limit}
        try:
            r = httpx.post(url, json=payload, timeout=180)
            r.raise_for_status()
            return r.json()[:limit]
        except Exception as e:  # tarmoq/actor xatosi — stubga tushmaymiz, xabar beramiz
            return [{"error": str(e), "source": source, "query": query}]

    # --- STUB rejim (kalitsiz) ---
    def _stub(self, source: str, query: str, limit: int) -> list[dict]:
        return [
            {
                "name": f"{source.title()} Company {i+1}",
                "source": source,
                "query": query,
                "instagram": f"@{source}_company_{i+1}",
                "_stub": True,
            }
            for i in range(min(limit, 3))
        ]
