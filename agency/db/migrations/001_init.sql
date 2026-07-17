-- Sof Expo Marketing CRM — boshlang'ich sxema
-- Migratsiya: Supabase MCP `apply_migration` yoki SQL editor orqali qo'llang.

-- Tadbirlar (Promotors Show, Build Pro Expo, Food Era, Agro Pro Expo, Edu Expo)
create table if not exists events (
  id            text primary key,          -- masalan: 'build-pro-expo'
  name          text not null,
  sector        text not null,             -- build | food | agro | edu | promo
  month         text,                      -- '2025-10' kabi
  starts_on     date,
  city          text default 'Samarqand',
  goal_exhibitors int,                     -- maqsad: exponentlar soni
  price_usd_start int,                     -- Early Bird stend narxi (USD)
  notes         text,
  created_at    timestamptz default now()
);

-- Kompaniyalar (potentsial/mavjud exponentlar)
create table if not exists companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  sector        text,                      -- build | food | agro | edu | promo
  country       text,                      -- UZ | CN | KZ | TR | RU ...
  city          text,
  instagram     text,
  website       text,
  source        text,                      -- competitor_db | alibaba | customs | diaspora | referral | roadshow | tender | past_exhibitor
  status        text default 'new',        -- new | enriched | contacted | warm | negotiating | won | lost | repeat
  score         int default 0,             -- 0-100 sifat bahosi
  is_past_exhibitor boolean default false,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (name, country)
);
create index if not exists idx_companies_status on companies(status);
create index if not exists idx_companies_sector on companies(sector);

-- Kontaktlar (kompaniya ichidagi shaxslar)
create table if not exists contacts (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references companies(id) on delete cascade,
  full_name     text,
  role          text,                      -- director | sales_head | export_manager
  phone         text,
  email         text,
  lang          text default 'ru',         -- uz | ru | zh — outreach tili
  created_at    timestamptz default now()
);
create index if not exists idx_contacts_company on contacts(company_id);

-- Sotuv voronkasi (deals)
create table if not exists deals (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references companies(id) on delete cascade,
  event_id      text references events(id),
  stage         text default 'lead',       -- lead | contacted | proposal | negotiation | won | lost
  package       text,                      -- start | business | premium | all_inclusive
  price_usd     int,
  booth_no      text,                      -- joy raqami (xarita)
  probability   int default 10,            -- 0-100 %
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index if not exists idx_deals_event on deals(event_id);
create index if not exists idx_deals_stage on deals(stage);

-- Outreach jurnali (yuborilgan xabarlar)
create table if not exists outreach_log (
  id            uuid primary key default gen_random_uuid(),
  contact_id    uuid references contacts(id) on delete cascade,
  company_id    uuid references companies(id) on delete cascade,
  event_id      text references events(id),
  channel       text,                      -- email | whatsapp | dm | ai_video | call
  lang          text,
  subject       text,
  body          text,
  status        text default 'drafted',    -- drafted | sent | replied | bounced
  replied       boolean default false,
  created_at    timestamptz default now()
);
create index if not exists idx_outreach_company on outreach_log(company_id);

-- Kontent reja va holati (Reels/post/press-reliz)
create table if not exists content (
  id            uuid primary key default gen_random_uuid(),
  event_id      text references events(id),
  kind          text,                      -- reels | post | press_release | story | article
  stage         text,                      -- warm | proof | close (voronka bosqichi)
  lang          text default 'uz',
  hook          text,
  script        text,                      -- to'liq ssenariy/matn
  status        text default 'idea',       -- idea | drafted | approved | published
  created_at    timestamptz default now()
);
create index if not exists idx_content_event on content(event_id);

-- Hamkorlar (elchixona, assotsiatsiya, media, bank/lizing, co-organizer)
create table if not exists partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  kind          text,                      -- embassy | association | media | bank | co_organizer | export_agency
  country       text,
  contact       text,
  status        text default 'prospect',   -- prospect | in_talks | signed
  notes         text,
  created_at    timestamptz default now()
);
