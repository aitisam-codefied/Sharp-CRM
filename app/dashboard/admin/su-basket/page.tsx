"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/su-basket/StatsCard";
import { BasketsTable } from "@/components/su-basket/BasketsTable";
import { useBaskets } from "@/hooks/useGetBaskets";

export default function ServiceUserBasketsPage() {
  const { data, isLoading, isError } = useBaskets();

  if (isLoading) {
    return (
      <DashboardLayout
        title="Service User Baskets Dashboard"
        description="Manage and track service user baskets across all branches"
      >
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (isError || !data?.success) {
    return (
      <DashboardLayout
        title="Service User Baskets Dashboard"
        description="Manage and track service user baskets across all branches"
      >
        <div>Error loading baskets. Please try again.</div>
      </DashboardLayout>
    );
  }

  const baskets = data.data.data;

  return (
    <DashboardLayout
      title="Service User Baskets Dashboard"
      description="Manage and track service user baskets across all branches"
    >
      <div className="space-y-6">
        <StatsCard baskets={baskets} />
        <BasketsTable baskets={baskets} />
      </div>
    </DashboardLayout>
  );
}
