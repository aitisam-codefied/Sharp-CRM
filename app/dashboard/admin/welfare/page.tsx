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
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetWelfareChecks } from "@/hooks/useGetWelfareChecks";
import { CustomPagination } from "@/components/CustomPagination";
import { WelfareCheck } from "@/lib/types";

export default function WelfarePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // ek page me 10 hi dikhayenge
  const { toast } = useToast();

  // Backend se saare data fetch (pagination remove kar diya)
  const { data: welfareData, isLoading, error } = useGetWelfareChecks({});

  console.log("allWelfareChecks ===>", welfareData);

  const allWelfareChecks: WelfareCheck[] = welfareData?.data.data || [];

  // Filtering logic
  // Filtering logic
  const filteredWelfareChecks = useMemo(() => {
    return allWelfareChecks.filter((check: WelfareCheck) => {
      // Search match (guest name + observations + assessment)
      const fullName = check.guestId?.userId?.fullName || "";
      const matchesSearch = fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Status match
      const matchesStatus =
        selectedStatus === "all" ||
        check.status.toLowerCase() === selectedStatus.toLowerCase();

      // Date filter (within weekStartDate - weekEndDate)
      const matchesDate =
        !selectedDate ||
        (() => {
          const selected = new Date(selectedDate);
          const start = new Date(check.weekStartDate);
          const end = new Date(check.weekEndDate);

          // Clear time part for accurate comparison
          selected.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);

          return selected >= start && selected <= end;
        })();
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [allWelfareChecks, searchTerm, selectedStatus, selectedDate]);

  // Sort latest first
  const sortedWelfareChecks = useMemo(() => {
    return [...filteredWelfareChecks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredWelfareChecks]);

  // Frontend pagination
  const totalPages = Math.ceil(sortedWelfareChecks.length / itemsPerPage);
  const paginatedChecks = sortedWelfareChecks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredWelfareChecks]);

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

  // Stats cards ke liye
  const stats = {
    totalChecks: filteredWelfareChecks.length,
    criticalChecks: filteredWelfareChecks.filter((c) => c.status === "CRITICAL")
      .length,
    completedChecks: filteredWelfareChecks.filter((c) => c.isCompleted).length,
    followUpRequired: filteredWelfareChecks.filter((c) => c.followUpRequired)
      .length,
  };

  if (error) {
    return (
      <DashboardLayout title="Welfare Check Management" description="Error">
        <div className="flex items-center justify-center h-64">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-500">
            Error loading welfare checks
          </span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Welfare Check Management"
      description="Monitor and manage resident welfare checks across all branches"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search by Guest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Input
            placeholder="MM/DD/YYYY"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-48"
          />
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ok">OK</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
            <p className="mt-2"> Loading welfare data...</p>
          </div>
        ) : (
          <>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedChecks.map((check) => (
                    <TableRow key={check._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {check._id.slice(-8)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {check.guestId?.userId?.fullName || "No Guest"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(check.weekStartDate).toLocaleDateString()} -{" "}
                          {new Date(check.weekEndDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={getHealthColor(
                            check.physicalHealth.status
                          )}
                        >
                          {check.physicalHealth.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={getMentalStateColor(
                            check.mentalHealth.status
                          )}
                        >
                          {check.mentalHealth.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={getHealthColor(
                            check.emotionalWellbeing.status
                          )}
                        >
                          {check.emotionalWellbeing.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={getHealthColor(check.socialSupport.status)}
                        >
                          {check.socialSupport.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={getHealthColor(check.overallAssessment)}
                        >
                          {check.overallAssessment}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(check.status)}
                        >
                          {check.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {paginatedChecks.length === 0 && (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  No welfare checks found
                </h3>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
}
