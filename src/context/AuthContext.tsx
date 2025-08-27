"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signOut } from "../lib/auth";

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndProfile() {
      setLoading(true);
      const userResult = await getCurrentUser();
      if (userResult && userResult.data && userResult.data.user) {
        setUser(userResult.data.user);
        // Fetch profile
        const { getUserProfile } = await import('../lib/profile');
        const { profile: prof } = await getUserProfile(userResult.data.user.id);
        setProfile(prof || null);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    }
    fetchUserAndProfile();
    // Listen to auth changes
    const supabase = (window as any).supabase;
    const listener = supabase?.auth?.onAuthStateChange?.(async (_event: any, session: any) => {
      if (session?.user) {
        setUser(session.user);
        const { getUserProfile } = await import('../lib/profile');
        const { profile: prof } = await getUserProfile(session.user.id);
        setProfile(prof || null);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => {
      listener?.unsubscribe?.();
    };
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, setUser, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
