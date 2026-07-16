import { ask } from '../lib/anthropic.js';
import { db } from '../lib/supabase.js';
import { PROMPTS } from '../prompts/system-prompts.js';
import type { Lang } from '../config.js';

type Kind = 'reels' | 'post' | 'press_release';
type Stage = 'warm' | 'proof' | 'close';

/** Tadbir uchun kontent (Reels/post/press-reliz) yozadi va CRM'ga saqlaydi. */
export async function makeContent(eventId: string, kind: Kind, stage: Stage, lang: Lang = 'uz') {
  const { data: ev } = await db.from('events').select('*').eq('id', eventId).single();
  if (!ev) throw new Error(`Tadbir topilmadi: ${eventId}`);

  const stageDesc = { warm: 'muammo ko\'rsat (isitish)', proof: 'isbot ber', close: 'taklif/FOMO (yopish)' }[stage];
  const kindDesc = { reels: 'Instagram Reels ssenariysi', post: 'Instagram post matni', press_release: 'press-reliz' }[kind];

  const script = await ask({
    system: PROMPTS.contentStudio,
    smart: true,
    maxTokens: 3000,
    user: `Tadbir: ${ev.name} (${ev.sector}). Til: ${lang}. Tur: ${kindDesc}. Voronka bosqichi: ${stageDesc}.
Tayyor, darhol ishlatsa bo'ladigan ${kindDesc} yoz. Reels bo'lsa: hook + ssenariy + montaj + hashtag.`,
  });

  // hook — birinchi mazmunli qator
  const hook = script.split('\n').find((l) => l.trim().length > 0)?.slice(0, 200) ?? '';
  await db.from('content').insert({ event_id: eventId, kind, stage, lang, hook, script, status: 'drafted' });

  console.log(`🎬 Content Studio: ${kindDesc} (${stage}) yozildi — ${ev.name}.\n`);
  console.log(script);
  return script;
}
