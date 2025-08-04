"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AddStaffDialog from "@/components/staffs/AddStaffDialog";
import StaffTable from "@/components/staffs/StaffTable";
import StatsCards from "@/components/staffs/StatsCards";

export default function StaffManagementPage() {
  return (
    <DashboardLayout title="Staff Management" actions={<AddStaffDialog />}>
      <div className="space-y-6">
        <StatsCards />
        <StaffTable />
      </div>
    </DashboardLayout>
  );
}
