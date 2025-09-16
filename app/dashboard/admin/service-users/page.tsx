"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UserStats } from "@/components/serviceUsers/UserStats";
import { UserFilters } from "@/components/serviceUsers/UserFilters";
import { UserTable } from "@/components/serviceUsers/UserTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination";
import { useBranches } from "@/hooks/useGetBranches";
import { useLocations } from "@/hooks/useGetLocations";
import { useGetGuests } from "@/hooks/useGetGuests";
import { useRooms } from "@/hooks/useGetRooms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCompanies } from "@/hooks/useCompnay";

export default function ServiceUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedNationality, setSelectedNationality] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: branchesData } = useBranches();
  const { data: locationsData } = useLocations();
  const { data: roomsData } = useRooms();
  const { data: guestsData, isPending } = useGetGuests();

  // const branches = branchesData || [];
  const locations = locationsData || [];
  const rooms = roomsData || [];
  const guests = guestsData || [];
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

  useEffect(() => {
    console.log("guestsss", guests);
  });

  // const branchNames = Array.from(new Set(branches.map((b) => b.name)));

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

  // 🚨 Filter first
  const filteredUsers = useMemo(() => {
    return guests.filter((guest: any) => {
      const fullName = guest.userId?.fullName?.toLowerCase() || "";
      const branchId = guest.familyRooms[0]?.roomId?.locationId?.branchId?.name;
      const nationality = guest.nationality || "";
      const status = guest.priorityLevel || "";

      const matchesSearch = fullName.includes(searchTerm?.toLowerCase());

      const matchesBranch =
        selectedBranch === "all" || branchId === selectedBranch;

      const matchesStatus =
        selectedStatus === "all" || status === selectedStatus;
      const matchesNationality =
        selectedNationality === "all" ||
        nationality.trim()?.toLowerCase() ===
          selectedNationality.trim()?.toLowerCase();

      return (
        matchesSearch && matchesBranch && matchesStatus && matchesNationality
      );
    });
  }, [
    guests,
    searchTerm,
    selectedBranch,
    selectedStatus,
    selectedNationality,
    branches,
  ]);

  // 🚨 Then paginate
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch, selectedStatus, selectedNationality]);

  // if (isPending) {
  //   return (
  //     <DashboardLayout
  //       title="Service User Management"
  //       description="Manage resident profiles and information across all branches"
  //     >
  //       <div className="text-center py-8">
  //         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
  //         <p className="mt-2"> Loading Guests...</p>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  return (
    <DashboardLayout
      title="Service User Management"
      description="Manage resident profiles and information across all branches"
      actions={
        <Button
          onClick={() => router.push("/dashboard/admin/new-user")}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service User
        </Button>
      }
    >
      <div className="space-y-6">
        <UserStats users={filteredUsers} />{" "}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Service User Management
            </CardTitle>
            <CardDescription>
              Manage resident profiles and information across all branches
            </CardDescription>
          </CardHeader>
          {isPending ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
              <p className="mt-2"> Loading Service Users...</p>
            </div>
          ) : (
            <CardContent>
              {/* Stats use filtered data */}
              <div className="">
                <UserFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCompany={selectedCompany}
                  setSelectedCompany={setSelectedCompany}
                  selectedBranch={selectedBranch}
                  setSelectedBranch={setSelectedBranch}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  selectedNationality={selectedNationality}
                  setSelectedNationality={setSelectedNationality}
                  companies={companyData || []}
                  branches={branches}
                  statusOptions={statusOptions}
                  nationalities={nationalities}
                />
              </div>
              <UserTable
                users={paginatedUsers} // 🚨 only send paginated slice
                searchTerm={searchTerm}
                selectedBranch={selectedBranch}
                selectedStatus={selectedStatus}
                selectedNationality={selectedNationality}
                branches={branches}
                allLocations={locations}
                allRooms={rooms}
                nationalities={nationalities}
              />
            </CardContent>
          )}
        </Card>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
}
