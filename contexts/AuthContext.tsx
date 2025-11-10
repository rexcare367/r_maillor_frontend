'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { getSupabaseFrontendClient } from '@/lib/supabase/client';
import { axiosAuth } from '@/lib/axios';

interface UserProfile {
  user: {
    id: string;
    email?: string;
    email_verified?: boolean;
    created_at?: string;
    last_sign_in_at?: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
    [key: string]: unknown;
  } | null;
  stripe_customer?: {
    id?: string;
    user_id?: string;
    stripe_customer_id?: string;
    email?: string;
    name?: string;
    created_at?: string;
    updated_at?: string;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
  } | null;
  subscriptions?: {
    active?: Record<string, unknown> | null;
    all?: Array<Record<string, unknown>>;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; profile: UserProfile | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; user: User | null; profile: UserProfile | null }>;
  refreshSession: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axiosAuth.get<UserProfile>('/profile/me');
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabaseFrontendClient();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.access_token) {
        fetchProfile();
      } else {
        setProfile(null);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.access_token) {
        fetchProfile();
      } else {
        setProfile(null);
      }

      // Handle automatic token refresh
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      // Handle session expired
      if (event === 'SIGNED_OUT' && session === null) {
        console.log('Session expired or user signed out');
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = async () => {
    try {
      const supabase = getSupabaseFrontendClient();
      await supabase.auth.signOut();
      setProfile(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseFrontendClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: new Error(error.message), profile: null };
      }
      const profileData = await fetchProfile();
      return { error: null, profile: profileData };
    } catch (error) {
      return { error: error as Error, profile: null };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseFrontendClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return {
        error: error ? new Error(error.message) : null,
        user: data.user ?? null,
        profile: data.session ? await fetchProfile() : null,
      };
    } catch (error) {
      return { error: error as Error, user: null, profile: null };
    }
  };

  const refreshSession = async () => {
    try {
      const supabase = getSupabaseFrontendClient();
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      setSession(newSession);
      setUser(newSession?.user ?? null);
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    signOut,
    signIn,
    signUp,
    refreshSession,
    refreshProfile: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

