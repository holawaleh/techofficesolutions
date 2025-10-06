import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Profile } from '../lib/supabase';

  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'https://techofficesolutions.onrender.com';

interface User {
  id: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    if (BACKEND_URL) {
      // For the JWT backend we store the user object at signup/login in localStorage
      const userJson = localStorage.getItem('t_office_user');
      const stored = userJson ? JSON.parse(userJson) : null;
      if (stored && String(stored.id) === String(userId)) {
        setProfile(stored as Profile);
      } else {
        setProfile(null);
      }
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    if (BACKEND_URL) {
      // Read tokens and user info from localStorage
      const userJson = localStorage.getItem('t_office_user');
      const storedUser = userJson ? JSON.parse(userJson) : null;
      setUser(storedUser ? { id: storedUser.id } : null);
      if (storedUser?.id) {
        fetchProfile(storedUser.id);
      }
      // listen for auth changes (login/signup/logout) triggered elsewhere in the app
      const handler = () => {
        const userJson = localStorage.getItem('t_office_user');
        const stored = userJson ? JSON.parse(userJson) : null;
        setUser(stored ? { id: stored.id } : null);
        if (stored?.id) fetchProfile(stored.id);
        else setProfile(null);
      };

      window.addEventListener('t_office_auth_changed', handler as EventListener);
      setLoading(false);
      return () => window.removeEventListener('t_office_auth_changed', handler as EventListener);
    }

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_: any, session: any) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (BACKEND_URL) {
      // clear JWT tokens and user
      localStorage.removeItem('t_office_access');
      localStorage.removeItem('t_office_refresh');
      localStorage.removeItem('t_office_user');
      setUser(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
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
