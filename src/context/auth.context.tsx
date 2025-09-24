'use client';
import { useState, useEffect, useContext, createContext } from 'react';
import { createClient } from '../integrations/supabase/browser';
import { User } from '@supabase/supabase-js';

// Define the shape of the AuthContext
interface AuthContextType {
  isActiveSession: () => boolean;
  getUser: () => User | null;
  isAnon: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const isActiveSession = () => !!user;
  const getUser = () => user;
  const isAnon = () => !user;

  return (
    <AuthContext.Provider value={{ isActiveSession, getUser, isAnon }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
