"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetMealMarkings } from "@/hooks/useGetMealMarking";
import MealsStats from "@/components/meals/MealsStats";
import MealsTable from "@/components/meals/MealsTable";
import { set } from "date-fns";
import { useCompanies } from "@/hooks/useCompnay";

export default function MealsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedMeal, setSelectedMeal] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [residents, setResidents] = useState([]);
  // const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const { toast } = useToast();

  const { data, isLoading } = useGetMealMarkings();
  const { data: CompanyData } = useCompanies();

  const companyBranches =
    selectedCompany !== "all"
      ? CompanyData?.find((c: any) => c._id === selectedCompany)?.branches || []
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
    console.log("meal dataaaaa", data);
  });

  useEffect(() => {
    if (data) {
      const mappedResidents = data.map((item: any) => ({
        id: item.guestId?.userId.portNumber,
        name: item.guestId?.userId.fullName.trim(),
        room: item.guestId?.familyId, // Using familyId as a proxy for room
        branch: item?.branchId?.name,
        branchId: item?.branchId?._id,
        meals: {
          breakfast: {
            marked: item.meals?.breakfast.taken,
            time: null,
            staff: item.staffId?.fullName || null,
          },
          lunch: {
            marked: item.meals?.lunch.taken,
            time: null,
            staff: item.staffId?.fullName || null,
          },
          dinner: {
            marked: item.meals?.dinner.taken,
            time: null,
            staff: item.staffId?.fullName || null,
          },
        },
        dietary: [], // Not available in API
        lastMeal: "None",
        markingId: item._id,
      }));
      setResidents(mappedResidents);
      setCurrentPage(1); // Reset to first page when data changes
    }
  }, [data]);

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = resident?.name
      ?.toLowerCase()
      .includes(searchTerm?.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || resident.branchId === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch]);

  return (
    <DashboardLayout
      title="Meal Tracking System"
      description="Track meal attendance and dietary requirements across all branches"
    >
      <div className="space-y-6">
        <MealsStats residents={filteredResidents} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Meal Attendance Tracking
            </CardTitle>
            <CardDescription>
              Mark meal attendance for residents across all branches
            </CardDescription>
          </CardHeader>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
              <p className="mt-2"> Loading meals...</p>
            </div>
          ) : (
            <CardContent>
              <div
                className={`grid gap-4 mb-6 ${
                  selectedCompany !== "all"
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Company */}
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {CompanyData?.map((company: any) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Branch (only if company selected) */}
                {selectedCompany !== "all" && (
                  <Select
                    value={selectedBranch}
                    onValueChange={setSelectedBranch}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <MealsTable
                residents={filteredResidents}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />

              {filteredResidents.length === 0 && (
                <div className="text-center py-8">
                  <Utensils className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No residents found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
