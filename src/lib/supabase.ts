import { createClient } from "@supabase/supabase-js";

// Lazy-loaded Supabase client to prevent crashes if credentials are not set up yet.
const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== "MY_SUPABASE_URL" && 
  supabaseAnonKey && 
  supabaseAnonKey !== "MY_SUPABASE_ANON_KEY";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Types representing the profiles in our system (matching the SQL structure)
 */
export interface Profile {
  id: string;
  role: "tutor" | "guardian" | "admin";
  full_name: string;
  phone?: string;
  email?: string;
  phone_verified?: boolean;
  nid_number?: string;
  present_address?: string;
  created_at?: string;
  updated_at?: string;
}

// In-Memory & LocalStorage backup database for high-fidelity interactive simulation
const LOCAL_USERS_KEY = "poraboo_demo_users";
const CURRENT_USER_KEY = "poraboo_demo_current_user";

export function getLocalCurrentUser(): Profile | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setLocalCurrentUser(user: Profile | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
