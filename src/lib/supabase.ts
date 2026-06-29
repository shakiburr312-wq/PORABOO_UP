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

export function getLocalProfiles(): Profile[] {
  const data = localStorage.getItem(LOCAL_USERS_KEY);
  if (!data) {
    // Seed database with a couple of verified dummy profiles
    const defaultProfiles: Profile[] = [
      {
        id: "demo-tutor-1",
        role: "tutor",
        full_name: "আরিফ রহমান",
        phone: "01712345678",
        email: "arif@poraboo.com",
        phone_verified: true,
        created_at: new Date().toISOString()
      },
      {
        id: "demo-guardian-1",
        role: "guardian",
        full_name: "রাহেলা বেগম",
        phone: "01987654321",
        email: "rahela@poraboo.com",
        phone_verified: true,
        nid_number: "1994261543789",
        present_address: "মিরপুর-১০, ঢাকা",
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaultProfiles));
    return defaultProfiles;
  }
  return JSON.parse(data);
}

export function saveLocalProfile(profile: Profile) {
  const profiles = getLocalProfiles();
  const index = profiles.findIndex(p => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = { ...profiles[index], ...profile, updated_at: new Date().toISOString() };
  } else {
    profiles.push({ ...profile, created_at: new Date().toISOString() });
  }
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(profiles));
}

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
