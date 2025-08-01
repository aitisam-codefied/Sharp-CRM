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
import { useEffect, useState } from "react";
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
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/ui/toast";

export const ROOM_PREFERENCE_TYPES = {
  SINGLE: "Single Room",
  SHARED: "Shared Room",
  FAMILY: "Family Room",
};

const ROOM_AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Private Bathroom",
  "Shared Bathroom",
  "TV",
  "Refrigerator",
  "Microwave",
  "Desk",
  "Wardrobe",
  "Balcony",
  "Kitchen Access",
  "Laundry Access",
];

interface Room {
  roomNumber: string;
  type: string;
  capacity: number;
  amenities: string[];
}

interface Location {
  name: string;
  rooms: Room[];
}

interface Branch {
  name: string;
  address: string;
  locations: Location[];
}

interface Company {
  _id: string;
  name: string;
}

export default function AdminDashboard() {
  const { user, updateUserBranchesManually } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [branch, setBranch] = useState<Branch>({
    name: "",
    address: "",
    locations: [
      {
        name: "",
        rooms: [
          {
            roomNumber: "",
            type: ROOM_PREFERENCE_TYPES.SINGLE,
            capacity: 1,
            amenities: [],
          },
        ],
      },
    ],
  });
  const { toast } = useToast();
  const itemsPerPage = 5;

  // const { user } = useAuth();
  const companies = user?.companies || [];

  // Update branch name, address, or locations
  const updateBranch = (field: keyof Branch, value: string) => {
    setBranch((prev) => ({ ...prev, [field]: value }));
  };

  // Add a new location
  const addLocation = () => {
    setBranch((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          name: "",
          rooms: [
            {
              roomNumber: "",
              type: ROOM_PREFERENCE_TYPES.SINGLE,
              capacity: 1,
              amenities: [],
            },
          ],
        },
      ],
    }));
  };

  // Update a location's name
  const updateLocation = (locationIndex: number, value: string) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        name: value,
      };
      return { ...prev, locations: updatedLocations };
    });
  };

  // Remove a location
  const removeLocation = (locationIndex: number) => {
    setBranch((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== locationIndex),
    }));
  };

  // Add a new room to a location
  const addRoom = (locationIndex: number) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        rooms: [
          ...updatedLocations[locationIndex].rooms,
          {
            roomNumber: "",
            type: ROOM_PREFERENCE_TYPES.SINGLE,
            capacity: 1,
            amenities: [],
          },
        ],
      };
      return { ...prev, locations: updatedLocations };
    });
  };

  // Update a room's details
  const updateRoom = (
    locationIndex: number,
    roomIndex: number,
    field: keyof Room,
    value: any
  ) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      const updatedRooms = [...updatedLocations[locationIndex].rooms];
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        [field]: value,
      };
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        rooms: updatedRooms,
      };
      return { ...prev, locations: updatedLocations };
    });
  };

  // Remove a room from a location
  const removeRoom = (locationIndex: number, roomIndex: number) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        rooms: updatedLocations[locationIndex].rooms.filter(
          (_, i) => i !== roomIndex
        ),
      };
      return { ...prev, locations: updatedLocations };
    });
  };

  // Toggle room amenities
  const toggleAmenity = (
    locationIndex: number,
    roomIndex: number,
    amenity: string
  ) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      const updatedRooms = [...updatedLocations[locationIndex].rooms];
      const room = { ...updatedRooms[roomIndex] };

      // Create a copy of amenities
      const amenities = [...room.amenities];
      const amenityIndex = amenities.indexOf(amenity);

      if (amenityIndex > -1) {
        amenities.splice(amenityIndex, 1);
      } else {
        amenities.push(amenity);
      }

      // Update the room with new amenities
      room.amenities = amenities;
      updatedRooms[roomIndex] = room;

      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        rooms: updatedRooms,
      };

      return {
        ...prev,
        locations: updatedLocations,
      };
    });
  };

  // Define the API call function
  const createBranch = async (branchData: any) => {
    const response = await api.post("/branch/create", branchData);
    return response.data;
  };

  // Hook to handle the mutation
  const useCreateBranch = () => {
    return useMutation({
      mutationFn: createBranch,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Branch created successfully!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to create branch",
          variant: "destructive",
        });
      },
    });
  };

  const { mutate, isPending } = useCreateBranch();

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedCompanyId) {
      toast({
        title: "Error",
        description: "Please select a company.",
        variant: "destructive",
      });
      return;
    }

    // Format data for API
    const branchData = {
      companyId: selectedCompanyId,
      branch: {
        name: branch.name,
        address: branch.address,
        locations: branch.locations.map((location) => ({
          name: location.name,
          rooms: location.rooms.map((room) => ({
            roomNumber: room.roomNumber,
            type: room.type,
            capacity: room.capacity,
            amenities: room.amenities.length > 0 ? room.amenities : [""],
          })),
        })),
      },
    };

    // Execute the mutation
    mutate(branchData, {
      onSuccess: () => {
        console.log("Branch created:", branchData);
        updateUserBranchesManually(branchData);
        setIsAddDialogOpen(false);
      },
    });

    return { isPending };
  };

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
            <h1 className="text-2xl font-bold">
              Good Morning, {user?.fullName} !
            </h1>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[500px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Branch</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new branch
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Company Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Select
                      value={selectedCompanyId}
                      onValueChange={setSelectedCompanyId}
                    >
                      <SelectTrigger id="company">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Branch Name */}
                  <div className="space-y-2">
                    <Label htmlFor="branch-name">Branch Name *</Label>
                    <Input
                      id="branch-name"
                      value={branch.name}
                      onChange={(e) => updateBranch("name", e.target.value)}
                      placeholder="Enter branch name"
                    />
                  </div>

                  {/* Branch Address */}
                  <div className="space-y-2">
                    <Label htmlFor="branch-address">Branch Address *</Label>
                    <Textarea
                      id="branch-address"
                      value={branch.address}
                      onChange={(e) => updateBranch("address", e.target.value)}
                      placeholder="Enter complete branch address"
                      rows={3}
                    />
                  </div>

                  {/* Locations */}
                  <div className="space-y-4">
                    <Label>Locations</Label>
                    {branch.locations.map((location, locationIndex) => (
                      <div
                        key={locationIndex}
                        className="space-y-4 border p-4 rounded-md"
                      >
                        <div className="flex gap-2 items-center">
                          <Input
                            value={location.name}
                            onChange={(e) =>
                              updateLocation(locationIndex, e.target.value)
                            }
                            placeholder="e.g., Floor 1, East Wing, Reception"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLocation(locationIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Rooms */}
                        <div className="space-y-4">
                          {location.rooms.map((room, roomIndex) => (
                            <div
                              key={roomIndex}
                              className="space-y-4 border p-4 rounded-md bg-gray-50"
                            >
                              <div className="flex justify-between items-center">
                                <Label>Room {roomIndex + 1}</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeRoom(locationIndex, roomIndex)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Room Number *</Label>
                                  <Input
                                    value={room.roomNumber}
                                    onChange={(e) =>
                                      updateRoom(
                                        locationIndex,
                                        roomIndex,
                                        "roomNumber",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., 101, A-1"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Room Type *</Label>
                                  <Select
                                    value={room.type}
                                    onValueChange={(value) =>
                                      updateRoom(
                                        locationIndex,
                                        roomIndex,
                                        "type",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.values(ROOM_PREFERENCE_TYPES).map(
                                        (type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Capacity *</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={room.capacity}
                                  onChange={(e) =>
                                    updateRoom(
                                      locationIndex,
                                      roomIndex,
                                      "capacity",
                                      Number.parseInt(e.target.value) || 1
                                    )
                                  }
                                  placeholder="Number of people"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Amenities</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {ROOM_AMENITIES.map((amenity) => (
                                    <div
                                      key={amenity}
                                      className="flex items-center space-x-2"
                                    >
                                      <Checkbox
                                        id={`amenity-${locationIndex}-${roomIndex}-${amenity}`}
                                        checked={room.amenities.includes(
                                          amenity
                                        )}
                                        onCheckedChange={() =>
                                          toggleAmenity(
                                            locationIndex,
                                            roomIndex,
                                            amenity
                                          )
                                        }
                                      />
                                      <Label
                                        htmlFor={`amenity-${locationIndex}-${roomIndex}-${amenity}`}
                                        className="text-sm font-normal"
                                      >
                                        {amenity}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addRoom(locationIndex)}
                            className="w-full border-dashed border-2 h-10"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Room
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addLocation}
                      className="w-full border-dashed border-2 h-10"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Add Branch</Button>
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
