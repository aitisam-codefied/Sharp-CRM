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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useGetBranchList } from "@/hooks/useGetBranchList";

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

// Helper function to calculate total rooms across all locations
const calculateTotalRooms = (locations: any[]) => {
  return locations.reduce(
    (total, location) => total + location.rooms.length,
    0
  );
};

// Helper function to calculate total capacity (assuming each room has capacity based on type)
const calculateTotalCapacity = (locations: any[]) => {
  return locations.reduce((total, location) => {
    return (
      total +
      location.rooms.reduce((roomTotal: number, room: any) => {
        // Extract capacity from room type string (e.g., "Triple Room (Capacity 3)")
        const capacityMatch = room.type.match(/\(Capacity (\d+)\)/);
        return roomTotal + (capacityMatch ? parseInt(capacityMatch[1]) : 1);
      }, 0)
    );
  }, 0);
};

// Mock data for fields not available in API
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
  const [selectedAlertLevel, setSelectedAlertLevel] =
    useState("all-alert-levels");
  const itemsPerPage = 5;

  // Filter states
  const [selectedBranch, setSelectedBranch] = useState("all-branches");
  const [selectedRole, setSelectedRole] = useState("all-roles");

  // Fetch branch data from API
  const { data: branchListData, isLoading, error } = useGetBranchList();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch, selectedRole, selectedStatus]);

  // Transform API data to match table structure
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

  // Get unique companies for branch filter
  const uniqueCompanies = Array.from(
    new Set(transformedBranchData.map((branch) => branch.companyName))
  );

  // Apply filters
  const filteredData = transformedBranchData.filter((branch) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      branch.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());

    // Branch location filter (using company name as branch location)
    const matchesBranch =
      selectedBranch === "all-branches" ||
      branch.companyName.toLowerCase().includes(selectedBranch.toLowerCase());

    // Status filter
    const matchesStatus =
      selectedStatus === "all-status" ||
      branch.status.toLowerCase() === selectedStatus.toLowerCase();

    // Role filter (this doesn't apply to branches, but keeping for consistency)
    const matchesRole = selectedRole === "all-roles";

    return matchesSearch && matchesBranch && matchesStatus && matchesRole;
  });

  // Reset to first page when filters change
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Branch Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading branches...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Branch Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">
              Error loading branches. Please try again.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No results state
  if (filteredData.length === 0 && transformedBranchData.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Branch Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center justify-between gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search branches..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="">
                <SelectValue placeholder="All Branches" />
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
            {/* <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select> */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedBranch("all-branches");
                setSelectedRole("all-roles");
                setSelectedStatus("all-status");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              No branches found matching your filters.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Branch Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center justify-between gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search branches..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="">
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
          {/* <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-roles">All Roles</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select> */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedBranch("all-branches");
              setSelectedRole("all-roles");
              setSelectedStatus("all-status");
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        {/* Active filters summary */}
        {(searchTerm ||
          selectedBranch !== "all-branches" ||
          selectedStatus !== "all-status") && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedBranch !== "all-branches" && (
                <Badge variant="secondary" className="gap-1">
                  Company: {selectedBranch}
                  <button
                    onClick={() => setSelectedBranch("all-branches")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedStatus !== "all-status" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {selectedStatus}
                  <button
                    onClick={() => setSelectedStatus("all-status")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}

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
                {/* <TableHead>Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{branch.branch}</div>
                      <div className="text-sm text-muted-foreground">
                        {branch.branchCode}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {branch.companyName}
                      </div>
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
                  {/* <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Rows per page: {itemsPerPage}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of{" "}
              {filteredData.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
