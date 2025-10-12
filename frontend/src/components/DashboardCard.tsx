// src/components/DashboardCard.tsx
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md hover:bg-white/15 transition-all">
      <div className="text-teal-400">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-400">{title}</h4>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
