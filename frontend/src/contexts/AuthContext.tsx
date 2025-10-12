import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, refreshToken } from "../types/auth";

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

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("access");
    if (storedUser && storedAccess) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccess);
    }
  }, []);

  const login = async ({ username, password }: { username: string; password: string }) => {
    const data = await loginUser({ username, password });

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    setAccessToken(data.access);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
