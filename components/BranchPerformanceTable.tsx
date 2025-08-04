import { useState } from "react";
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
} from "lucide-react";

const branchData = [
  {
    id: 1,
    branch: "Downtown",
    branchCode: "BRANCH-01",
    totalStaff: 23,
    status: "Active",
    residents: 193,
    occupancy: 92,
    openIRs: 3,
    alertLevel: "Moderate",
  },
  {
    id: 2,
    branch: "Downtown",
    branchCode: "BRANCH-02",
    totalStaff: 54,
    status: "Active",
    residents: 533,
    occupancy: 54,
    openIRs: 6,
    alertLevel: "High",
  },
  {
    id: 3,
    branch: "Downtown",
    branchCode: "BRANCH-03",
    totalStaff: 34,
    status: "Active",
    residents: 212,
    occupancy: 87,
    openIRs: 8,
    alertLevel: "Stable",
  },
  {
    id: 4,
    branch: "Downtown",
    branchCode: "BRANCH-04",
    totalStaff: 124,
    status: "Active",
    residents: 343,
    occupancy: 23,
    openIRs: 3,
    alertLevel: "Requires",
  },
  {
    id: 5,
    branch: "Downtown",
    branchCode: "BRANCH-05",
    totalStaff: 65,
    status: "Active",
    residents: 531,
    occupancy: 98,
    openIRs: 1,
    alertLevel: "No Issues",
  },
];

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
  const itemsPerPage = 5;
  const totalPages = Math.ceil(branchData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = branchData.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Branch Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-10" />
          </div>
          <Select defaultValue="all-branches">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-branches">All Branches</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="uptown">Uptown</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-roles">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-roles">All Roles</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
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
              {currentData.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{branch.branch}</div>
                      <div className="text-sm text-muted-foreground">
                        {branch.branchCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{branch.totalStaff}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{branch.residents}</TableCell>
                  <TableCell>{branch.occupancy}%</TableCell>
                  <TableCell>{branch.openIRs}</TableCell>
                  <TableCell>
                    <Badge className={getAlertLevelColor(branch.alertLevel)}>
                      {branch.alertLevel}
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
              {startIndex + 1}-{Math.min(endIndex, branchData.length)} of{" "}
              {branchData.length}
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
