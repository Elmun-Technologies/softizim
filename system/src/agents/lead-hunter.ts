import { askJson } from '../lib/anthropic.js';
import { db } from '../lib/supabase.js';
import { PROMPTS } from '../prompts/system-prompts.js';
import { PRIORITY_COUNTRIES } from '../config.js';

interface LeadOut {
  companies: Array<{
    name: string;
    sector: string;
    country: string;
    instagram?: string;
    website?: string;
    source: string;
    note: string;
  }>;
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    companies: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          sector: { type: 'string' },
          country: { type: 'string' },
          instagram: { type: 'string' },
          website: { type: 'string' },
          source: { type: 'string' },
          note: { type: 'string' },
        },
        required: ['name', 'sector', 'country', 'source', 'note'],
      },
    },
  },
  required: ['companies'],
};

/** Tadbir + davlat uchun potentsial exponentlar topib, CRM'ga yozadi. */
export async function huntLeads(eventId: string, countryCode: keyof typeof PRIORITY_COUNTRIES, count = 15) {
  const country = PRIORITY_COUNTRIES[countryCode];
  const { data: ev } = await db.from('events').select('*').eq('id', eventId).single();
  if (!ev) throw new Error(`Tadbir topilmadi: ${eventId}`);

  const out = await askJson<LeadOut>({
    system: PROMPTS.leadHunter,
    smart: true,
    maxTokens: 6000,
    schema: SCHEMA,
    user: `Tadbir: ${ev.name} (${ev.sector}). Davlat: ${country.name} (${countryCode}).
${count} ta real potentsial exponent kompaniyani topib ber. Manba (source) uchun bittasini tanla:
competitor_db | alibaba | customs | diaspora | tender | roadshow.
Har kompaniya shu tadbirning sohasiga (${ev.sector}) mos bo'lsin.`,
  });

  let inserted = 0;
  for (const c of out.companies) {
    const { error } = await db.from('companies').upsert(
      {
        name: c.name,
        sector: c.sector,
        country: countryCode,
        instagram: c.instagram ?? null,
        website: c.website ?? null,
        source: c.source,
        status: 'new',
        notes: c.note,
      },
      { onConflict: 'name,country', ignoreDuplicates: true },
    );
    if (!error) inserted++;
  }
  console.log(`🎯 Lead Hunter: ${out.companies.length} topildi, ${inserted} CRM'ga yozildi (${ev.name}, ${country.name}).`);
  return out.companies;
}
