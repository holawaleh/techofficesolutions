// src/pages/DashboardPage.tsx
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";
import { DollarSign, Package, ClipboardList, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Today's Sales" value="₦145,000" icon={<DollarSign />} />
        <DashboardCard title="Low Stock Items" value="12" icon={<Package />} />
        <DashboardCard title="Pending Orders" value="7" icon={<ClipboardList />} />
        <DashboardCard title="Active Staff" value="5" icon={<Users />} />
      </div>

      <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10">
        <p className="text-gray-300">📈 Sales chart placeholder (we’ll integrate Recharts later)</p>
      </div>
    </DashboardLayout>
  );
}
