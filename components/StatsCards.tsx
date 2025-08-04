import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  AlertTriangle,
  Heart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const stats = [
  {
    title: "Total Staff",
    value: "248",
    change: "+12",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Across 30 branches",
  },
  {
    title: "Occupied Rooms",
    value: "1,456/1,800",
    change: "81%",
    trend: "stable",
    icon: Building2,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "System-wide occupancy",
  },
  {
    title: "Active Incidents",
    value: "7",
    change: "-3",
    trend: "down",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Requiring attention",
  },
  {
    title: "Welfare Checks Today",
    value: "1,142",
    change: "+89",
    trend: "up",
    icon: Heart,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Completed today",
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" && (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                )}
                {stat.trend === "down" && (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span>{stat.change} from last week</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
