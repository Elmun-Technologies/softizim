import { ask } from '../lib/anthropic.js';
import { db } from '../lib/supabase.js';
import { PROMPTS } from '../prompts/system-prompts.js';

/** CRM raqamlaridan haftalik hisobot va x4 richag tahlilini beradi. */
export async function weeklyReport() {
  const [{ count: total }, { count: contacted }, { count: warm }, { count: won }, { count: repeat }] = await Promise.all([
    db.from('companies').select('*', { count: 'exact', head: true }),
    db.from('companies').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
    db.from('companies').select('*', { count: 'exact', head: true }).eq('status', 'warm'),
    db.from('companies').select('*', { count: 'exact', head: true }).eq('status', 'won'),
    db.from('companies').select('*', { count: 'exact', head: true }).eq('status', 'repeat'),
  ]);
  const { count: outreachCount } = await db.from('outreach_log').select('*', { count: 'exact', head: true });

  const stats = { total, contacted, warm, won, repeat, outreach: outreachCount };
  const report = await ask({
    system: PROMPTS.analytics,
    smart: true,
    maxTokens: 1500,
    user: `CRM raqamlari (JSON): ${JSON.stringify(stats)}.
x4 richaglari (lead/konversiya/chek/retention) bo'yicha holatni baholab, qisqa haftalik
hisobot va keyingi hafta 3 ustuvor ishni ber. Faqat shu raqamlarga asoslan.`,
  });
  console.log('📊 Analytics — haftalik hisobot:\n');
  console.log('Raqamlar:', JSON.stringify(stats, null, 2), '\n');
  console.log(report);
  return { stats, report };
}
