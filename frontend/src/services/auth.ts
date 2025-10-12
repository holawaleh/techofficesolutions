// src/services/auth.ts
import type { LoginData, SignupData, AuthResponse } from "../types/auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Generic fetch helper
async function request<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Request failed: ${res.status} ${errorText}`);
  }

  return res.json();
}

// 🔹 Login user
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  return request<AuthResponse>("/api/users/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔹 Signup user (creates superuser/staff in your backend logic)
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  return request<AuthResponse>("/api/users/signup/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔹 Refresh token (optional — for silent re-auth)
export async function refreshToken(refresh: string): Promise<{ access: string }> {
  return request<{ access: string }>("/api/users/token/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
}
