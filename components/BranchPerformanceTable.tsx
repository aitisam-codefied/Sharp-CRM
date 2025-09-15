import { useState, useMemo } from "react";
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
import { useGetBranches } from "@/hooks/useGetBranches";

// Helper function to calculate stable mock performance metrics
const calculatePerformanceMetrics = (branch: any) => {
  // Calculate total rooms across all locations
  const totalRooms = branch.locations?.reduce((total: number, location: any) => {
    return total + (location.rooms?.length || 0);
  }, 0) || 0;

  // Create a simple hash from branch ID for consistent "random" values
  const hash = branch._id.split('').reduce((acc: number, char: string) => {
    return acc + char.charCodeAt(0);
  }, 0);

  // Mock calculations for demo purposes using hash for consistency
  const totalStaff = 20 + (hash % 100); // 20-120 staff
  const residents = 100 + (hash % 400); // 100-500 residents
  const occupancy = 60 + (hash % 40); // 60-100% occupancy
  const openIRs = hash % 10; // 0-10 open incidents

  // Determine alert level based on occupancy and open IRs
  let alertLevel = "Stable";
  if (occupancy > 95 || openIRs > 7) {
    alertLevel = "High";
  } else if (occupancy > 85 || openIRs > 4) {
    alertLevel = "Moderate";
  } else if (occupancy < 70) {
    alertLevel = "Requires";
  } else if (occupancy >= 95 && openIRs === 0) {
    alertLevel = "No Issues";
  }

  return {
    totalStaff,
    residents,
    occupancy,
    openIRs,
    alertLevel,
    totalRooms,
  };
};

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
  const [selectedAlertLevel, setSelectedAlertLevel] = useState("all-alert-levels");
  const itemsPerPage = 5;
  
  const { data: branchResponse, isLoading, error } = useGetBranches();
  
  const branchData = branchResponse?.branches || [];
  
  // Memoize filtered data for better performance
  const filteredData = useMemo(() => {
    return branchData.filter((branch) => {
      const metrics = calculatePerformanceMetrics(branch);
      
      // Search filter
      const matchesSearch = searchTerm === "" || 
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.companyId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Company filter
      const matchesCompany = selectedCompany === "all-companies" || 
        branch.companyId.name.toLowerCase() === selectedCompany.toLowerCase();
      
      // Status filter (all branches are "Active" for now)
      const matchesStatus = selectedStatus === "all-status" || 
        (selectedStatus === "active" && true); // All branches are active
      
      // Alert level filter
      const matchesAlertLevel = selectedAlertLevel === "all-alert-levels" || 
        metrics.alertLevel.toLowerCase() === selectedAlertLevel.toLowerCase();
      
      return matchesSearch && matchesCompany && matchesStatus && matchesAlertLevel;
    });
  }, [branchData, searchTerm, selectedCompany, selectedStatus, selectedAlertLevel]);
  
  // Reset pagination when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };
  
  // Get unique companies for filter dropdown
  const uniqueCompanies = useMemo(() => {
    return Array.from(
      new Set(branchData.map(branch => branch.companyId.name))
    ).sort();
  }, [branchData]);
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading branches...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <div className="flex items-center justify-center py-8 text-red-600">
            <span>Failed to load branches. Please try again.</span>
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
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search branches, companies, or addresses..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
            />
          </div>
          <Select 
            value={selectedCompany} 
            onValueChange={(value) => {
              setSelectedCompany(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-companies">All Companies</SelectItem>
              {uniqueCompanies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={selectedStatus} 
            onValueChange={(value) => {
              setSelectedStatus(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={selectedAlertLevel} 
            onValueChange={(value) => {
              setSelectedAlertLevel(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Alert Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-alert-levels">All Alert Levels</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="requires">Requires</SelectItem>
              <SelectItem value="no issues">No Issues</SelectItem>
            </SelectContent>
          </Select>
          {(searchTerm || selectedCompany !== "all-companies" || selectedStatus !== "all-status" || selectedAlertLevel !== "all-alert-levels") && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCompany("all-companies");
                setSelectedStatus("all-status");
                setSelectedAlertLevel("all-alert-levels");
                setCurrentPage(1);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((branch) => {
                const metrics = calculatePerformanceMetrics(branch);
                return (
                  <TableRow key={branch._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {branch.companyId.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {branch.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{metrics.totalStaff}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>{metrics.residents}</TableCell>
                    <TableCell>{metrics.occupancy}%</TableCell>
                    <TableCell>{metrics.openIRs}</TableCell>
                    <TableCell>
                      <Badge className={getAlertLevelColor(metrics.alertLevel)}>
                        {metrics.alertLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredData.length} of {branchData.length} branches
              {(searchTerm || selectedCompany !== "all-companies" || selectedStatus !== "all-status" || selectedAlertLevel !== "all-alert-levels") && (
                <span className="ml-2 text-blue-600">(filtered)</span>
              )}
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
        )}
        
        {filteredData.length === 0 && branchData.length > 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <span>No branches match your filters.</span>
              <br />
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCompany("all-companies");
                  setSelectedStatus("all-status");
                  setSelectedAlertLevel("all-alert-levels");
                  setCurrentPage(1);
                }}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        )}
        
        {branchData.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <span>No branches found.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
