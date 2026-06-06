import { getSupabase, isSupabaseConfigured } from './supabase'
import type { ProfileRow } from '../types/database'
import type { User, UserRole } from './api'

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error || !data) return null
  return data
}

export function profileToUser(profile: ProfileRow): User {
  return {
    id: profile.id,
    name: profile.full_name ?? profile.email.split('@')[0],
    email: profile.email,
    role: profile.role as UserRole,
  }
}

export async function verifyOwnerRole(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  const profile = await fetchProfile(userId)
  return profile?.role === 'owner'
}
