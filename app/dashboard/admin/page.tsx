"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/providers/auth-provider";
import AddBranchDialog from "@/components/AddBranchDialog";
import StatsCards from "@/components/StatsCards";
import BranchPerformanceTable from "@/components/BranchPerformanceTable";
import TopBranchPerformance from "@/components/TopBranchPerformance";
import RecentActivities from "@/components/RecentActivities";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Greeting and Add Branch Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-md sm:text-2xl font-bold">
              Good Morning, {user?.fullName} !
            </h1>
          </div>
          <AddBranchDialog />
        </div>

        {/* Key Metrics */}
        <StatsCards />

        {/* Branch Performance Table */}
        <BranchPerformanceTable />

        {/* Branch Performance and Recent Activities */}
        <div className="grid gap-6 lg:grid-cols-1">
          <RecentActivities />
          {/* <TopBranchPerformance /> */}
        </div>
      </div>
    </DashboardLayout>
  );
}
