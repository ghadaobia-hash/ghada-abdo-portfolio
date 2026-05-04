import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** @returns {boolean} */
export function isSupabaseConfigured() {
  return Boolean(
    typeof supabaseUrl === 'string' &&
      supabaseUrl.length > 0 &&
      typeof supabaseAnonKey === 'string' &&
      supabaseAnonKey.length > 0 &&
      supabaseUrl.startsWith('http')
  );
}

let client = null;

/** @returns {import('@supabase/supabase-js').SupabaseClient | null} */
export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
