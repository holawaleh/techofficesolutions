// src/types/auth.ts

// 🔹 Login payload type
export interface LoginData {
  username: string;
  password: string;
}

// 🔹 Signup payload type
export interface SignupData {
  username: string;
  email: string;
  password: string;
  company_name: string;
  address: string;
  phone_number: string;
  purpose_of_use?: string[];
}

// 🔹 The User object returned from backend
export interface User {
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

// 🔹 What the backend returns on successful login/signup
export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}
