"""Sof Expo Agency — tools (Level 6) registri."""
from .apify import ApifyScraper
from .base_tool import BaseTool
from .crm_api import CRMClient
from .meta_ads import MetaAds
from .midjourney import Midjourney
from .telegram_bot import TelegramBot

# id -> klass. Hierarchy shu registrdan tool obyektlarini instansiyalaydi.
TOOL_CLASSES: dict[str, type[BaseTool]] = {
    "apify": ApifyScraper,
    "crm_api": CRMClient,
    "meta_ads": MetaAds,
    "midjourney": Midjourney,
    "telegram_bot": TelegramBot,
}

__all__ = ["BaseTool", "TOOL_CLASSES", "ApifyScraper", "CRMClient", "MetaAds", "Midjourney", "TelegramBot"]
