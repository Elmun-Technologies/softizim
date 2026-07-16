import { ask } from '../lib/anthropic.js';
import { db } from '../lib/supabase.js';
import { PROMPTS } from '../prompts/system-prompts.js';

/** Bitta kompaniya bo'yicha sotuvchiga paket + narx + FOMO tavsiyasini beradi. */
export async function salesAdvice(companyName: string) {
  const { data: c } = await db
    .from('companies')
    .select('*, deals(*)')
    .ilike('name', `%${companyName}%`)
    .limit(1)
    .single();
  if (!c) throw new Error(`Kompaniya topilmadi: ${companyName}`);

  const advice = await ask({
    system: PROMPTS.salesCopilot,
    smart: true,
    maxTokens: 1500,
    user: `Kompaniya: ${c.name} (${c.sector}, ${c.country}, score ${c.score}, status ${c.status}).
Sotuvchi shu kompaniyani yopmoqchi. Ber: (1) mos paket va narx, (2) FOMO argumenti,
(3) buyer/burchak eslatmasi, (4) aniq keyingi qadam. Qisqa, amaliy.`,
  });
  console.log(`💼 Sales Copilot — ${c.name}:\n\n${advice}`);
  return advice;
}
