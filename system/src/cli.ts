#!/usr/bin/env tsx
// Sof Expo agent CLI. Foydalanish: npm run agent <buyruq> [args]
import { config } from './config.js';
import { huntLeads } from './agents/lead-hunter.js';
import { enrichNew } from './agents/enrichment.js';
import { makeContent } from './agents/content-studio.js';
import { runOutreach } from './agents/outreach.js';
import { salesAdvice } from './agents/sales-copilot.js';
import { runRetention } from './agents/retention.js';
import { weeklyReport } from './agents/analytics.js';
import { runFullCycle } from './orchestrator.js';
import type { Lang } from './config.js';

const [cmd, ...args] = process.argv.slice(2);
const event = config.activeEvent;

const commands: Record<string, () => Promise<unknown>> = {
  // npm run hunt -- CN 15   (davlat, soni)
  hunt: () => huntLeads(event, (args[0] as any) ?? 'CN', Number(args[1] ?? 15)),
  // npm run enrich
  enrich: () => enrichNew(Number(args[0] ?? 30)),
  // npm run content -- reels warm uz
  content: () => makeContent(event, (args[0] as any) ?? 'reels', (args[1] as any) ?? 'warm', (args[2] as Lang) ?? config.defaultLang),
  // npm run outreach
  outreach: () => runOutreach(event, Number(args[0] ?? 10)),
  // npm run sales -- "Kompaniya nomi"
  sales: () => salesAdvice(args.join(' ')),
  // npm run retain
  retain: () => runRetention(Number(args[0] ?? 10)),
  // npm run report
  report: () => weeklyReport(),
  // npm run cycle   — to'liq konveyer
  cycle: () => runFullCycle(event),
};

async function main() {
  if (!cmd || !commands[cmd]) {
    console.log(`Sof Expo agent CLI

Buyruqlar:
  hunt <CN|KZ> <n>          Lead topish (davlat, soni)
  enrich [n]                Yangi leadlarni boyitish
  content <reels|post|press_release> <warm|proof|close> <uz|ru|zh>
  outreach [n]              Shaxsiy taklif xatlari
  sales "<kompaniya>"       Sotuv tavsiyasi
  retain [n]                Qayta sotish xatlari
  report                    Haftalik hisobot
  cycle                     To'liq konveyer sikli

Faol tadbir: ${event}  (.env dagi ACTIVE_EVENT)`);
    process.exit(cmd ? 1 : 0);
  }
  await commands[cmd]();
}

main().catch((e) => {
  console.error('❌ Xato:', e.message);
  process.exit(1);
});
