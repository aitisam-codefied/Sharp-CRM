"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import api from "@/lib/axios";

const createStaff = async (staffData: any) => {
  const response = await api.post("/user/create", staffData);
  return response.data;
};

export default function StaffManagementPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(
    user?.companies?.[0]?._id || ""
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
  });

  const roles = ["Manager", "AssistantManager", "Staff"];
  const isGeneralManager = selectedRoles.includes("Manager");
  const isAssistantManagerOrStaff = selectedRoles.some(
    (role) => role === "AssistantManager" || role === "Staff"
  );

  // Filter branches based on selected company
  const allBranches =
    user?.companies
      ?.filter((company) => !selectedCompany || company._id === selectedCompany)
      ?.flatMap((company) => company.branches || [])
      ?.map((branch) => ({
        id: branch._id,
        name: branch.name,
        locations:
          branch.locations?.map((loc) => ({
            id: loc._id,
            name: loc.name,
          })) || [],
      })) || [];

  const branches = Array.from(
    new Set(allBranches.map((branch) => branch.name))
  );

  // Filter locations based on selected branches
  const locations = allBranches
    .filter((branch) => selectedBranches.includes(branch.name))
    .flatMap((branch) => branch.locations.map((loc) => loc.name) || []);

  const handleRoleChange = (value) => {
    setSelectedRoles((prev) =>
      prev.includes(value)
        ? prev.filter((role) => role !== value)
        : [...prev, value]
    );
    setSelectedBranches([]);
    setSelectedLocations([]);
  };

  const handleBranchChange = (value) => {
    if (isGeneralManager) {
      setSelectedBranches((prev) =>
        prev.includes(value)
          ? prev.filter((branch) => branch !== value)
          : [...prev, value]
      );
    } else {
      setSelectedBranches([value]);
    }
    setSelectedLocations([]);
  };

  const handleLocationChange = (value) => {
    if (isAssistantManagerOrStaff) {
      setSelectedLocations((prev) =>
        prev.includes(value)
          ? prev.filter((loc) => loc !== value)
          : [...prev, value]
      );
    } else {
      setSelectedLocations([value]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const [staffMembers, setStaffMembers] = useState([
    {
      id: "STF001",
      name: "Sarah Johnson",
      email: "sarah.johnson@sms.com",
      phone: "+44 7700 900123",
      role: "Manager",
      branch: branches[0] || "Unknown",
      status: "active",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-15 09:30",
      hoursThisWeek: 38,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "STF002",
      name: "Ahmed Hassan",
      email: "ahmed.hassan@sms.com",
      phone: "+44 7700 900124",
      role: "Staff",
      branch: branches[1] || "Unknown",
      status: "active",
      joinDate: "2023-03-20",
      lastLogin: "2024-01-15 08:15",
      hoursThisWeek: 40,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "STF003",
      name: "Emma Wilson",
      email: "emma.wilson@sms.com",
      phone: "+44 7700 900125",
      role: "Staff",
      branch: branches[0] || "Unknown",
      status: "active",
      joinDate: "2023-02-10",
      lastLogin: "2024-01-14 16:45",
      hoursThisWeek: 35,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]);

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranches.length === 0 ||
      selectedBranches.includes("all") ||
      selectedBranches.includes(staff.branch);
    const matchesRole =
      selectedRoles.length === 0 ||
      selectedRoles.includes("all") ||
      selectedRoles.includes(staff.role);
    const matchesStatus =
      selectedStatus === "all" || staff.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Manager":
        return "bg-blue-100 text-blue-800";
      case "Security":
        return "bg-purple-100 text-purple-800";
      case "Cook":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const mutation = useMutation({
    mutationFn: createStaff,
    onSuccess: (data) => {
      toast({
        title: "Staff Member Added",
        description: `Staff member ${
          data.data?.fullName || "new staff"
        } has been successfully added.`,
      });
      console.log(data);
      queryClient.invalidateQueries(["staffList"]);
      setIsAddDialogOpen(false);
      setSelectedRoles([]);
      setSelectedBranches([]);
      setSelectedLocations([]);
      setSelectedCompany(user?.companies?.[0]?._id || "");
      setFormData({ name: "", email: "", phone: "", joinDate: "" });
    },
    onError: (error) => {
      toast({
        title: "Error Adding Staff",
        description:
          error.response?.data?.error ||
          "Failed to add staff member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddStaff = (newStaff) => {
    const branchIds = selectedBranches
      .map((branchName) => {
        const branch = allBranches.find((b) => b.name === branchName);
        return branch ? branch.id : null;
      })
      .filter((id) => id !== null);

    const locationIds = selectedLocations
      .map((locationName) => {
        const branch = allBranches.find((b) =>
          b.locations.some((loc) => loc.name === locationName)
        );
        const location = branch?.locations.find(
          (loc) => loc.name === locationName
        );
        return location ? location.id : null;
      })
      .filter((id) => id !== null);

    const backendData = {
      companyId: selectedCompany, // Add company ID to backend data
      fullName: newStaff.name,
      emailAddress: newStaff.email,
      phoneNumber: newStaff.phone,
      joinDate: newStaff.joinDate,
      roles: newStaff.roles,
      branchId: branchIds,
      locations: locationIds,
    };

    mutation.mutate(backendData);
  };

  const handleEditStaff = (staffId) => {
    toast({
      title: "Edit Staff",
      description: `Opening edit form for staff ID: ${staffId}`,
    });
  };

  const handleDeleteStaff = (staffId) => {
    setStaffMembers(staffMembers.filter((staff) => staff.id !== staffId));
    toast({
      title: "Staff Member Removed",
      description: `Staff member ${staffId} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const handleViewProfile = (staffId) => {
    toast({
      title: "View Profile",
      description: `Opening detailed profile for staff ID: ${staffId}`,
    });
  };

  const getOneMonthAgoDate = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return now.toISOString().split("T")[0];
  };

  return (
    <DashboardLayout
      title="Staff Management"
      actions={
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={mutation.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[500px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Enter the details for the new staff member
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {user?.companies?.length > 1 && (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedCompany(value);
                        setSelectedBranches([]);
                        setSelectedLocations([]);
                      }}
                      value={selectedCompany}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.companies?.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={mutation.isPending}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role(s)</Label>
                    <Select
                      onValueChange={handleRoleChange}
                      value=""
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedRoles.length > 0
                              ? selectedRoles.join(", ")
                              : "Select role(s)"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRoles.includes(role)}
                                readOnly
                                className="mr-2"
                              />
                              {role}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch(es)</Label>
                    <Select
                      onValueChange={handleBranchChange}
                      value=""
                      disabled={
                        selectedRoles.length === 0 ||
                        (user?.companies?.length > 1 && !selectedCompany) ||
                        mutation.isPending
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedBranches.length > 0
                              ? selectedBranches.join(", ")
                              : "Select branch(es)"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedBranches.includes(branch)}
                                readOnly
                                className="mr-2"
                                disabled={!isGeneralManager}
                              />
                              {branch}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      disabled={mutation.isPending}
                      min={getOneMonthAgoDate()}
                    />
                  </div>
                </div>
                {isAssistantManagerOrStaff && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location(s)</Label>
                    <Select
                      onValueChange={handleLocationChange}
                      value=""
                      disabled={
                        selectedBranches.length === 0 || mutation.isPending
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedLocations.length > 0
                              ? selectedLocations.join(", ")
                              : "Select location(s)"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedLocations.includes(location)}
                                readOnly
                                className="mr-2"
                              />
                              {location}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setSelectedRoles([]);
                    setSelectedBranches([]);
                    setSelectedLocations([]);
                    setSelectedCompany(user?.companies?.[0]?._id || "");
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      joinDate: "",
                    });
                  }}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleAddStaff({
                      ...formData,
                      roles: selectedRoles,
                      branches: selectedBranches,
                      locations: selectedLocations,
                    })
                  }
                  disabled={
                    !formData.name ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.joinDate ||
                    selectedRoles.length === 0 ||
                    selectedBranches.length === 0 ||
                    (user?.companies?.length > 1 && !selectedCompany) ||
                    mutation.isPending
                  }
                >
                  {mutation.isPending ? "Adding..." : "Add Staff Member"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold">{staffMembers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-2xl font-bold">186</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Leave</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Hours/Week
                  </p>
                  <p className="text-2xl font-bold">38.5</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Directory
            </CardTitle>
            <CardDescription>
              Manage and monitor staff across all branches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={selectedBranches[0] || "all"}
                onValueChange={(value) => setSelectedBranches([value])}
              >
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
                value={selectedRoles[0] || "all"}
                onValueChange={(value) => setSelectedRoles([value])}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
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
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role & Branch</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hours This Week</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={staff.avatar || "/placeholder.svg"}
                              alt={staff.name}
                            />
                            <AvatarFallback>
                              {staff.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {staff.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getRoleColor(staff.role)}>
                            {staff.role}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {staff.branch}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {staff.email}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            {staff.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(staff.status)}>
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">
                            {staff.hoursThisWeek}h
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {staff.lastLogin}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProfile(staff.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStaff(staff.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  No staff members found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or add a new staff member.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
