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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Download,
  UserCheck,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ServiceUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedNationality, setSelectedNationality] = useState("all");
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const { toast } = useToast();

  const serviceUsers = [
    {
      id: "SMS-USER-1001",
      name: "John Smith",
      dateOfBirth: "1985-03-15",
      nationality: "Syrian",
      gender: "Male",
      room: "204A",
      branch: "Manchester",
      status: "active",
      arrivalDate: "2024-01-10",
      caseWorker: "Sarah Johnson",
      phone: "+44 7700 900123",
      email: "john.smith@temp.com",
      emergencyContact: "Brother - Ahmed Smith (+44 7700 900124)",
      medicalConditions: ["Diabetes", "High Blood Pressure"],
      dietaryRequirements: ["Halal"],
      languages: ["Arabic", "English"],
      supportNeeds: ["Medical Support", "Language Classes"],
      documents: ["Passport", "Medical Records", "Asylum Application"],
      lastWelfareCheck: "2024-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "SMS-USER-1002",
      name: "Ahmed Hassan",
      dateOfBirth: "1990-07-22",
      nationality: "Afghan",
      gender: "Male",
      room: "205B",
      branch: "Manchester",
      status: "active",
      arrivalDate: "2024-01-08",
      caseWorker: "Emma Wilson",
      phone: "+44 7700 900125",
      email: "ahmed.hassan@temp.com",
      emergencyContact: "Wife - Fatima Hassan (+44 7700 900126)",
      medicalConditions: ["PTSD", "Anxiety"],
      dietaryRequirements: ["Halal", "No Pork"],
      languages: ["Dari", "Pashto", "Basic English"],
      supportNeeds: ["Mental Health Support", "Job Training"],
      documents: ["ID Card", "Medical Records"],
      lastWelfareCheck: "2024-01-14",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "SMS-USER-1003",
      name: "Maria Garcia",
      dateOfBirth: "1988-11-30",
      nationality: "Venezuelan",
      gender: "Female",
      room: "206A",
      branch: "Birmingham",
      status: "active",
      arrivalDate: "2024-01-05",
      caseWorker: "David Brown",
      phone: "+44 7700 900127",
      email: "maria.garcia@temp.com",
      emergencyContact: "Sister - Carmen Garcia (+44 7700 900128)",
      medicalConditions: [],
      dietaryRequirements: ["Vegetarian"],
      languages: ["Spanish", "English"],
      supportNeeds: ["Legal Advice", "Education"],
      documents: ["Passport", "Birth Certificate", "Educational Certificates"],
      lastWelfareCheck: "2024-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "SMS-USER-1004",
      name: "David Wilson",
      dateOfBirth: "1975-05-18",
      nationality: "Eritrean",
      gender: "Male",
      room: "207B",
      branch: "Liverpool",
      status: "transitioning",
      arrivalDate: "2023-12-20",
      caseWorker: "Lisa Chen",
      phone: "+44 7700 900129",
      email: "david.wilson@temp.com",
      emergencyContact: "Friend - Michael Johnson (+44 7700 900130)",
      medicalConditions: ["Asthma"],
      dietaryRequirements: [],
      languages: ["Tigrinya", "Arabic", "English"],
      supportNeeds: ["Housing Support", "Employment"],
      documents: ["Refugee Status", "Work Permit", "Medical Records"],
      lastWelfareCheck: "2024-01-12",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const branches = [
    "Manchester",
    "Birmingham",
    "London Central",
    "Liverpool",
    "Leeds",
  ];
  const nationalities = [
    "Syrian",
    "Afghan",
    "Venezuelan",
    "Eritrean",
    "Iraqi",
    "Iranian",
    "Sudanese",
  ];
  const statusOptions = ["active", "transitioning", "departed", "suspended"];

  const filteredUsers = serviceUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || user.branch === selectedBranch;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    const matchesNationality =
      selectedNationality === "all" || user.nationality === selectedNationality;

    return (
      matchesSearch && matchesBranch && matchesStatus && matchesNationality
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "transitioning":
        return "bg-blue-100 text-blue-800";
      case "departed":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleNewUser = () => {
    toast({
      title: "Service User Added",
      description: "New service user has been successfully registered.",
    });
    setIsNewUserOpen(false);
  };

  const handleViewUser = (userId: string) => {
    toast({
      title: "View Service User",
      description: `Opening detailed profile for ${userId}`,
    });
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit Service User",
      description: `Opening edit form for ${userId}`,
    });
  };

  const getStats = () => {
    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter(
      (u) => u.status === "active"
    ).length;
    const transitioningUsers = filteredUsers.filter(
      (u) => u.status === "transitioning"
    ).length;
    const newArrivals = filteredUsers.filter(
      (u) =>
        new Date(u.arrivalDate) >=
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalUsers, activeUsers, transitioningUsers, newArrivals };
  };

  const stats = getStats();

  return (
    <DashboardLayout
      title="Service User Management"
      description="Manage resident profiles and information across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Service User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Service User</DialogTitle>
                <DialogDescription>
                  Register a new service user in the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalities.map((nationality) => (
                          <SelectItem
                            key={nationality}
                            value={nationality.toLowerCase()}
                          >
                            {nationality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages Spoken</Label>
                    <Input id="languages" placeholder="e.g., Arabic, English" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch.toLowerCase()}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room">Room Number</Label>
                    <Input id="room" placeholder="e.g., 204A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseworker">Case Worker</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign case worker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="emma">Emma Wilson</SelectItem>
                        <SelectItem value="david">David Brown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+44 7700 900000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@temp.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input id="emergency" placeholder="Name and phone number" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medical">Medical Conditions</Label>
                    <Textarea
                      id="medical"
                      placeholder="List any medical conditions..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dietary">Dietary Requirements</Label>
                    <Textarea
                      id="dietary"
                      placeholder="List dietary requirements..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support">Support Needs</Label>
                  <Textarea
                    id="support"
                    placeholder="Describe support needs..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsNewUserOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleNewUser}>Add Service User</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  <p className="text-sm text-muted-foreground">
                    Total Service Users
                  </p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Residents
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.activeUsers}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transitioning</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.transitioningUsers}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    New Arrivals (7 days)
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.newArrivals}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Service User Directory
            </CardTitle>
            <CardDescription>
              Comprehensive list of all service users and their information
            </CardDescription>
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
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedNationality}
                onValueChange={setSelectedNationality}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Nationalities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nationalities</SelectItem>
                  {nationalities.map((nationality) => (
                    <SelectItem key={nationality} value={nationality}>
                      {nationality}
                    </SelectItem>
                  ))}
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
                    <TableHead>Service User</TableHead>
                    <TableHead>Personal Details</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact Info</TableHead>

                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs">
                            <strong>DOB:</strong> {user.dateOfBirth}
                          </div>
                          <div className="text-xs">
                            <strong>Nationality:</strong> {user.nationality}
                          </div>
                          <div className="text-xs">
                            <strong>Gender:</strong> {user.gender}
                          </div>
                          <div className="text-xs">
                            <strong>Languages:</strong>{" "}
                            {user.languages.join(", ")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.branch}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Room {user.room}
                          </div>
                          <div className="text-xs">
                            <strong>Arrived:</strong> {user.arrivalDate}
                          </div>
                          <div className="text-xs">
                            <strong>Case Worker:</strong> {user.caseWorker}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                          <div className="flex items-center text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  No service users found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or add a new service user.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
