"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stethoscope,
  Search,
  Filter,
  Download,
  UserCheck,
  UserPlus,
  Clock,
  Eye,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMedicalStaff } from "@/hooks/useGetMedicalStaff";
import { MedicalStaffTable } from "@/components/medical-staff/MedicalStaffTable";
import { MedicalStaffStats } from "@/components/medical-staff/MedicalStaffStats";
import { AddMedicalStaffModal } from "@/components/medical-staff/AddMedicalStaffModal";
import { CustomPagination } from "@/components/CustomPagination";

export default function MedicalStaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const statusForQuery = selectedStatus === "all" ? undefined : selectedStatus;
  const { data, isLoading } = useMedicalStaff(500, statusForQuery);

  const medicalStaff = data?.results ?? [];

  const types = useMemo(
    () => [...new Set(medicalStaff.map((s) => s.type))].sort(),
    [medicalStaff]
  );

  const filteredStaff = medicalStaff.filter((staff) => {
    const matchesSearch =
      staff.fullName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      staff._id?.toLowerCase().includes(searchTerm?.toLowerCase());

    const matchesType = selectedType === "all" || staff.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || staff.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (staffId: string) => {
    toast({
      title: "View Staff Details",
      description: `Opening detailed view for staff ${staffId}`,
    });
  };

  const handleNewStaff = () => {
    setIsModalOpen(true); // Open modal instead of toast
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaff = filteredStaff.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <DashboardLayout
      title="Medical Staff Management"
      description="Manage and monitor medical staff across all branches"
      actions={
        <div className="flex gap-2">
          <Button size="sm" onClick={handleNewStaff}>
            <Plus className="h-4 w-4" />
            Add Medical Staff
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Component */}
        <MedicalStaffStats filteredStaff={filteredStaff} />{" "}
        {/* Medical Staff Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Medical Staff Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
                <p className="mt-2"> Loading Medical Staffs...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      {/* <SelectItem value="on-leave">On Leave</SelectItem> */}
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <MedicalStaffTable
                  staff={paginatedStaff}
                  getStatusColor={getStatusColor}
                  handleViewDetails={handleViewDetails}
                />

                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />

                {filteredStaff.length === 0 && (
                  <div className="text-center py-8">
                    <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No staff found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Render Modal */}
      <AddMedicalStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
}
