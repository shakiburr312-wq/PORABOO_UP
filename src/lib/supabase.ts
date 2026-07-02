import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export interface Profile {
  id: string
  role: 'tutor' | 'guardian' | 'admin'
  full_name: string
  phone?: string
  email?: string
  avatar_url?: string
  cover_url?: string
  bio?: string
  living_area?: string
  phone_verified?: boolean
  nid_number?: string
  present_address?: string
  created_at?: string
  updated_at?: string
}
