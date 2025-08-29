"use client";

import { useState } from "react";
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
  Heart,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetWelfareChecks } from "@/hooks/useGetWelfareChecks";
import { CustomPagination } from "@/components/CustomPagination";
import { WelfareCheck } from "@/lib/types";

export default function WelfarePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { toast } = useToast();

  // Reset pagination when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setCurrentPage(1);
  };

  // Fetch welfare checks data with server-side filtering
  const { data: welfareData, isLoading, error } = useGetWelfareChecks({
    page: currentPage,
    limit,
    search: searchTerm,
    status: selectedStatus,
  });


  // Use server-side data directly (pagination is handled by the API)
  const welfareChecks = welfareData?.data?.results || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ok":
        return "bg-green-100 text-green-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case "ok":
        return "text-green-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getMentalStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case "ok":
      case "positive":
      case "stable":
        return "text-green-600";
      case "anxious":
      case "fair":
        return "text-yellow-600";
      case "distressed":
      case "poor":
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleViewDetails = (checkId: string) => {
    toast({
      title: "View Welfare Check",
      description: `Opening detailed view for welfare check ${checkId}`,
    });
  };

  const handleNewCheck = () => {
    toast({
      title: "New Welfare Check",
      description: "Opening new welfare check form",
    });
  };

  const getStats = () => {
    const totalChecks = welfareData?.data?.totalResults || 0;
    const criticalChecks = welfareChecks.filter((c) => c.status === "CRITICAL").length;
    const completedChecks = welfareChecks.filter((c) => c.isCompleted).length;
    const followUpRequired = welfareChecks.filter((c) => c.followUpRequired).length;

    return { totalChecks, criticalChecks, completedChecks, followUpRequired };
  };

  const stats = getStats();

  // Handle loading state
  if (isLoading) {
    return (
      <DashboardLayout
        title="Welfare Check Management"
        description="Monitor and manage resident welfare checks across all branches"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading welfare checks...</span>
        </div>
      </DashboardLayout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <DashboardLayout
        title="Welfare Check Management"
        description="Monitor and manage resident welfare checks across all branches"
      >
        <div className="flex items-center justify-center h-64">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-500">Error loading welfare checks</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Welfare Check Management"
      description="Monitor and manage resident welfare checks across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          {/* <Button size="sm" onClick={handleNewCheck}>
            <Plus className="h-4 w-4 mr-2" />
            New Check
          </Button> */}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Checks</p>
                  <p className="text-2xl font-bold">{stats.totalChecks}</p>
                </div>
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Critical Flags
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.criticalChecks}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Completed Checks
                  </p>
                  <p className="text-2xl font-bold">{stats.completedChecks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Follow-up Required
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.followUpRequired}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welfare Checks Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Welfare Check Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by observations or assessment..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full md:w-48"
              />
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              {/* <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button> */}
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Welfare Check ID</TableHead>
                    <TableHead>Week Period</TableHead>
                    <TableHead>Physical Health</TableHead>
                    <TableHead>Mental Health</TableHead>
                    <TableHead>Emotional Wellbeing</TableHead>
                    <TableHead>Social Support</TableHead>
                    <TableHead>Overall Assessment</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead>Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {welfareChecks.map((check: WelfareCheck) => (
                    <TableRow key={check._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {check._id.slice(-8)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {check.guestId?.userId?.fullName|| "No Guest"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {new Date(check.weekStartDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            to {new Date(check.weekEndDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getHealthColor(
                            check.physicalHealth.status
                          )}`}
                        >
                          {check.physicalHealth.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getMentalStateColor(
                            check.mentalHealth.status
                          )}`}
                        >
                          {check.mentalHealth.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getHealthColor(
                            check.emotionalWellbeing.status
                          )}`}
                        >
                          {check.emotionalWellbeing.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getHealthColor(
                            check.socialSupport.status
                          )}`}
                        >
                          {check.socialSupport.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getHealthColor(
                            check.overallAssessment
                          )}`}
                        >
                          {check.overallAssessment}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
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

            {welfareChecks.length === 0 && (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  No welfare checks found
                </h3>
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : "No welfare checks available for this page."}
                </p>
              </div>
            )}

            {/* Server-Side Pagination */}
            {/* {welfareData?.data?.totalPages && welfareData.data.totalPages > 1 && (
      
            )} */}
              <div className="flex justify-center mt-6 pt-4 border-t">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={welfareData?.data?.totalPages || 1}
                  onPageChange={setCurrentPage}
                />
              </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
     

   {/* {stats.criticalChecks > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Welfare Alerts
              </CardTitle>
              <CardDescription className="text-red-600">
                {stats.criticalChecks} welfare checks require immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {welfareChecks
                  .filter((check: WelfareCheck) => check.status === "CRITICAL")
                  .map((check) => (
                    <div
                      key={check._id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-red-900">
                          Welfare Check {check._id.slice(-8)}
                        </p>
                        <p className="text-sm text-red-600">{check.observations}</p>
                        <p className="text-xs text-red-500">
                          Created: {new Date(check.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleViewDetails(check._id)}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
          */}
      </div>
    </DashboardLayout>
  );
}
