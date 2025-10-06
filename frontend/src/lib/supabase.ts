// LocalStorage-backed minimal supabase-like stub for frontend development.
// This allows the frontend to run without a Supabase project while you
// build a Django/DRF backend. Data is persisted in localStorage under
// keys: t_office_auth_users, t_office_companies, t_office_profiles, t_office_session

export interface Company {
  id: string;
  name: string;
  address: string;
  purpose_of_use: string | string[];
  created_at?: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  telephone?: string;
  phone_number?: string;
  address?: string;
  company_name?: string;
  company_id?: string;
  is_admin?: boolean;
  is_superuser?: boolean;
  is_staff?: boolean;
  role?: string;
  created_at?: string;
}

function readKey<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) as T : null;
}

function writeKey<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// simple in-memory listeners for auth state changes
const authListeners: Array<(event: string, session: any) => void> = [];

function emitAuth(event: string, session: any) {
  authListeners.forEach((cb) => cb(event, session));
}

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'https://techofficesolutions.onrender.com';

async function postToBackend(path: string, body: any, token?: string) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export const supabase: any = {
  auth: {
    // sign in with email or username (landing allows username or email)
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      // If a backend URL is configured, call the Django login endpoint to obtain JWTs
      if (BACKEND_URL) {
        const { status, data } = await postToBackend('/api/users/login/', { username: email, password });
        if (status >= 400) {
          return { error: new Error(data.detail || 'Invalid credentials') };
        }
        // store tokens and user
        localStorage.setItem('t_office_access', data.access);
        localStorage.setItem('t_office_refresh', data.refresh);
        localStorage.setItem('t_office_user', JSON.stringify(data.user));
        const session = { token: data.access, user: data.user };
        writeKey('t_office_session', session);
  emitAuth('SIGNED_IN', session);
  // notify the rest of the app
  window.dispatchEvent(new Event('t_office_auth_changed'));
        return { error: null };
      }

      // fallback: localStorage-backed auth
      const profiles = readKey<Profile[]>('t_office_profiles') || [];
      const authUsers = readKey<Array<{ id: string; email: string; password: string }>>('t_office_auth_users') || [];

      const ident = email;
      let profile = profiles.find((p) => p.username === ident || p.email === ident);
      let authUser = null;
      if (profile) {
        authUser = authUsers.find((a) => a.email === profile!.email);
      } else {
        authUser = authUsers.find((a) => a.email === ident);
      }

      if (!authUser || authUser.password !== password) {
        return { error: new Error('Invalid credentials') };
      }

      // set session
      const session = { user: { id: authUser.id } };
      writeKey('t_office_session', session);
      emitAuth('SIGNED_IN', session);
      return { error: null };
    },

    async signUp({ email, password }: { email: string; password: string }) {
        // If a backend URL is provided, call the Django signup endpoint, then login to retrieve tokens
        if (BACKEND_URL) {
          const signupRes = await postToBackend('/api/users/signup/', { email, password });
          if (signupRes.status >= 400) return { data: { user: null }, error: new Error(signupRes.data.detail || 'Signup failed') };
          // After signup, attempt login to get tokens and user
          const loginRes = await postToBackend('/api/users/login/', { username: email, password });
          if (loginRes.status >= 400) return { data: { user: null }, error: new Error(loginRes.data.detail || 'Login after signup failed') };
          const data = loginRes.data;
          // store tokens and user
          localStorage.setItem('t_office_access', data.access);
          localStorage.setItem('t_office_refresh', data.refresh);
          localStorage.setItem('t_office_user', JSON.stringify(data.user));
          const session = { token: data.access, user: data.user };
          writeKey('t_office_session', session);
            emitAuth('SIGNED_UP', session);
            // notify the rest of the app
            window.dispatchEvent(new Event('t_office_auth_changed'));
          return { data: { user: data.user }, error: null };
        }

      const authUsers = readKey<Array<{ id: string; email: string; password: string }>>('t_office_auth_users') || [];
      const exists = authUsers.find((a) => a.email === email);
      if (exists) {
        return { data: { user: null }, error: new Error('Email already registered') };
      }
      const id = Date.now().toString();
      const user = { id, email };
      authUsers.push({ id, email, password });
      writeKey('t_office_auth_users', authUsers);
      const session = { user: { id } };
      writeKey('t_office_session', session);
      emitAuth('SIGNED_UP', session);
      return { data: { user }, error: null };
    },

    async signOut() {
      localStorage.removeItem('t_office_session');
      // also remove backend token
      localStorage.removeItem('t_office_token');
      emitAuth('SIGNED_OUT', null);
      return { error: null };
    },

    async getSession() {
      const session = readKey<any>('t_office_session');
      return { data: { session: session || null } };
    },

    onAuthStateChange(cb: (event: string, session: any) => void) {
      authListeners.push(cb);
      const session = readKey<any>('t_office_session') || (() => {
        const token = localStorage.getItem('t_office_token');
        if (token) return { token, user: null };
        return null;
      })();
      // call immediately with current session
      setTimeout(() => cb('INITIAL', session || null), 0);
      return { data: { subscription: { unsubscribe() { const idx = authListeners.indexOf(cb); if (idx !== -1) authListeners.splice(idx, 1); } } } };
    },
  },

  from(table: string) {
    const key = table === 'profiles' ? 't_office_profiles' : table === 'companies' ? 't_office_companies' : table;

    return {
      async insert(payload: any) {
        const arr = readKey<any[]>(key) || [];
        const now = new Date().toISOString();
        let record: any;
        if (Array.isArray(payload)) {
          record = payload.map((p) => ({ id: (Date.now() + Math.random()).toString(), ...p, created_at: now }));
          arr.push(...record);
        } else {
          record = { id: (Date.now()).toString(), ...payload, created_at: now };
          arr.push(record);
        }
        writeKey(key, arr);

        return {
          select: () => ({
            single: async () => ({ data: Array.isArray(record) ? record[0] : record, error: null }),
          }),
        };
      },

      select(_: string = '*') {
        const arr = readKey<any[]>(key) || [];
        return {
          eq(field: string, value: any) {
            const results = arr.filter((r) => r[field] === value);
            const thenable: any = {
              maybeSingle: async () => ({ data: results[0] ?? null, error: null }),
            };
            thenable.then = (resolve: any) => resolve({ data: results, error: null });
            return thenable;
          },
          maybeSingle: async () => ({ data: arr[0] ?? null, error: null }),
        };
      },
    };
  },
};

// supabase stub exported above

