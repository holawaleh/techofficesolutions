import type { LoginPayload, SignupPayload, AuthResponse, User } from '../types/auth';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://techofficesolutions.onrender.com';

export const AuthService = {
  /**
   * 🔐 Login user
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${BACKEND_URL}/api/users/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    // ✅ Persist tokens and user in localStorage
    localStorage.setItem('t_office_access', data.access);
    localStorage.setItem('t_office_refresh', data.refresh);
    localStorage.setItem('t_office_user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('t_office_auth_changed'));

    return data as AuthResponse;
  },

  /**
   * 🧾 Signup new user
   */
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const response = await fetch(`${BACKEND_URL}/api/users/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.message ||
          JSON.stringify(data) ||
          'Signup failed'
      );
    }

    // ✅ Auto-login after successful signup
    try {
      const loginRes = await fetch(`${BACKEND_URL}/api/users/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: payload.username,
          password: payload.password,
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.detail || 'Auto-login failed');
      }

      localStorage.setItem('t_office_access', loginData.access);
      localStorage.setItem('t_office_refresh', loginData.refresh);
      localStorage.setItem('t_office_user', JSON.stringify(loginData.user));
      window.dispatchEvent(new Event('t_office_auth_changed'));

      return loginData as AuthResponse;
    } catch (err) {
      console.error('Signup succeeded but auto-login failed:', err);
      return data as AuthResponse;
    }
  },

  /**
   * 🚪 Logout and clear session
   */
  logout() {
    localStorage.removeItem('t_office_access');
    localStorage.removeItem('t_office_refresh');
    localStorage.removeItem('t_office_user');
    window.dispatchEvent(new Event('t_office_auth_changed'));
  },

  /**
   * ♻️ Retrieve currently logged-in user (from localStorage)
   */
  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem('t_office_user');
      if (!userJson) return null;
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  },

  /**
   * 🔁 Refresh access token (optional helper)
   */
  async refreshAccessToken(): Promise<string | null> {
    const refresh = localStorage.getItem('t_office_refresh');
    if (!refresh) return null;

    const response = await fetch(`${BACKEND_URL}/api/users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    const data = await response.json();
    if (!response.ok || !data.access) {
      this.logout();
      return null;
    }

    localStorage.setItem('t_office_access', data.access);
    return data.access;
  },
};
