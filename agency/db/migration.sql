-- ============================================================
-- Sof Expo Agency — KONSOLIDATSIYALANGAN MIGRATSIYA (yagona fayl)
-- Supabase SQL editorda yoki MCP apply_migration orqali qo'llang.
-- Jadvallar: leads · contacts · campaign_runs · campaign_logs · tasks · events
-- ============================================================

-- Tadbirlar (ma'lumotnoma)
create table if not exists events (
  id            text primary key,
  name          text not null,
  sector        text not null,             -- build | food | agro | edu | promo
  month         text,
  goal_exhibitors int,
  price_usd_start int
);

-- LEADS — Apify B2B scraper topgan potentsial exponentlar
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  sector        text,
  country       text,                       -- UZ | CN | KZ | GLOBAL ...
  city          text,
  website       text,
  phone         text,
  email         text,
  instagram     text,
  source        text default 'apify_b2b',
  status        text default 'new',         -- new | contacted | warm | negotiating | won | lost
  event_id      text references events(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (name, country)
);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_country on leads(country);

-- CONTACTS — kompaniya ichidagi issiq kontaktlar (outreach/Meta Ads voronkasi)
create table if not exists contacts (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references leads(id) on delete cascade,
  full_name     text,
  role          text,                       -- director | sales_head | export_manager
  phone         text,
  email         text,
  lang          text default 'ru',          -- uz | ru | zh
  stage         text default 'new',         -- new | engaged | hot | meeting | deal
  created_at    timestamptz default now()
);
create index if not exists idx_contacts_lead on contacts(lead_id);

-- CAMPAIGN_RUNS — bitta g'oya → to'liq sikl
create table if not exists campaign_runs (
  id            uuid primary key default gen_random_uuid(),
  event_id      text references events(id),
  goal          text,
  status        text default 'running',     -- running | done | escalated
  leads_found   int default 0,
  started_at    timestamptz default now(),
  finished_at   timestamptz
);

-- CAMPAIGN_LOGS — agentlararo xabarlar (MessageBus)
create table if not exists campaign_logs (
  id            bigserial primary key,
  run_id        uuid references campaign_runs(id) on delete cascade,
  kind          text,                       -- assign | result | reject | escalation
  frm           text,
  to_agent      text,
  task_id       text,
  note          text,
  created_at    timestamptz default now()
);
create index if not exists idx_logs_run on campaign_logs(run_id);

-- TASKS — vazifa holat tarixi (WorkflowManager, qat'iy tasdiqlash auditi)
create table if not exists tasks (
  id            bigserial primary key,
  run_id        uuid references campaign_runs(id) on delete cascade,
  task_id       text,
  assigner      text,
  assignee      text,
  title         text,
  state         text,                       -- created..done / rejected / escalated
  note          text,
  created_at    timestamptz default now()
);
create index if not exists idx_tasks_run on tasks(run_id);

-- Tadbirlar seed (5 ta)
insert into events (id, name, sector, month, goal_exhibitors, price_usd_start) values
  ('promotors-show', 'Promotors Show', 'promo', '2025-09', 60,  1500),
  ('build-pro-expo', 'Build Pro Expo', 'build', '2025-10', 120, 2900),
  ('food-era',       'Food Era',       'food',  '2025-11', 100, 2500),
  ('agro-pro-expo',  'Agro Pro Expo',  'agro',  '2027-03', 100, 2500),
  ('edu-expo',       'Edu Expo',       'edu',   '2027-04', 60,  2000)
on conflict (id) do nothing;
