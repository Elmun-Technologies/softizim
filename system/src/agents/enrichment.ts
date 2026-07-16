import { askJson } from '../lib/anthropic.js';
import { db } from '../lib/supabase.js';
import { PROMPTS } from '../prompts/system-prompts.js';

interface EnrichOut {
  sector: string;
  country: string;
  lang: 'uz' | 'ru' | 'zh';
  score: number;
  reason: string;
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    sector: { type: 'string' },
    country: { type: 'string' },
    lang: { type: 'string', enum: ['uz', 'ru', 'zh'] },
    score: { type: 'integer' },
    reason: { type: 'string' },
  },
  required: ['sector', 'country', 'lang', 'score', 'reason'],
};

/** 'new' holatidagi kompaniyalarni boyitadi: soha, til, sifat bahosi. */
export async function enrichNew(limit = 20) {
  const { data: rows } = await db
    .from('companies')
    .select('*')
    .eq('status', 'new')
    .limit(limit);
  if (!rows?.length) {
    console.log('✨ Enrichment: boyitiladigan yangi kompaniya yo\'q.');
    return 0;
  }

  let done = 0;
  for (const c of rows) {
    const out = await askJson<EnrichOut>({
      system: PROMPTS.enrichment,
      smart: false,
      schema: SCHEMA,
      user: `Kompaniya: ${c.name}. Davlat: ${c.country ?? '?'}. Soha: ${c.sector ?? '?'}.
Izoh: ${c.notes ?? '-'}. Boyit: soha, davlat kodi, outreach tili, 0-100 sifat bahosi, sabab.`,
    });
    await db
      .from('companies')
      .update({ sector: out.sector, score: out.score, status: 'enriched', notes: `${c.notes ?? ''}\n[enrich] ${out.reason}`.trim() })
      .eq('id', c.id);
    // Til kontaktda saqlanadi — placeholder kontakt yaratamiz (agar yo'q bo'lsa)
    const { data: existing } = await db.from('contacts').select('id').eq('company_id', c.id).limit(1);
    if (!existing?.length) {
      await db.from('contacts').insert({ company_id: c.id, role: 'director', lang: out.lang });
    }
    done++;
  }
  console.log(`✨ Enrichment: ${done} kompaniya boyitildi.`);
  return done;
}
