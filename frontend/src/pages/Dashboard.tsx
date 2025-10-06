import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Profile, Company } from '../lib/supabase';
import { LogOut, UserPlus, Users, Building2, Activity, BarChart2, Box, Settings, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff',
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ username: '', email: '', telephone: '' });

  useEffect(() => {
    if (profile) {
      setSettingsForm({ username: profile.username || '', email: profile.email || '', telephone: profile.telephone || '' });
    }
  }, [profile]);

  

  const openSettings = () => {
    setDropdownOpen(false);
    setSettingsOpen(true);
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update localStorage-stored user for backend mode
    try {
      const userJson = localStorage.getItem('t_office_user');
      const stored = userJson ? JSON.parse(userJson) : null;
      if (stored) {
        const updated = { ...stored, username: settingsForm.username, email: settingsForm.email, telephone: settingsForm.telephone };
        localStorage.setItem('t_office_user', JSON.stringify(updated));
        // notify app
        window.dispatchEvent(new Event('t_office_auth_changed'));
      }
      setSettingsOpen(false);
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  useEffect(() => {
    if (profile?.company_id) {
      fetchCompany();
      fetchTeamMembers();
    }
  }, [profile]);

  const fetchCompany = async () => {
    if (!profile?.company_id) return;

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', profile.company_id)
      .maybeSingle();

    if (!error && data) {
      setCompany(data);
    }
  };

  const fetchTeamMembers = async () => {
    if (!profile?.company_id) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('company_id', profile.company_id);

    if (!error && data) {
      setTeamMembers(data);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'https://techofficesolutions.onrender.com';

      if (BACKEND_URL) {
        const access = localStorage.getItem('t_office_access');
        if (!access) throw new Error('Not authorized. Please sign in again.');

        const payload = {
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role || 'staff',
          company_name: company?.name || profile?.company_name || '',
          address: company?.address || profile?.address || '',
          phone_number: profile?.telephone || profile?.phone_number || '',
        };

        const res = await fetch(`${BACKEND_URL}/api/users/staff/create/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.detail || data.error || 'Failed to create staff');

        // append to team members so UI updates immediately
        const created = {
          id: data.id || data.user?.id || Date.now().toString(),
          username: data.username || data.user?.username || newUser.username,
          email: data.email || data.user?.email || newUser.email,
          is_admin: false,
          is_staff: true,
          role: data.role || newUser.role || 'staff',
        } as Profile;

        setTeamMembers((prev) => [...prev, created]);
        setSuccess('User added successfully!');
  setNewUser({ username: '', email: '', password: '', role: 'staff' });
        setShowAddUser(false);
        setLoading(false);
        return;
      }

      // fallback: local stub
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('User creation failed');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: newUser.username,
          email: newUser.email,
          company_id: profile?.company_id,
          is_admin: false,
        });

      if (profileError) throw profileError;

      setSuccess('User added successfully!');
  setNewUser({ username: '', email: '', password: '', role: 'staff' });
      setShowAddUser(false);
      fetchTeamMembers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id: string) => {
    setError('');
    try {
      const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'https://techofficesolutions.onrender.com';
      if (!BACKEND_URL) {
        // local stub deletion
        const profiles = (localStorage.getItem('t_office_profiles') ? JSON.parse(localStorage.getItem('t_office_profiles')!) : []) as any[];
        const remaining = profiles.filter((p) => p.id !== id);
        localStorage.setItem('t_office_profiles', JSON.stringify(remaining));
        setTeamMembers(remaining);
        return;
      }

      const access = localStorage.getItem('t_office_access');
      if (!access) throw new Error('Not authorized');

      const res = await fetch(`${BACKEND_URL}/api/users/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${access}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to delete user');
      }

      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/bisflowpro.png" alt="BisFlowPro" className="h-12" />
              <span className="text-lg font-semibold text-gray-800">BisFlowPro</span>
            </div>
            <div className="relative inline-block text-left">
              <button onClick={() => setDropdownOpen((v) => !v)} className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-800">
                  {profile?.username ? profile.username.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs text-gray-500">Signed in as</div>
                  <div className="text-sm font-medium text-gray-800">{profile?.username}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button onClick={openSettings} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-lg font-semibold text-green-800">
                  {profile?.username ? profile.username.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900">Welcome back, {profile?.username}!</h1>
                  <p className="mt-2 text-gray-600">Here's a quick overview of your company and team.</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Company</div>
              <div className="font-semibold text-lg text-gray-800">{profile?.company_id ? 'Your Company' : '—'}</div>
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border border-green-50 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-md">
              <BarChart2 className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Team Members</div>
              <div className="text-lg font-semibold text-gray-900">{teamMembers.length}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-green-50 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-md">
              <Box className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Company</div>
              <div className="text-lg font-semibold text-gray-900">{company ? company.name : '—'}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-green-50 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-md">
              <Activity className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Realtime</div>
              <div className="text-lg font-semibold text-gray-900">Connected</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8 border border-green-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
                    <p className="text-sm text-gray-500">Overview of your organization</p>
                  </div>
                </div>
                {company ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Company Name</span>
                      <p className="text-gray-900 text-lg font-semibold">{company.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Address</span>
                      <p className="text-gray-900">{company.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Purpose of Use</span>
                      <p className="text-gray-900">
                        {Array.isArray(company.purpose_of_use)
                          ? company.purpose_of_use.map((p) => p.replace(/_/g, ' ')).join(', ')
                          : String(company.purpose_of_use).replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">No company information available.</div>
                )}
            </section>

            <aside className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                    <p className="text-sm text-gray-500">Manage your people</p>
                  </div>
                </div>
                {profile?.is_admin && (
                  <button
                    onClick={() => setShowAddUser(!showAddUser)}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm">Add</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {teamMembers.length === 0 && (
                  <div className="text-sm text-gray-500">No team members yet.</div>
                )}
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{member.username}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.is_admin && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Admin
                        </span>
                      )}
                      <button onClick={() => deleteStaff(member.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
          {showAddUser && profile?.is_admin && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New User</h3>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="newUsername"
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="Enter username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="newEmail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password (min. 6 characters)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                  <div>
                    <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select id="newRole" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUser(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Settings modal */}
          {settingsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Profile Settings</h3>
                  <button onClick={() => setSettingsOpen(false)} className="text-gray-500">✕</button>
                </div>
                <form onSubmit={saveSettings} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Username</label>
                    <input value={settingsForm.username} onChange={(e) => setSettingsForm({ ...settingsForm, username: e.target.value })} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Telephone</label>
                    <input value={settingsForm.telephone} onChange={(e) => setSettingsForm({ ...settingsForm, telephone: e.target.value })} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setSettingsOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
  );
}
