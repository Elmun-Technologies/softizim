"""
Apify — B2B kompaniya/kontakt scraping (Level 6). Lead Gen (Scraper) ishlatadi.

env: APIFY_TOKEN, APIFY_B2B_ACTOR (standart: google-maps-scraper), APIFY_ACTOR (generic).
Kalit yo'q bo'lsa — stub: namunaviy B2B lead qaytaradi (voronka sinovi uchun).
"""
from __future__ import annotations

import os

from .base_tool import BaseTool

APIFY_BASE = "https://api.apify.com/v2"


class ApifyScraper(BaseTool):
    id = "apify"
    env_key = "APIFY_TOKEN"

    # --- ASOSIY: B2B kompaniya + kontakt qidiruvchi ---
    def find_b2b(self, sector: str, country: str, limit: int = 10) -> list[dict]:
        """Soha + davlat bo'yicha B2B kompaniyalarni (kontakti bilan) topadi va
        CRM-ga tayyor normalizatsiya qilingan ro'yxat qaytaradi."""
        if not self.available():
            return self._stub_b2b(sector, country, limit)
        actor = os.getenv("APIFY_B2B_ACTOR", "compass~crawler-google-places")
        query = f"{sector} manufacturers suppliers exhibitors {country}"
        run_input = {"searchStringsArray": [query], "maxCrawledPlaces": limit, "language": "en"}
        items = self._run_actor(actor, run_input, limit)
        return [self._normalize(it, sector, country) for it in items if isinstance(it, dict)]

    # --- generic scraping (moslashuvchan) ---
    def scrape_leads(self, source: str, query: str, limit: int = 10) -> list[dict]:
        if not self.available():
            return self._stub_b2b(source, query, limit)
        actor = os.getenv("APIFY_ACTOR", "apify~web-scraper")
        return self._run_actor(actor, {"query": query, "source": source, "maxItems": limit}, limit)

    # --- Apify actor'ni sinxron chaqirish ---
    def _run_actor(self, actor: str, run_input: dict, limit: int) -> list[dict]:
        import httpx
        token = os.environ["APIFY_TOKEN"]
        url = f"{APIFY_BASE}/acts/{actor}/run-sync-get-dataset-items?token={token}"
        try:
            r = httpx.post(url, json=run_input, timeout=300)
            r.raise_for_status()
            data = r.json()
            return data[:limit] if isinstance(data, list) else []
        except Exception as e:
            return [{"error": str(e), "actor": actor}]

    # --- Apify natijasini CRM sxemasiga moslash ---
    @staticmethod
    def _normalize(it: dict, sector: str, country: str) -> dict:
        return {
            "name": it.get("title") or it.get("name") or "Noma'lum",
            "sector": sector,
            "country": country,
            "website": it.get("website") or it.get("url"),
            "phone": it.get("phone") or it.get("phoneNumber"),
            "email": (it.get("emails") or [None])[0] if isinstance(it.get("emails"), list) else it.get("email"),
            "instagram": next((u for u in (it.get("socialMedia") or []) if "instagram" in str(u)), None),
            "source": "apify_b2b",
            "status": "new",
        }

    # --- STUB (kalitsiz) — realistik B2B namuna ---
    def _stub_b2b(self, sector: str, country: str, limit: int) -> list[dict]:
        return [
            {
                "name": f"{sector.title()} B2B {country} #{i+1}",
                "sector": sector, "country": country,
                "website": f"https://{sector}{i+1}.example.com",
                "phone": f"+99890000{i:04d}", "email": f"sales{i+1}@{sector}.example",
                "instagram": f"@{sector}_{country.lower()}_{i+1}",
                "source": "apify_b2b", "status": "new", "_stub": True,
            }
            for i in range(min(limit, 3))
        ]
