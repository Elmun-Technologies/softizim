import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

// Service-role klient — faqat backend (agentlar) uchun. Brauzerga chiqarmang.
export const db = createClient(config.supabaseUrl, config.supabaseKey, {
  auth: { persistSession: false },
});
