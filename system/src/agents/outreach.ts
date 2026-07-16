import { ask } from '../lib/anthropic.js';
import { db } from '../lib/supabase.js';
import { PROMPTS } from '../prompts/system-prompts.js';
import { EMAIL_TEMPLATES, fill } from '../templates/outreach.js';
import type { Lang } from '../config.js';

/** 'enriched' kompaniyalarga shaxsiy taklif xati yozadi (til bo'yicha) va jurnalga yozadi. */
export async function runOutreach(eventId: string, limit = 10) {
  const { data: ev } = await db.from('events').select('*').eq('id', eventId).single();
  if (!ev) throw new Error(`Tadbir topilmadi: ${eventId}`);

  const { data: companies } = await db
    .from('companies')
    .select('*, contacts(*)')
    .eq('status', 'enriched')
    .order('score', { ascending: false })
    .limit(limit);

  if (!companies?.length) {
    console.log('📨 Outreach: aloqa qilinadigan boyitilgan kompaniya yo\'q.');
    return 0;
  }

  let sent = 0;
  for (const c of companies as any[]) {
    const contact = c.contacts?.[0];
    const lang: Lang = contact?.lang ?? 'ru';
    const channel = lang === 'zh' ? 'email' : 'whatsapp';
    const skeleton = EMAIL_TEMPLATES[lang];

    const body = await ask({
      system: PROMPTS.outreach,
      smart: true,
      maxTokens: 1500,
      user: `Kompaniya: ${c.name} (${c.sector}, ${c.country}). Tadbir: ${ev.name}. Til: ${lang}. Kanal: ${channel}.
Quyidagi skeletni shu kompaniyaga MOSLASHTIR va tabiiy, shaxsiy xat qil (faqat ${lang} tilida):
---
${fill(skeleton.body, { name: c.name, sector: c.sector ?? '', event: ev.name })}
---`,
    });

    await db.from('outreach_log').insert({
      contact_id: contact?.id ?? null,
      company_id: c.id,
      event_id: eventId,
      channel,
      lang,
      subject: fill(skeleton.subject, { event: ev.name, sector: c.sector ?? '' }),
      body,
      status: 'drafted',
    });
    await db.from('companies').update({ status: 'contacted' }).eq('id', c.id);
    sent++;
  }
  console.log(`📨 Outreach: ${sent} ta shaxsiy taklif tayyorlandi (${ev.name}).`);
  return sent;
}
