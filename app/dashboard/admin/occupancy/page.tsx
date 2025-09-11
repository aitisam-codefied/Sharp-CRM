// pages/occupancy-agreements.tsx or the original file
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Download, Eye, Calendar, FileText } from "lucide-react";
import { useOccupancyAgreements } from "@/hooks/useGetOccupancy";

export default function OccupancyAgreementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [isNewAgreementOpen, setIsNewAgreementOpen] = useState(false);
  const { toast } = useToast();

  const { data, isLoading, error } = useOccupancyAgreements();
  const agreements = data?.data.data || [];

  useEffect(() => {
    console.log("agreements", agreements);
  });

  const loading = isLoading;

  // Derive statuses and branches from fetched data
  const statuses = [
    "all",
    ...new Set(agreements.map((a) => a.status.toLowerCase())),
  ];
  const branches = [
    "all",
    ...new Set(agreements.map((a: any) => a.branchId.name)),
  ];

  // Filter agreements based on search, status, branch
  const filteredAgreements = agreements.filter((agreement: any) => {
    const residentName = agreement.guestId?.userId.fullName || "";
    const matchesSearch =
      residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      agreement.status.toLowerCase() === selectedStatus;
    const matchesBranch =
      selectedBranch === "all" || agreement.branchId.name === selectedBranch;

    return matchesSearch && matchesStatus && matchesBranch;
  });

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

  const handleViewAgreement = (agreement: (typeof agreements)[0]) => {
    if (agreement.documentUrl) {
      window.open(`http://localhost:5001${agreement.documentUrl}`, "_blank");
    } else {
      toast({
        title: "View Agreement",
        description: `No document available for agreement ${agreement._id}`,
        variant: "destructive",
      });
    }
  };

  const handleDownloadAgreement = (agreement: (typeof agreements)[0]) => {
    if (agreement.documentUrl) {
      const link = document.createElement("a");
      link.href = `http://localhost:5001${agreement.documentUrl}`;
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <DashboardLayout
      title="Occupancy Agreements Dashboard"
      description="Manage and review occupancy agreements across all branches"
    >
      <div className="space-y-6">
        {/* Agreements Table */}
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
          <CardContent>
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
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
              <Dialog
                open={isNewAgreementOpen}
                onOpenChange={setIsNewAgreementOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Agreement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Occupancy Agreement</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new occupancy agreement
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="residentName">Resident Name</Label>
                      <Input
                        id="residentName"
                        placeholder="Enter resident name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.slice(1).map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input id="roomNumber" placeholder="Enter room number" />
                    </div>
                    <div>
                      <Label htmlFor="agreementType">Agreement Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agreement type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["standard", "temporary", "extended"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="monthlyRent">Monthly Rent (£)</Label>
                        <Input
                          id="monthlyRent"
                          type="number"
                          placeholder="Enter monthly rent"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="deposit">Deposit (£)</Label>
                        <Input
                          id="deposit"
                          type="number"
                          placeholder="Enter deposit amount"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="specialConditions">
                        Special Conditions
                      </Label>
                      <Input
                        id="specialConditions"
                        placeholder="Enter special conditions"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        setIsNewAgreementOpen(false);
                        toast({
                          title: "Agreement Created",
                          description:
                            "New occupancy agreement has been created successfully",
                        });
                      }}
                    >
                      Create Agreement
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agreement Details</TableHead>
                    <TableHead>Resident & Branch</TableHead>
                    <TableHead>Financial Details</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgreements.map((agreement: any) => (
                    <TableRow key={agreement._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{agreement._id}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {agreement.notes}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Type: {agreement.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="font-medium">
                            {agreement.guestId?.userId.fullName || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {agreement.branchId.name} -{" "}
                            {agreement.guestId?.familyRooms
                              .map((r: any) => r.roomId)
                              .join(", ") || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs font-medium">N/A /month</div>
                          <div className="text-xs text-muted-foreground">
                            Deposit: N/A
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
                            {new Date(agreement.expiresAt).toLocaleDateString()}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAgreement(agreement)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {agreement.status.toLowerCase() === "draft" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadAgreement(agreement)}
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
                  Try adjusting your search criteria or create a new agreement.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
