import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sectorData = {
  hospitality: {
    metrics: [
      { label: "Rooms Occupied", value: "245/300", change: "+12%", trend: "up" },
      { label: "Guest Satisfaction", value: "4.8/5", change: "+0.3", trend: "up" },
      { label: "Revenue Today", value: "$12,450", change: "+8%", trend: "up" },
    ],
  },
  commerce: {
    metrics: [
      { label: "Total Sales", value: "$45,230", change: "+15%", trend: "up" },
      { label: "Items Sold", value: "1,234", change: "-5%", trend: "down" },
      { label: "Inventory Level", value: "85%", change: "0%", trend: "neutral" },
    ],
  },
  tourism: {
    metrics: [
      { label: "Active Tours", value: "42", change: "+20%", trend: "up" },
      { label: "Bookings This Week", value: "156", change: "+25%", trend: "up" },
      { label: "Customer Rating", value: "4.9/5", change: "+0.2", trend: "up" },
    ],
  },
  health: {
    metrics: [
      { label: "Patients Today", value: "78", change: "+5%", trend: "up" },
      { label: "Appointments", value: "92", change: "+10%", trend: "up" },
      { label: "Bed Availability", value: "15/50", change: "-3", trend: "down" },
    ],
  },
  agriculture: {
    metrics: [
      { label: "Crop Yield", value: "2,450 kg", change: "+18%", trend: "up" },
      { label: "Active Farms", value: "12", change: "0%", trend: "neutral" },
      { label: "Supply Orders", value: "34", change: "+22%", trend: "up" },
    ],
  },
  others: {
    metrics: [
      { label: "Active Projects", value: "28", change: "+14%", trend: "up" },
      { label: "Team Members", value: "45", change: "+3", trend: "up" },
      { label: "Completion Rate", value: "87%", change: "+5%", trend: "up" },
    ],
  },
};

export function SectorDashboard({ sector }: { sector: string }) {
  const data = sectorData[sector as keyof typeof sectorData] || sectorData.others;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {metric.trend === "up" && (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">{metric.change}</span>
                  </>
                )}
                {metric.trend === "down" && (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600" />
                    <span className="text-red-600">{metric.change}</span>
                  </>
                )}
                {metric.trend === "neutral" && (
                  <span>{metric.change}</span>
                )}
                <span>from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">Activity Item #{item}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(Date.now() - item * 3600000).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: Active
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
