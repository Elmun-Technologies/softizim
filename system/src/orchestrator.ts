import { huntLeads } from './agents/lead-hunter.js';
import { enrichNew } from './agents/enrichment.js';
import { makeContent } from './agents/content-studio.js';
import { runOutreach } from './agents/outreach.js';
import { runRetention } from './agents/retention.js';
import { weeklyReport } from './agents/analytics.js';
import { config } from './config.js';

/**
 * To'liq marketing konveyeri (bir sikl):
 * TOP → BOYIT → KONTENT → OUTREACH → QAYTA SOTISH → HISOBOT
 * Sessiya tugagach ham cron/serverda ishlashi uchun mustaqil chaqiriladi.
 */
export async function runFullCycle(eventId = config.activeEvent) {
  console.log(`\n🚀 Sof Expo konveyer sikli boshlandi — tadbir: ${eventId}\n${'─'.repeat(50)}`);

  // 1. Xitoy + Qozog'iston uchun lead topish
  await huntLeads(eventId, 'CN', 15);
  await huntLeads(eventId, 'KZ', 15);

  // 2. Yangi leadlarni boyitish
  await enrichNew(30);

  // 3. Kontent — isitish Reels (uz) + isbot post (ru)
  await makeContent(eventId, 'reels', 'warm', 'uz');

  // 4. Outreach — boyitilgan kompaniyalarga shaxsiy taklif
  await runOutreach(eventId, 10);

  // 5. Qayta sotish — mavjud exponentlarga
  await runRetention(10);

  // 6. Hisobot
  await weeklyReport();

  console.log(`\n${'─'.repeat(50)}\n✅ Sikl tugadi.`);
}
