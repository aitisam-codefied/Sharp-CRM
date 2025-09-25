"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";
import { useGetBranchList } from "@/hooks/useGetBranchList";
import { CustomPagination } from "@/components/CustomPagination"; // 👈 import custom pagination

// Types for transformed data
interface TransformedBranchData {
  id: string;
  branch: string;
  branchCode: string;
  companyName: string;
  address: string;
  totalStaff: number;
  status: string;
  residents: number;
  occupancy: number;
  openIRs: number;
  alertLevel: string;
  totalRooms: number;
  totalCapacity: number;
  locations: number;
  createdAt: string;
  updatedAt: string;
}

const calculateTotalRooms = (locations: any[]) => {
  return locations.reduce(
    (total, location) => total + location.rooms.length,
    0
  );
};

const calculateTotalCapacity = (locations: any[]) => {
  return locations.reduce((total, location) => {
    return (
      total +
      location.rooms.reduce((roomTotal: number, room: any) => {
        const capacityMatch = room.type.match(/\(Capacity (\d+)\)/);
        return roomTotal + (capacityMatch ? parseInt(capacityMatch[1]) : 1);
      }, 0)
    );
  }, 0);
};

const generateMockData = (branchId: string) => ({
  totalStaff: Math.floor(Math.random() * 100) + 20,
  status: "Active",
  residents: Math.floor(Math.random() * 500) + 100,
  openIRs: Math.floor(Math.random() * 10),
  alertLevel: ["High", "Moderate", "Stable", "Requires", "No Issues"][
    Math.floor(Math.random() * 5)
  ],
});

const getAlertLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "moderate":
      return "bg-yellow-100 text-yellow-800";
    case "stable":
      return "bg-green-100 text-green-800";
    case "requires":
      return "bg-orange-100 text-orange-800";
    case "no issues":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function BranchPerformanceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all-companies");
  const [selectedStatus, setSelectedStatus] = useState("all-status");
  const [selectedBranch, setSelectedBranch] = useState("all-branches");
  const [selectedRole, setSelectedRole] = useState("all-roles");

  const itemsPerPage = 5;

  const { data: branchListData, isLoading, error } = useGetBranchList();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch, selectedRole, selectedStatus]);

  const transformedBranchData: TransformedBranchData[] =
    branchListData?.map((branch) => {
      const mockData = generateMockData(branch._id);
      const totalRooms = calculateTotalRooms(branch.locations);
      const totalCapacity = calculateTotalCapacity(branch.locations);
      const occupancy =
        totalCapacity > 0
          ? Math.round((mockData.residents / totalCapacity) * 100)
          : 0;

      return {
        id: branch._id,
        branch: branch.name,
        branchCode: branch._id.slice(-8).toUpperCase(),
        companyName: branch.companyId.name,
        address: branch.address,
        totalStaff: mockData.totalStaff,
        status: mockData.status,
        residents: mockData.residents,
        occupancy: occupancy,
        openIRs: mockData.openIRs,
        alertLevel: mockData.alertLevel,
        totalRooms: totalRooms,
        totalCapacity: totalCapacity,
        locations: branch.locations.length,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      };
    }) || [];

  const uniqueCompanies = Array.from(
    new Set(transformedBranchData.map((branch) => branch.companyName))
  );

  const filteredData = transformedBranchData.filter((branch) => {
    const matchesSearch =
      searchTerm === "" ||
      branch.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "all-branches" ||
      branch.companyName.toLowerCase().includes(selectedBranch.toLowerCase());

    const matchesStatus =
      selectedStatus === "all-status" ||
      branch.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesRole = selectedRole === "all-roles";

    return matchesSearch && matchesBranch && matchesStatus && matchesRole;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading branches</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Building2 className="h-5 w-5" />
          Branch Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search branches..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger>
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-branches">All Companies</SelectItem>
              {uniqueCompanies.map((company) => (
                <SelectItem key={company} value={company.toLowerCase()}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Branch</TableHead>
                <TableHead>Total Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Residents</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Open IRs</TableHead>
                <TableHead>Alert Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium capitalize">
                        {branch.branch}
                      </div>
                      {/* <div className="text-sm text-muted-foreground">
                        {branch.branchCode}
                      </div> */}
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-700 border border-blue-200 text-xs capitalize mt-1"
                      >
                        {branch.companyName}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{branch.totalStaff}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800"
                    >
                      {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{branch.residents}</TableCell>
                  <TableCell>{branch.occupancy}%</TableCell>
                  <TableCell>{branch.openIRs}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getAlertLevelColor(branch.alertLevel)}
                    >
                      {branch.alertLevel}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Custom Pagination integrated */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
