import type { Lang } from '../config.js';

export type Sector = 'build' | 'food' | 'agro' | 'edu' | 'promo';
export type CompanyStatus =
  | 'new' | 'enriched' | 'contacted' | 'warm'
  | 'negotiating' | 'won' | 'lost' | 'repeat';

export interface Company {
  id: string;
  name: string;
  sector: Sector | null;
  country: string | null;
  city: string | null;
  instagram: string | null;
  website: string | null;
  source: string | null;
  status: CompanyStatus;
  score: number;
  is_past_exhibitor: boolean;
  notes: string | null;
}

export interface Contact {
  id: string;
  company_id: string;
  full_name: string | null;
  role: string | null;
  phone: string | null;
  email: string | null;
  lang: Lang;
}

export interface EventRow {
  id: string;
  name: string;
  sector: Sector;
  month: string | null;
  goal_exhibitors: number | null;
  price_usd_start: number | null;
  notes: string | null;
}
