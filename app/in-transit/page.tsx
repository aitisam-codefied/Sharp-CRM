"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";
import { useInTransitUsers } from "@/hooks/useGetInTransitUsers";
import StatsCards from "@/components/in-transit/StatsCards";
import Filters from "@/components/in-transit/Filters";
import UsersTable from "@/components/in-transit/UsersTable";
import { useCompanies } from "@/hooks/useCompnay";

export default function InTransitPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const { toast } = useToast();
  const {
    data: inTransitUsersResponse,
    isLoading,
    error,
  } = useInTransitUsers();
  const InTransitUsers = inTransitUsersResponse || [];

  useEffect(() => {
    console.log("InTransitUsers", InTransitUsers);
  }, [InTransitUsers]);

  const { data: companyData } = useCompanies();

  const companyBranches =
    selectedCompany !== "all"
      ? companyData?.find((c: any) => c._id === selectedCompany)?.branches || []
      : [];

  useEffect(() => {
    setSelectedBranch("all");
  }, [selectedCompany]);

  // branch list
  const branches = companyBranches.map((b: any) => ({
    id: b._id,
    name: b.name,
  }));

  const statusOptions = ["pending", "Transferred"];

  const filteredUsers = InTransitUsers?.filter((user: any) => {
    const matchesSearch =
      !searchTerm ||
      user?.guestId?.userId?.fullName
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || user?.branchId?._id === selectedBranch;

    const matchesStatus =
      selectedStatus === "all" || user.removalStatus === selectedStatus;

    const matchesDate =
      !selectedDate ||
      new Date(user.removalScheduledAt).toISOString().split("T")[0] ===
        selectedDate;

    return matchesSearch && matchesBranch && matchesStatus && matchesDate;
  });

  const handleViewUser = (userId: string) => {
    toast({
      title: "View Transit Details",
      description: `Opening detailed view for ${userId}`,
    });
  };

  const handleMarkArrived = (userId: string) => {
    toast({
      title: "Arrival Confirmed",
      description:
        "User has been marked as arrived and room assignment activated.",
    });
  };

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <DashboardLayout
      title="In-Transit User Management"
      description="Track and manage incoming service users across all branches"
    >
      <div className="space-y-6">
        <StatsCards filteredUsers={filteredUsers} />

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
            <p className="mt-2"> Loading Intransit data...</p>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Truck className="h-5 w-5" />
                  In-Transit Service Users
                </CardTitle>
                <CardDescription className="text-sm">
                  Monitor incoming service users and prepare for arrivals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Filters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedBranch={selectedBranch}
                  selectedCompany={selectedCompany}
                  setSelectedCompany={setSelectedCompany}
                  setSelectedBranch={setSelectedBranch}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  branches={branches}
                  companies={companyData || []}
                  statusOptions={statusOptions}
                />

                <UsersTable
                  filteredUsers={filteredUsers}
                  handleViewUser={handleViewUser}
                  handleMarkArrived={handleMarkArrived}
                />

                {filteredUsers?.length === 0 && (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">
                      No in-transit users found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or add a new transit
                      alert.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
