import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../services/auth";
import type { LoginData, SignupData } from "../types/auth";

interface User {
  id: number;
  username: string;
  email: string;
  company_name: string;
  address: string;
  phone_number: string;
  purpose_of_use: string[];
  is_superuser: boolean;
  is_staff: boolean;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Restore from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("access");
    if (storedUser && storedAccess) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccess);
    }
  }, []);

  // 🔹 LOGIN
  const login = async (data: LoginData) => {
    const res = await loginUser(data);
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
    localStorage.setItem("user", JSON.stringify(res.user));
    setAccessToken(res.access);
    setUser(res.user);
  };

  // 🔹 SIGNUP
  const signup = async (data: SignupData) => {
    const res = await signupUser(data);
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
    localStorage.setItem("user", JSON.stringify(res.user));
    setAccessToken(res.access);
    setUser(res.user);
  };

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
