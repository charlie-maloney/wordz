'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userAuthenticated: boolean;
  setUserAuthenticated: (authenticated: boolean) => void;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    // TODO: Replace with actual session checking logic
    console.log('Checking authentication status...');
    setUserAuthenticated(false);
  }, []);

  const signIn = async (email: string): Promise<void> => {
    try {
      // TODO: Replace with actual sign-in logic (Supabase, etc.)
      console.log('Signing in with email:', email);

      // Simulate sign-in success
      setUserAuthenticated(true);
      console.log('User successfully signed in');
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  };

  const signOut = () => {
    // TODO: Replace with actual sign-out logic
    console.log('Signing out user');
    setUserAuthenticated(false);
  };

  const value = {
    userAuthenticated,
    setUserAuthenticated,
    signIn,
    signOut,
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
