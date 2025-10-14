import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const backend = import.meta.env.VITE_BACKEND_URL;

  // ---- SIGNUP ----
  const signup = async (formData: any) => {
    try {
      const res = await axios.post(`${backend}/api/users/signup/`, formData);
      if (res.status === 201) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Signup failed — check your info and try again.");
    }
  };

  // ---- LOGIN ----
  const login = async (credentials: any) => {
    try {
      const res = await axios.post(`${backend}/api/token/`, credentials);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Invalid credentials.");
    }
  };

  // ---- LOGOUT ----
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // ---- AUTO LOGIN ----
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
