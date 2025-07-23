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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WelfarePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { toast } = useToast();

  const welfareChecks = [
    {
      id: "WEL001",
      residentId: "SMS-USER-1001",
      residentName: "John Smith",
      room: "204A",
      branch: "Manchester",
      checkDate: "2024-01-15",
      checkTime: "09:30",
      staffMember: "Sarah Johnson",
      physicalHealth: "Good",
      mentalState: "Stable",
      socialInteraction: "Engaging",
      covidSymptoms: false,
      isolationRequired: false,
      criticalFlag: false,
      status: "completed",
      followUpRequired: false,
      notes: "Resident is settling in well, no concerns noted.",
    },
    {
      id: "WEL002",
      residentId: "SMS-USER-1002",
      residentName: "Ahmed Hassan",
      room: "205B",
      branch: "Manchester",
      checkDate: "2024-01-15",
      checkTime: "10:15",
      staffMember: "Ahmed Hassan",
      physicalHealth: "Fair",
      mentalState: "Anxious",
      socialInteraction: "Limited",
      covidSymptoms: false,
      isolationRequired: false,
      criticalFlag: true,
      status: "critical",
      followUpRequired: true,
      notes:
        "Resident showing signs of anxiety, requires mental health support.",
    },
    {
      id: "WEL003",
      residentId: "SMS-USER-1003",
      residentName: "Maria Garcia",
      room: "206A",
      branch: "Birmingham",
      checkDate: "2024-01-15",
      checkTime: "11:00",
      staffMember: "Emma Wilson",
      physicalHealth: "Good",
      mentalState: "Positive",
      socialInteraction: "Engaging",
      covidSymptoms: false,
      isolationRequired: false,
      criticalFlag: false,
      status: "completed",
      followUpRequired: false,
      notes: "Resident is doing well, actively participating in activities.",
    },
    {
      id: "WEL004",
      residentId: "SMS-USER-1004",
      residentName: "David Wilson",
      room: "207B",
      branch: "Liverpool",
      checkDate: "2024-01-15",
      checkTime: "14:30",
      staffMember: "Lisa Chen",
      physicalHealth: "Poor",
      mentalState: "Distressed",
      socialInteraction: "Withdrawn",
      covidSymptoms: true,
      isolationRequired: true,
      criticalFlag: true,
      status: "critical",
      followUpRequired: true,
      notes:
        "Resident showing COVID symptoms, isolated immediately. Requires medical attention.",
    },
  ];

  const branches = [
    "Manchester",
    "Birmingham",
    "London Central",
    "Liverpool",
    "Leeds",
  ];

  const filteredChecks = welfareChecks.filter((check) => {
    const matchesSearch =
      check.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.residentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || check.branch === selectedBranch;
    const matchesStatus =
      selectedStatus === "all" || check.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
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
    switch (health) {
      case "Excellent":
      case "Good":
        return "text-green-600";
      case "Fair":
        return "text-yellow-600";
      case "Poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getMentalStateColor = (state: string) => {
    switch (state) {
      case "Positive":
      case "Stable":
        return "text-green-600";
      case "Anxious":
        return "text-yellow-600";
      case "Distressed":
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
    const totalChecks = filteredChecks.length;
    const criticalChecks = filteredChecks.filter((c) => c.criticalFlag).length;
    const completedToday = filteredChecks.filter(
      (c) => c.checkDate === new Date().toISOString().split("T")[0]
    ).length;
    const followUpRequired = filteredChecks.filter(
      (c) => c.followUpRequired
    ).length;

    return { totalChecks, criticalChecks, completedToday, followUpRequired };
  };

  const stats = getStats();

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
          <Button size="sm" onClick={handleNewCheck}>
            <Plus className="h-4 w-4 mr-2" />
            New Check
          </Button>
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
                    Completed Today
                  </p>
                  <p className="text-2xl font-bold">{stats.completedToday}</p>
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
                    placeholder="Search by name, ID, or room..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Branch & Room</TableHead>
                    <TableHead>Check Details</TableHead>
                    <TableHead>Health Status</TableHead>
                    <TableHead>Mental State</TableHead>

                    <TableHead>Status</TableHead>
                    <TableHead className="">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {check.residentName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {check.residentId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {check.branch}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Room {check.room}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{check.checkDate}</div>
                          <div className="text-sm text-muted-foreground">
                            {check.checkTime}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {check.staffMember}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getHealthColor(
                            check.physicalHealth
                          )}`}
                        >
                          {check.physicalHealth}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getMentalStateColor(
                            check.mentalState
                          )}`}
                        >
                          {check.mentalState}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
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

            {filteredChecks.length === 0 && (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  No welfare checks found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        {stats.criticalChecks > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Welfare Alerts
              </CardTitle>
              <CardDescription className="text-red-600">
                {stats.criticalChecks} residents require immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredChecks
                  .filter((check) => check.criticalFlag)
                  .map((check) => (
                    <div
                      key={check.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-red-900">
                          {check.residentName} - Room {check.room}
                        </p>
                        <p className="text-sm text-red-600">{check.notes}</p>
                        <p className="text-xs text-red-500">
                          {check.branch} • Checked by {check.staffMember}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleViewDetails(check.id)}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
