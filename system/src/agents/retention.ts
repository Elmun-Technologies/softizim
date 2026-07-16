import { ask } from '../lib/anthropic.js';
import { db } from '../lib/supabase.js';
import { PROMPTS } from '../prompts/system-prompts.js';
import type { Lang } from '../config.js';

/** O'tgan yilgi/mavjud exponentlarga qayta sotish xatlarini yozadi. */
export async function runRetention(limit = 10) {
  const { data: companies } = await db
    .from('companies')
    .select('*, contacts(*)')
    .eq('is_past_exhibitor', true)
    .neq('status', 'repeat')
    .limit(limit);

  if (!companies?.length) {
    console.log('🔁 Retention: qayta sotiladigan mavjud exponent yo\'q (is_past_exhibitor=true kompaniyalar kerak).');
    return 0;
  }

  let done = 0;
  for (const c of companies as any[]) {
    const lang: Lang = c.contacts?.[0]?.lang ?? 'ru';
    const letter = await ask({
      system: PROMPTS.retention,
      smart: false,
      maxTokens: 1200,
      user: `Mavjud exponent: ${c.name} (${c.sector}, ${c.country}). Til: ${lang}.
Qayta sotish xati yoz: rahmat + kelasi yil 20% erta chegirma + "do'st olib kel 15%" +
elchi dasturi taklifi. Faqat ${lang} tilida, iliq va aniq.`,
    });
    await db.from('outreach_log').insert({
      company_id: c.id,
      contact_id: c.contacts?.[0]?.id ?? null,
      channel: lang === 'zh' ? 'email' : 'whatsapp',
      lang,
      subject: 'Rahmat + kelasi yil taklifi',
      body: letter,
      status: 'drafted',
    });
    done++;
  }
  console.log(`🔁 Retention: ${done} ta qayta-sotish xati tayyorlandi.`);
  return done;
}
