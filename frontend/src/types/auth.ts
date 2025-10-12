const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://techofficesolutions.onrender.com";

export async function loginUser(credentials: { username: string; password: string }) {
  const response = await fetch(`${BASE_URL}/api/users/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Login failed. Check credentials.");
  }

  return response.json();
}

export async function signupUser(data: Record<string, any>) {
  const response = await fetch(`${BASE_URL}/api/users/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(JSON.stringify(err));
  }

  return response.json();
}

export async function refreshToken(refresh: string) {
  const response = await fetch(`${BASE_URL}/api/users/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) throw new Error("Token refresh failed");
  return response.json();
}
