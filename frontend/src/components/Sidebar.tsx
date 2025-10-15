import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../api";
import {
  LayoutDashboard,
  ShoppingBag,
  Building2,
  HeartPulse,
  Leaf,
  Plane,
  Wrench,
  Settings,
  Users,
  DollarSign,
  FileBarChart,
} from "lucide-react";

const ICONS: Record<string, JSX.Element> = {
  hospitality: <Building2 className="w-5 h-5" />,
  commerce: <ShoppingBag className="w-5 h-5" />,
  pharmacy: <HeartPulse className="w-5 h-5" />,
  agriculture: <Leaf className="w-5 h-5" />,
  tourism: <Plane className="w-5 h-5" />,
  technical_services: <Wrench className="w-5 h-5" />,
};

export default function Sidebar() {
  const [org, setOrg] = useState<{ name: string; preference: string[] }>({
    name: "",
    preference: [],
  });

  useEffect(() => {
    const fetchOrgProfile = async () => {
      try {
        const res = await api.get("/api/organizations/profile/");
        setOrg(res.data);
      } catch (err) {
        console.error("Failed to load organization profile:", err);
      }
    };
    fetchOrgProfile();
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 h-screen p-6 flex flex-col justify-between border-r border-slate-700">
      <div>
        <h1 className="text-xl font-bold text-emerald-400 mb-8">
          {org.name || "Enterprise Hub"}
        </h1>

        <nav className="space-y-3">
          <SidebarLink to="/dashboard" label="Dashboard" icon={<LayoutDashboard />} />
          <SidebarLink to="/dashboard/sales" label="Sales" icon={<DollarSign />} />
          <SidebarLink to="/dashboard/reports" label="Reports" icon={<FileBarChart />} />
          <SidebarLink to="/dashboard/users" label="Users" icon={<Users />} />

          {/* Dynamically render industry modules */}
          {org.preference.length > 0 && (
            <>
              <div className="mt-6 text-xs uppercase tracking-wide text-slate-500">
                Industries
              </div>
              {org.preference.map((pref) => (
                <SidebarLink
                  key={pref}
                  to={`/dashboard/${pref}`}
                  label={formatLabel(pref)}
                  icon={ICONS[pref] || <Settings className="w-5 h-5" />}
                />
              ))}
            </>
          )}
        </nav>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <SidebarLink to="/dashboard/settings" label="Settings" icon={<Settings />} />
      </div>
    </aside>
  );
}

function SidebarLink({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: JSX.Element;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-emerald-600 text-white"
            : "hover:bg-slate-800 hover:text-emerald-400"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function formatLabel(key: string) {
  return key
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
