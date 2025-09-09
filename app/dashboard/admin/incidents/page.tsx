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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  AlertTriangle,
  Search,
  Plus,
  Eye,
  Edit,
  Clock,
  User,
  MapPin,
  FileText,
  Download,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIncidents } from "@/hooks/useGetIncidents";
import IncidentsTable from "@/components/incidents/IncidentsTable";

interface UIIncident {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  reportedBy: string;
  assignedTo: string;
  branch: string;
  location: string;
  residentInvolved: string;
  dateReported: string;
  timeReported: string;
  dateResolved: string | null;
  timeResolved: string | null;
  category: string;
  actionsTaken: string;
}

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { data: incidents = [], isLoading, error } = useIncidents();

  const itemsPerPage = 10;

  const branches = useMemo(() => {
    const unique = [...new Set(incidents.map((i) => i.branch))];
    return unique.sort();
  }, [incidents]);

  const severityLevels = ["low", "medium", "high", "critical"];
  const statusOptions = ["open", "investigating", "resolved", "closed"];

  const filteredIncidents = incidents.filter((incident: UIIncident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.residentInvolved
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || incident.branch === selectedBranch;
    const matchesSeverity =
      selectedSeverity === "all" ||
      incident.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchesStatus =
      selectedStatus === "all" ||
      incident.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesBranch && matchesSeverity && matchesStatus;
  });

  const currentIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch, selectedSeverity, selectedStatus]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-red-100 text-red-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "medical":
        return "bg-red-100 text-red-800";
      case "behavioral":
        return "bg-orange-100 text-orange-800";
      case "facility":
        return "bg-blue-100 text-blue-800";
      case "security":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleNewIncident = () => {
    toast({
      title: "Incident Reported",
      description:
        "New incident has been logged and assigned for investigation.",
    });
    setIsNewIncidentOpen(false);
  };

  const handleViewIncident = (incidentId: string) => {
    toast({
      title: "View Incident",
      description: `Opening detailed view for incident ${incidentId}`,
    });
  };

  const getStats = () => {
    const totalIncidents = filteredIncidents.length;
    const openIncidents = filteredIncidents.filter(
      (i) =>
        i.status.toLowerCase() === "open" ||
        i.status.toLowerCase() === "investigating"
    ).length;
    const criticalIncidents = filteredIncidents.filter(
      (i) => i.severity.toLowerCase() === "critical"
    ).length;
    const resolvedToday = filteredIncidents.filter(
      (i) => i.dateResolved === new Date().toISOString().split("T")[0]
    ).length;

    return { totalIncidents, openIncidents, criticalIncidents, resolvedToday };
  };

  const stats = getStats();

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredIncidents]);

  return (
    <DashboardLayout
      title="Incident Management System"
      description="Report, track and manage incidents across all branches"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Incidents
                  </p>
                  <p className="text-2xl font-bold">{stats.totalIncidents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Open/Investigating
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.openIncidents}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Critical Incidents
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.criticalIncidents}
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
                    Resolved Today
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.resolvedToday}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incidents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incident Reports
            </CardTitle>
            <CardDescription>
              Track and manage all reported incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {severityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
                <p className="mt-2"> Loading incidents...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-600">
                Error loading incidents: {error.message}
              </div>
            ) : (
              <>
                <IncidentsTable
                  incidents={currentIncidents}
                  getSeverityColor={getSeverityColor}
                  getCategoryColor={getCategoryColor}
                  getStatusColor={getStatusColor}
                  handleViewIncident={handleViewIncident}
                />

                {}
                <div className="flex justify-end items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
