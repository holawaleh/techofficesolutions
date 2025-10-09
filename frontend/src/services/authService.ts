import type { LoginPayload, SignupPayload, AuthResponse, User } from '../types/auth';

const API_BASE_URL = 'https://techofficesolutions.onrender.com/api/users';

export class AuthService {
  private static getStoredTokens() {
    return {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token')
    };
  }

  private static setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  private static clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  static async signup(payload: SignupPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const data = await response.json();

    if (data.access && data.refresh) {
      this.setTokens(data.access, data.refresh);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }

    return data;
  }

  static async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    this.setTokens(data.access, data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  static logout() {
    this.clearTokens();
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!(tokens.access && tokens.refresh);
  }

  static getAccessToken(): string | null {
    return this.getStoredTokens().access;
  }

  static async refreshToken(): Promise<string> {
    const { refresh } = this.getStoredTokens();

    if (!refresh) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.setTokens(data.access, refresh);

    return data.access;
  }
}
