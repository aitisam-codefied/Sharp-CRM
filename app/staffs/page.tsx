"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/providers/auth-provider";
import AddStaffDialog from "@/components/staffs/AddStaffDialog";
import StaffTable from "@/components/staffs/StaffTable";
import StatsCards from "@/components/staffs/StatsCards";
import { RoleWrapper } from "@/lib/RoleWrapper";

export default function StaffManagementPage() {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-xs sm:text-xl font-bold">Staff Management</h1>
        </div>
        {RoleWrapper(user?.roles[0]?.name || "", <AddStaffDialog />)}
      </div>
      <div className="space-y-6">
        <StatsCards />
        <StaffTable />
      </div>
    </DashboardLayout>
  );
}
