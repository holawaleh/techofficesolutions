import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
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
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-emerald-400">
          {org.name || "Loading..."}
        </h1>
        <span className="text-slate-400 text-sm">
          {org.preference.length > 0
            ? `Industry: ${org.preference.join(", ")}`
            : "No preferences set"}
        </span>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <DashboardCard title="Today's Sales" value="₦145,000" icon="$" />
        <DashboardCard title="Low Stock Items" value="12" icon="📦" />
        <DashboardCard title="Pending Orders" value="7" icon="🧾" />
        <DashboardCard title="Active Staff" value="5" icon="👥" />
      </div>

      <div className="mt-8 bg-slate-800 p-6 rounded-lg text-slate-300 text-center">
        Sales chart placeholder (we’ll integrate Recharts later)
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg hover:bg-slate-700 transition">
      <span className="text-3xl mb-2">{icon}</span>
      <h3 className="text-slate-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
