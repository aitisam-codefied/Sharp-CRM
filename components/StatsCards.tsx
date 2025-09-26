"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  AlertTriangle,
  Heart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "./providers/auth-provider";

// Interface for API response data
interface DashboardStats {
  totalStaff: {
    value: number;
    change: number;
    changePercent: number;
    trend: "up" | "down" | "stable";
    context: string;
    lastWeekValue: number;
  };
  occupiedRooms: {
    value: string;
    percentage: number;
    context: string;
    lastWeekPercentage: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  activeIncidents: {
    value: number;
    change: number;
    changePercent: number;
    trend: "up" | "down" | "stable";
    context: string;
    lastWeekValue: number;
  };
  welfareChecksToday: {
    value: string;
    change: number;
    changePercent: number;
    trend: "up" | "down" | "stable";
    context: string;
    lastWeekValue: number;
  };
}

// Custom hook for fetching dashboard stats
const useDashboardStats = (tenantId: string) => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats", tenantId],
    queryFn: async () => {
      const response = await api.get(
        `/analytics/dashboard?tenantId=${tenantId}`
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
};

// Map API data to component stats format
const mapStatsToComponent = (data: DashboardStats) => [
  {
    title: "Total Staff",
    value: data?.totalStaff?.value?.toString(),
    change: `${data?.totalStaff?.change >= 0 ? "+" : ""}${
      data?.totalStaff?.change
    }`,
    trend: data?.totalStaff?.trend,
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: data?.totalStaff?.context,
  },
  {
    title: "Occupancy",
    value: data?.occupiedRooms?.value,
    change: `${data?.occupiedRooms?.percentage}%`,
    trend: data?.occupiedRooms?.trend,
    icon: Building2,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: data?.occupiedRooms?.context,
  },
  {
    title: "Active Incidents",
    value: data?.activeIncidents?.value?.toString(),
    change: `${data?.activeIncidents?.change >= 0 ? "+" : ""}${
      data?.activeIncidents?.change
    }`,
    trend: data?.activeIncidents?.trend,
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: data?.activeIncidents?.context,
  },
  {
    title: "Welfare Checks Today",
    value: data?.welfareChecksToday?.value,
    change: `${data?.welfareChecksToday?.change >= 0 ? "+" : ""}${
      data?.welfareChecksToday?.change
    }`,
    trend: data?.welfareChecksToday?.trend,
    icon: Heart,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: data?.welfareChecksToday?.context,
  },
];

export default function StatsCards() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || "";
  // console.log("Tenant ID in StatsCards:", tenantId); // <--debug
  const { data, isLoading, isError } = useDashboardStats(tenantId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
              <div className="flex items-center justify-between mt-2">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-40 bg-gray-200 rounded mt-1"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center p-4">
        Error loading dashboard statistics
      </div>
    );
  }

  const stats = mapStatsToComponent(data!);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats?.map((stat) => (
        <Card key={stat?.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat?.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat?.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat?.value}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-muted-foreground">
                {stat?.trend === "up" && (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                )}
                {stat?.trend === "down" && (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                {stat?.trend === "stable" && (
                  <span className="mr-1 h-3 w-3 text-gray-500">—</span>
                )}
                <span>{stat?.change} from last week</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat?.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
