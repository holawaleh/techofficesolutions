import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Shield,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { StaffMember } from '../types/auth';

interface StaffManagementProps {
  onBack: () => void;
}

export default function StaffManagement({ onBack }: StaffManagementProps) {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    can_edit: false,
    can_delete: false,
    special_privileges: [] as string[],
  });

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    setIsLoading(true);
    try {
      const mockStaff: StaffMember[] = [];
      setStaffMembers(mockStaff);
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newStaff: StaffMember = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        can_edit: formData.can_edit,
        can_delete: formData.can_delete,
        special_privileges: formData.special_privileges,
        created_at: new Date().toISOString(),
      };

      setStaffMembers([...staffMembers, newStaff]);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    setIsLoading(true);
    try {
      const updatedStaff = staffMembers.map((staff) =>
        staff.id === editingStaff.id
          ? {
              ...staff,
              can_edit: formData.can_edit,
              can_delete: formData.can_delete,
              special_privileges: formData.special_privileges,
            }
          : staff
      );

      setStaffMembers(updatedStaff);
      setEditingStaff(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId: number) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;

    setIsLoading(true);
    try {
      setStaffMembers(staffMembers.filter((staff) => staff.id !== staffId));
    } catch (error) {
      console.error('Failed to delete staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      username: staff.username,
      email: staff.email,
      password: '',
      can_edit: staff.can_edit,
      can_delete: staff.can_delete,
      special_privileges: staff.special_privileges,
    });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      can_edit: false,
      can_delete: false,
      special_privileges: [],
    });
    setShowAddForm(false);
    setEditingStaff(null);
  };

  const togglePrivilege = (privilege: string) => {
    setFormData((prev) => ({
      ...prev,
      special_privileges: prev.special_privileges.includes(privilege)
        ? prev.special_privileges.filter((p) => p !== privilege)
        : [...prev.special_privileges, privilege],
    }));
  };

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PRIVILEGE_OPTIONS = [
    'Manage Reports',
    'View Analytics',
    'Export Data',
    'Manage Settings',
    'Access All Sections',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-slate-900">Superuser</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Staff Management</h1>
          <p className="text-slate-600">
            Add, edit, and manage staff members and their permissions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap"
            >
              <UserPlus className="w-5 h-5" />
              Add Staff
            </button>
          </div>
        </div>

        {(showAddForm || editingStaff) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff}>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingStaff}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-slate-100"
                    placeholder="staff.username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingStaff}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-slate-100"
                    placeholder="staff@company.com"
                  />
                </div>

                {!editingStaff && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="Create a password"
                    />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Basic Permissions
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.can_edit}
                      onChange={(e) => setFormData({ ...formData, can_edit: e.target.checked })}
                      className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-medium text-slate-900">Can Edit</div>
                      <div className="text-sm text-slate-600">
                        Allow staff to edit existing records
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.can_delete}
                      onChange={(e) =>
                        setFormData({ ...formData, can_delete: e.target.checked })
                      }
                      className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-medium text-slate-900">Can Delete</div>
                      <div className="text-sm text-slate-600">
                        Allow staff to remove records permanently
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Special Privileges
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {PRIVILEGE_OPTIONS.map((privilege) => (
                    <label
                      key={privilege}
                      className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.special_privileges.includes(privilege)}
                        onChange={() => togglePrivilege(privilege)}
                        className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700">{privilege}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editingStaff ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {editingStaff ? 'Update Staff' : 'Add Staff'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading && !showAddForm && !editingStaff ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
              <p className="text-slate-600">Loading staff members...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-12 text-center">
              <UserPlus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Staff Members</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery
                  ? 'No staff members match your search'
                  : 'Get started by adding your first staff member'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all inline-flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Add First Staff Member
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Staff Member
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Permissions
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Special Privileges
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-slate-900">{staff.username}</div>
                          <div className="text-sm text-slate-600">{staff.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {staff.can_edit && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Can Edit
                            </span>
                          )}
                          {staff.can_delete && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                              Can Delete
                            </span>
                          )}
                          {!staff.can_edit && !staff.can_delete && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                              View Only
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {staff.special_privileges.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {staff.special_privileges.slice(0, 2).map((privilege) => (
                              <span
                                key={privilege}
                                className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded"
                              >
                                {privilege}
                              </span>
                            ))}
                            {staff.special_privileges.length > 2 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                                +{staff.special_privileges.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(staff)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
