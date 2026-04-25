import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  sparkles: number;
  currency: string;
  equipped_item: string | null;
}

interface UserPreferences {
  adhd_type: string;
  focus_duration: number;
  break_duration: number;
  notification_preferences: {
    reminders: boolean;
    motivation: boolean;
    wellbeing: boolean;
    achievements: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  theme: string;
  language: string;
  timezone: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const fetchPreferences = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      setPreferences({
        adhd_type: data.adhd_type,
        focus_duration: data.focus_duration,
        break_duration: data.break_duration,
        notification_preferences: data.notification_preferences as UserPreferences['notification_preferences'],
        quiet_hours: data.quiet_hours as UserPreferences['quiet_hours'],
        theme: data.theme,
        language: data.language,
        timezone: data.timezone,
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
            fetchPreferences(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setPreferences(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
        fetchPreferences(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setPreferences(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      await fetchProfile(user.id);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      await fetchPreferences(user.id);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
      await fetchPreferences(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        preferences,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updatePreferences,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
