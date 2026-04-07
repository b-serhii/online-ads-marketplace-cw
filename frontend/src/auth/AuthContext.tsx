// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { me as apiMe, login as apiLogin } from "../services/auth"; // або як у тебе названо

export type User = {
  id: number;
  name: string;
  email: string;
  is_email_verified: boolean;
  is_admin: boolean;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  doLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    try {
      const u = await apiMe(); // має повернути юзера
      setUser(u);
    } catch {
      setUser(null);
    }
  }

  async function doLogin(email: string, password: string) {
    // твій бек повертає токен -> збережи в localStorage
    const res = await apiLogin({ email, password });

    localStorage.setItem("token", res.access_token);
    await refreshMe();
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  useEffect(() => {
    (async () => {
      await refreshMe();
      setLoading(false);
    })();
  }, []);

  const value = useMemo<AuthState>(() => {
    const isAuthenticated = !!user;
    const isAdmin = !!user?.is_admin;
    return { user, isAuthenticated, isAdmin, loading, doLogin, logout, refreshMe };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
