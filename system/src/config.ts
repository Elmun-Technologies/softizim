import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Muhit o'zgaruvchisi yo'q: ${name} (.env faylini tekshiring)`);
  return v;
}

export const config = {
  anthropicApiKey: required('ANTHROPIC_API_KEY'),
  // Aqlli model — kontent, strategiya, murakkab tahlil uchun
  modelSmart: process.env.MODEL_SMART ?? 'claude-opus-4-8',
  // Arzon model — klassifikatsiya, boyitish, segmentatsiya uchun
  modelCheap: process.env.MODEL_CHEAP ?? 'claude-haiku-4-5',

  supabaseUrl: required('SUPABASE_URL'),
  supabaseKey: required('SUPABASE_SERVICE_ROLE_KEY'),

  metaAdsAccountId: process.env.META_ADS_ACCOUNT_ID ?? '',

  defaultLang: (process.env.DEFAULT_LANG ?? 'uz') as Lang,
  activeEvent: process.env.ACTIVE_EVENT ?? 'build-pro-expo',
};

export type Lang = 'uz' | 'ru' | 'zh';

// Ustuvor davlatlar va ularning outreach kanali (03-xalqaro-jalb hujjatidan)
export const PRIORITY_COUNTRIES = {
  CN: { name: 'Xitoy', lang: 'zh' as Lang, channels: ['alibaba', 'linkedin', 'ai_video', 'email'] },
  KZ: { name: "Qozog'iston", lang: 'ru' as Lang, channels: ['meta_ads', 'instagram', 'whatsapp', 'telegram'] },
} as const;
