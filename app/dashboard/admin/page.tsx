"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Users,
  Building2,
  AlertTriangle,
  Heart,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Activity,
  MapPin,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const itemsPerPage = 5;

  const stats = [
    {
      title: "Total Staff",
      value: "248",
      change: "+12",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Across 30 branches",
    },
    {
      title: "Occupied Rooms",
      value: "1,456/1,800",
      change: "81%",
      trend: "stable",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "System-wide occupancy",
    },
    {
      title: "Active Incidents",
      value: "7",
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Requiring attention",
    },
    {
      title: "Welfare Checks Today",
      value: "1,142",
      change: "+89",
      trend: "up",
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Completed today",
    },
  ];

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

  const branchPerformance = [
    {
      name: "Manchester",
      occupancy: 95,
      incidents: 1,
      staff: 12,
      status: "excellent",
    },
    {
      name: "Birmingham",
      occupancy: 87,
      incidents: 2,
      staff: 15,
      status: "good",
    },
    {
      name: "London Central",
      occupancy: 92,
      incidents: 0,
      staff: 18,
      status: "excellent",
    },
  ];

  const recentActivities = [
    {
      type: "critical",
      message: "Critical welfare check flagged - Manchester Branch",
      time: "2 minutes ago",
      branch: "Manchester",
      priority: "high",
    },
    {
      type: "incident",
      message: "New incident reported - Birmingham Branch",
      time: "15 minutes ago",
      branch: "Birmingham",
      priority: "medium",
    },
    {
      type: "staff",
      message: "Staff shortage alert - Liverpool Branch",
      time: "1 hour ago",
      branch: "Liverpool",
      priority: "high",
    },
    {
      type: "system",
      message: "Daily reports generated successfully",
      time: "2 hours ago",
      branch: "System",
      priority: "normal",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "attention":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const totalPages = Math.ceil(branchData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = branchData.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Greeting and Add Branch Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-2xl font-bold">Good Morning, Rohail!</h1>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new staff member
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input id="joinDate" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes about the staff member"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button>Add Branch</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    {stat.trend === "up" && (
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    )}
                    {stat.trend === "down" && (
                      <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span>{stat.change} from last week</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Branch Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Branch Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
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

            {/* Table */}
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
                        <Badge
                          className={getAlertLevelColor(branch.alertLevel)}
                        >
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

            {/* Pagination */}
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Branch Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Branch Performance
              </CardTitle>
              <CardDescription>
                Performance metrics across key branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branchPerformance.map((branch, index) => (
                  <div
                    key={branch.name}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{branch.name}</h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{branch.occupancy}% occupancy</span>
                          <span>{branch.incidents} incidents</span>
                          <span>{branch.staff} staff</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(branch.status)}>
                        {branch.status}
                      </Badge>
                      <Progress value={branch.occupancy} className="w-32 h-2" />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Branches
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activities
              </CardTitle>
              <CardDescription>
                Latest updates from all branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === "critical" && (
                        <Heart className="h-4 w-4 text-red-500" />
                      )}
                      {activity.type === "incident" && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      {activity.type === "staff" && (
                        <Users className="h-4 w-4 text-blue-500" />
                      )}
                      {activity.type === "system" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {activity.branch}
                        </Badge>
                        <Badge
                          variant={
                            activity.priority === "high"
                              ? "destructive"
                              : activity.priority === "medium"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {activity.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
