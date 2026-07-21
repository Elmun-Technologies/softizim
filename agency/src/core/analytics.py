"""
Analytics — kampaniya voronkasi metrikalarini hisoblaydi (x4 richag snapshot).

CRM'dagi leads/contacts asosida: lead soni, kontakt, HOT, konversiya foizlari.
"""
from __future__ import annotations

from collections import Counter


def campaign_metrics(crm) -> dict:
    leads = crm.list_leads()
    engaged = crm.list_contacts("engaged")
    hot = crm.list_contacts("hot")
    n_leads = len(leads)
    n_contacts = len(engaged) + len(hot)
    n_hot = len(hot)

    def pct(a: int, b: int) -> float:
        return round(100 * a / b, 1) if b else 0.0

    return {
        "leads": n_leads,
        "leads_by_country": dict(Counter(l.get("country") for l in leads)),
        "contacts": n_contacts,
        "hot": n_hot,
        "lead_to_contact_pct": pct(n_contacts, n_leads),   # voronka: lead → kontakt
        "contact_to_hot_pct": pct(n_hot, n_contacts),       # voronka: kontakt → HOT
    }


def format_metrics(m: dict) -> str:
    return (
        f"Lead: {m['leads']}  ({m['leads_by_country']})\n"
        f"Kontakt: {m['contacts']}  ·  HOT: {m['hot']}\n"
        f"Konversiya — lead→kontakt: {m['lead_to_contact_pct']}%  ·  "
        f"kontakt→HOT: {m['contact_to_hot_pct']}%"
    )
