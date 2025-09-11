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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Calendar, FileText } from "lucide-react";
import { useOccupancyAgreements } from "@/hooks/useGetOccupancy";
import { API_HOST } from "@/lib/axios";
import { CustomPagination } from "@/components/CustomPagination";

export default function OccupancyAgreementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const { data, isLoading } = useOccupancyAgreements();
  const agreements = data?.data.data || [];

  useEffect(() => {
    console.log("agreements", agreements);
  }, [agreements]);

  // Derive statuses and branches from fetched data
  const statuses = [
    "all",
    ...new Set(agreements.map((a) => a.status.toLowerCase())),
  ];
  const branches = [
    "All Branches",
    ...new Set(agreements.map((a: any) => a.branchId.name)),
  ];

  // Filter agreements
  const filteredAgreements = agreements.filter((agreement: any) => {
    const residentName = agreement.guestId?.userId.fullName || "";
    const matchesSearch =
      residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      agreement.status.toLowerCase() === selectedStatus;
    const matchesBranch =
      selectedBranch === "All Branches" ||
      agreement.branchId.name === selectedBranch;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAgreements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgreements = filteredAgreements.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedBranch]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadAgreement = (agreement: (typeof agreements)[0]) => {
    if (agreement.documentUrl) {
      const link = document.createElement("a");
      link.href = `${API_HOST}/api/v1${agreement.documentUrl}`;
      link.download = agreement.documentUrl.split("/").pop() || "document.pdf";
      link.click();
    } else {
      toast({
        title: "Download Agreement",
        description: `No document available for agreement ${agreement._id}`,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout
      title="Occupancy Agreements Dashboard"
      description="Manage and review occupancy agreements across all branches"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Occupancy Agreements
            </CardTitle>
            <CardDescription>
              View and manage occupancy agreements for all residents
            </CardDescription>
          </CardHeader>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
              <p className="mt-2"> Loading Agreements...</p>
            </div>
          ) : (
            <>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search agreements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedBranch}
                    onValueChange={setSelectedBranch}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agreement Details</TableHead>
                        <TableHead>Resident & Branch</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Download</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAgreements.map((agreement: any) => (
                        <TableRow key={agreement._id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">
                                Type: {agreement.title}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                Notes: {agreement.notes}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                Content: {agreement.content}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {agreement.guestId?.userId.fullName || "N/A"}
                              </div>
                              <div className="text-sm">
                                {agreement.guestId?.userId.phoneNumber}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {agreement.branchId.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(
                                  agreement.issuedAt
                                ).toLocaleDateString()}{" "}
                                to{" "}
                                {new Date(
                                  agreement.expiresAt
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Created by: {agreement.staffId.fullName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Badge
                                variant="outline"
                                className={getStatusColor(agreement.status)}
                              >
                                {agreement.status.charAt(0).toUpperCase() +
                                  agreement.status.slice(1)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {agreement.status.toLowerCase() === "draft" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadAgreement(agreement)
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredAgreements.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">
                      No agreements found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or create a new
                      agreement.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
