import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function StaffManagement() {
  const { profile } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', company_name: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const access = localStorage.getItem('t_office_access');
      const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || '';
      if (!BACKEND_URL) throw new Error('No backend configured');

      const res = await fetch(`${BACKEND_URL}/api/users/staff/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: access ? `Bearer ${access}` : '' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Create staff failed');
      setMessage('Staff created successfully');
      setForm({ username: '', email: '', password: '', company_name: '' });
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile?.is_superuser) {
    return <div className="p-6 bg-white rounded-lg">You do not have permission to access this page.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Staff Management</h2>
      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}
      <form onSubmit={handleCreate} className="space-y-4">
        <input name="username" placeholder="username" value={form.username} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="email" placeholder="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="password" placeholder="password" type="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="company_name" placeholder="company name" value={form.company_name} onChange={handleChange} className="w-full p-2 border rounded" />
        <button disabled={loading} className="px-4 py-2 bg-green-700 text-white rounded">{loading ? 'Creating...' : 'Create Staff'}</button>
      </form>
    </div>
  );
}
