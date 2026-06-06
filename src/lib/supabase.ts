import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Public client credentials — safe in frontend; RLS enforces access.
// Env vars override these when set (local .env / Vercel dashboard).
const DEFAULT_SUPABASE_URL = 'https://wekfdhvlqmuqlghwukqh.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'sb_publishable_1LWTOXeeNDWJCMsTTT9e0w_9_1bCiHH'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL
const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_SUPABASE_ANON_KEY

export function isSupabaseConfigured() {
  return Boolean(url && anonKey)
}

let client: SupabaseClient<Database> | null = null

export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env',
    )
  }
  if (!client) {
    client = createClient<Database>(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}
