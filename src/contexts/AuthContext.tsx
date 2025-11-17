import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: {
    full_name: string;
    role: 'student' | 'practitioner' | 'admin';
    sport?: string;
    specialization?: string;
    student_number?: string;
    phone?: string;
  }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      
      // Select specific columns instead of * to avoid serialization issues
      const { data, error, status, count } = await supabase
        .from('users')
        .select('id, full_name, email, role, profile_pic_url, sport, specialization, phone, student_number, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();

      console.log('📊 Profile fetch response:', { 
        data, 
        error, 
        status, 
        count,
        hasData: !!data 
      });

      if (error) {
        console.error('❌ Profile fetch error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      if (data) {
        console.log('✅ Profile data received:', data);
        setProfile(data);
      } else {
        console.log('⚠️ No profile data found for user:', userId);
        setProfile(null);
      }
    } catch (error) {
      console.error('💥 Error fetching profile:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log('🔄 Initializing auth...');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('👤 User found, fetching profile...');
        fetchProfile(session.user.id);
      } else {
        console.log('👤 No user in session');
        setProfile(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('👤 User authenticated, fetching profile...');
        fetchProfile(session.user.id);
      } else {
        console.log('👤 User signed out');
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('📋 Sign in response:', { data, error });
      return { error };
    } catch (error) {
      console.error('💥 Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      full_name: string;
      role: 'student' | 'practitioner' | 'admin';
      sport?: string;
      specialization?: string;
      student_number?: string;
      phone?: string;
    }
  ) => {
    try {
      console.log('📝 Starting sign up process for:', email, userData);
      
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('📋 Auth signup response:', { authData, authError });

      if (authError) {
        console.error('❌ Auth signup error:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error('❌ No user returned from signup');
        throw new Error('No user returned from signup');
      }

      console.log('✅ Auth user created:', authData.user.id);

      // 2. Create user profile in public.users table
      const profileData = {
        id: authData.user.id,
        email,
        full_name: userData.full_name,
        role: userData.role,
        sport: userData.sport || null,
        specialization: userData.specialization || null,
        student_number: userData.student_number || null,
        phone: userData.phone || null,
      };

      console.log('📝 Creating user profile:', profileData);

      const { data: profileResult, error: profileError } = await supabase
        .from('users')
        .insert(profileData)
        .select()
        .single();

      console.log('📋 Profile creation response:', { profileResult, profileError });

      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        
        // If profile creation fails, delete the auth user to clean up
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      console.log('✅ User registration completed successfully');
      return { error: null };
    } catch (error) {
      console.error('💥 Sign up error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('💥 Sign out error:', error);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
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