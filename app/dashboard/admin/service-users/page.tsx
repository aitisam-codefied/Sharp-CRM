"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UserStats } from "@/components/serviceUsers/UserStats";
import { UserFilters } from "@/components/serviceUsers/UserFilters";
import { UserTable } from "@/components/serviceUsers/UserTable";
import { NewUserDialog } from "@/components/serviceUsers/NewUserDialog";
import { ServiceUser, Branch, Location, GuestFormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useBranches } from "@/hooks/useGetBranches";
import { useLocations } from "@/hooks/useGetLocations";
import { useGetGuests } from "@/hooks/useGetGuests";

export default function ServiceUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedNationality, setSelectedNationality] = useState("all");
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const { toast } = useToast();

  const { data: branchesData } = useBranches();
  const { data: locationsData } = useLocations();
  const { data: guestsData, isPending } = useGetGuests();

  useEffect(() => {
    console.log("guestsssss", guestsData);
  });

  const branches: Branch[] = branchesData || [];
  const locations: Location[] = locationsData || [];
  const guests: GuestFormData[] = guestsData || [];

  const nationalities = [
    "Syrian",
    "Afghan",
    "Venezuelan",
    "Eritrean",
    "Iraqi",
    "Iranian",
    "Sudanese",
  ];
  const statusOptions = ["active", "transitioning", "departed", "suspended"];

  const handleNewUser = () => {
    toast({
      title: "Service User Added",
      description: "New service user has been successfully registered.",
    });
    setIsNewUserOpen(false);
  };

  const handleViewUser = (userId: string) => {
    toast({
      title: "View Service User",
      description: `Opening detailed profile for ${userId}`,
    });
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit Service User",
      description: `Opening edit form for ${userId}`,
    });
  };

  if (isPending) {
    return (
      <DashboardLayout
        title="Service User Management"
        description="Manage resident profiles and information across all branches"
      >
        <div className="flex justify-center items-center h-64">
          Loading service users...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Service User Management"
      description="Manage resident profiles and information across all branches"
      actions={
        <NewUserDialog
          isOpen={isNewUserOpen}
          setIsOpen={setIsNewUserOpen}
          branches={branches}
          locations={locations}
          nationalities={nationalities}
          onSubmit={handleNewUser}
        />
      }
    >
      <div className="space-y-6">
        <UserStats users={guests} />
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedNationality={selectedNationality}
          setSelectedNationality={setSelectedNationality}
          branches={branches.map((b) => b.name)} // Pass names for filters
          statusOptions={statusOptions}
          nationalities={nationalities}
        />
        <UserTable
          users={guests}
          searchTerm={searchTerm}
          selectedBranch={selectedBranch}
          selectedStatus={selectedStatus}
          selectedNationality={selectedNationality}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
        />
      </div>
    </DashboardLayout>
  );
}
