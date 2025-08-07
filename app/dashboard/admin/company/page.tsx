"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import CompanyTable from "@/components/company/CompanyTable";
import AddCompanyModal from "@/components/company/AddCompanyModal";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { computeFromManifest } from "next/dist/build/utils";

export default function CompanyPage() {
  const { user } = useAuth();
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);

  const showAddCompanyButton = user?.companies?.some(
    (company) => company.type === "Multiple"
  );

  return (
    <DashboardLayout
      title="Company Management"
      description="Manage your companies, branches, and locations"
      actions={
        showAddCompanyButton && (
          <Button size="sm" onClick={() => setAddCompanyModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        )
      }
    >
      <div className="space-y-6">
        <CompanyTable />
        <AddCompanyModal
          isOpen={addCompanyModalOpen}
          onClose={() => setAddCompanyModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
