import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Profile } from './supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  currentUser: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateProfile: (p: Profile) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  currentUser: null,
  loading: true,
  logout: async () => {},
  updateProfile: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: p } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (p) {
            setProfile(p);
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        
        await minDelay;
      } catch (err) {
        console.error("Supabase auth error", err);
        setProfile(null);
      }
      setLoading(false);
    };

    fetchSession();

    let subscription: any = null;
    
    const auth = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (p) {
          setProfile(p);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    subscription = auth.data.subscription;

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = '/';
  };
  
  const updateProfile = (p: Profile) => {
    setProfile(p);
  };

  return (
    <AuthContext.Provider value={{ user, profile, currentUser: profile, loading, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
