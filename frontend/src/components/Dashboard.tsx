import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2,
  LogOut,
  Users,
  Hotel,
  ShoppingBag,
  Plane,
  Heart,
  Sprout,
  FolderOpen,
  Settings,
  Menu,
  X
} from 'lucide-react';
import StaffManagement from './StaffManagement';

const AREA_CONFIG = {
  hospitality: { icon: Hotel, color: 'emerald', label: 'Hospitality' },
  commerce: { icon: ShoppingBag, color: 'blue', label: 'Commerce' },
  tourism: { icon: Plane, color: 'cyan', label: 'Tourism' },
  health: { icon: Heart, color: 'red', label: 'Health' },
  agriculture: { icon: Sprout, color: 'green', label: 'Agriculture' },
  others: { icon: FolderOpen, color: 'slate', label: 'Others' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showStaffManagement, setShowStaffManagement] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const userAreas = user.areas_of_interest || [];

  const handleLogout = () => {
    logout();
  };

  if (showStaffManagement) {
    return <StaffManagement onBack={() => setShowStaffManagement(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-emerald-500" />
              <div>
                <div className="font-bold text-slate-900">{user.company_name}</div>
                <div className="text-xs text-slate-500">{user.username}</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowStaffManagement(true)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Staff Management</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4 space-y-2">
              <button
                onClick={() => {
                  setShowStaffManagement(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Staff Management</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.username}
          </h1>
          <p className="text-slate-600">
            Manage your business operations across your selected industries
          </p>
        </div>

        {userAreas.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Areas of Interest Selected
            </h3>
            <p className="text-slate-600">
              Please contact support to update your areas of interest
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAreas.map((areaId) => {
              const config = AREA_CONFIG[areaId as keyof typeof AREA_CONFIG];
              if (!config) return null;

              const Icon = config.icon;
              const isActive = activeSection === areaId;

              return (
                <button
                  key={areaId}
                  onClick={() => setActiveSection(isActive ? null : areaId)}
                  className={`bg-white rounded-xl p-6 border-2 transition-all text-left hover:shadow-lg ${
                    isActive
                      ? `border-${config.color}-500 shadow-md`
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-${config.color}-500/10 flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 text-${config.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{config.label}</h3>
                  <p className="text-slate-600 text-sm">
                    Manage your {config.label.toLowerCase()} operations and data
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Quick Actions</span>
                      <span className={`text-${config.color}-600 font-semibold`}>
                        {isActive ? 'Hide' : 'View'} →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeSection && (
          <div className="mt-8 bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const config = AREA_CONFIG[activeSection as keyof typeof AREA_CONFIG];
                const Icon = config.icon;
                return (
                  <>
                    <div
                      className={`w-10 h-10 rounded-lg bg-${config.color}-500/10 flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 text-${config.color}-600`} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{config.label} Dashboard</h2>
                  </>
                );
              })()}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-slate-600 text-sm">Total Records</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-slate-600 text-sm">Active Items</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-slate-600 text-sm">Pending Tasks</div>
              </div>
            </div>

            <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-600 text-center">
                Your {AREA_CONFIG[activeSection as keyof typeof AREA_CONFIG].label.toLowerCase()} data will appear here.
                Start by adding your first entry.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
