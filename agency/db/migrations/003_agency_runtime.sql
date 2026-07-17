-- Sof Expo Agency — runtime loglari (agentlar ishini kuzatish uchun)
-- Xabar shini (MessageBus) va vazifa holatlarini (WorkflowManager) doimiy saqlaydi.

-- Kampaniya yugurishi (bitta run = bitta g'oya → to'liq sikl)
create table if not exists agent_runs (
  id            uuid primary key default gen_random_uuid(),
  event_id      text references events(id),
  goal          text,
  status        text default 'running',   -- running | done | escalated
  leads_found   int default 0,
  started_at    timestamptz default now(),
  finished_at   timestamptz
);

-- Agentlararo xabarlar (assign / result / reject / escalation)
create table if not exists agent_messages (
  id            bigserial primary key,
  run_id        uuid references agent_runs(id) on delete cascade,
  kind          text,                      -- assign | result | reject | escalation
  frm           text,
  to_agent      text,
  task_id       text,
  note          text,
  created_at    timestamptz default now()
);
create index if not exists idx_msg_run on agent_messages(run_id);

-- Vazifa holat tarixi (state machine audit)
create table if not exists task_states (
  id            bigserial primary key,
  run_id        uuid references agent_runs(id) on delete cascade,
  task_id       text,
  assigner      text,
  assignee      text,
  title         text,
  state         text,                      -- created..done / rejected / escalated
  note          text,
  created_at    timestamptz default now()
);
create index if not exists idx_state_run on task_states(run_id);

-- Hermes xotira darslari (MEMORY.md ning DB nusxasi — ixtiyoriy sinxron)
create table if not exists agent_lessons (
  id            bigserial primary key,
  agent_id      text,
  lesson        text,
  created_at    timestamptz default now()
);
