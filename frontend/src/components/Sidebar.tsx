// src/components/Sidebar.tsx
import { Home, DollarSign, Package, ClipboardList, BarChart3, Users, Settings } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Dashboard" },
  { icon: DollarSign, label: "Sales" },
  { icon: Package, label: "Inventory" },
  { icon: ClipboardList, label: "Prescriptions" },
  { icon: BarChart3, label: "Reports" },
  { icon: Users, label: "Users" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="w-64 backdrop-blur-lg bg-white/10 border-r border-white/10 flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-teal-400 mb-8">HealthHub Ltd</h2>
        <nav className="space-y-3">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all ${
                active === label ? "bg-teal-500 text-white" : "hover:bg-white/10 text-gray-300"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 text-sm text-gray-400">© 2025 TechofficeSolutions</div>
    </aside>
  );
}
