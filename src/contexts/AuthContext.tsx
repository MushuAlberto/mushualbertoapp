import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  user: any | null;
  session: any | null;
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

const GUEST_USER = {
  id: 'guest-user',
  email: 'invitado@mushu.app',
  user_metadata: {
    full_name: 'Invitado',
  }
};

const DEFAULT_PROFILE: Profile = {
  id: 'guest-user',
  username: 'invitado',
  full_name: 'Invitado',
  avatar_url: null,
  sparkles: 100,
  currency: 'Sparkles',
  equipped_item: null,
};

const DEFAULT_PREFERENCES: UserPreferences = {
  adhd_type: 'combined',
  focus_duration: 25,
  break_duration: 5,
  notification_preferences: {
    reminders: true,
    motivation: true,
    wellbeing: true,
    achievements: true,
  },
  quiet_hours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  theme: 'system',
  language: 'es',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use LocalStorage to persist profile/preferences since we are removing Supabase Auth
  const [profile, setProfile] = useLocalStorage<Profile>('mushu_profile', DEFAULT_PROFILE);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('mushu_preferences', DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(false);

  // Mocked user and session
  const user = GUEST_USER;
  const session = { user: GUEST_USER, access_token: 'guest' };

  const signIn = async () => ({ error: null });
  const signUp = async () => ({ error: null });
  const signOut = async () => {
    // Reset guest data if they "sign out"
    setProfile(DEFAULT_PROFILE);
    setPreferences(DEFAULT_PREFERENCES);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const refreshProfile = async () => {
    // Already in sync with localStorage
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
