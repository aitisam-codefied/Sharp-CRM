"use client";
import { useCompanies } from "@/hooks/useCompnay";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Home,
  Eye,
  Edit,
  Trash2,
  Users,
  Plus,
  Building2,
  Bed,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useDeleteBranch } from "@/hooks/useDeleteBranch";
import { useAuth } from "@/components/providers/auth-provider";
import { useUpdateBranch } from "@/hooks/useUpdateBranch";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useDeleteCompany } from "@/hooks/useDeleteCompany";

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  amenities: string[];
  capacity: number;
}

interface Location {
  _id: string;
  name: string;
  rooms: Room[];
}

interface Branch {
  _id: string;
  name: string;
  address: string;
  locations: Location[];
}

interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Branch[];
  createdAt: string;
  updatedAt: string;
}

const COMPANY_BUSINESS_TYPES = {
  SINGLE: "Single",
  FRANCHISE: "Franchise",
  MULTIPLE: "Multiple",
};

export const ROOM_PREFERENCE_TYPES = {
  SINGLE: "Single Room",
  SHARED: "Shared Room",
  FAMILY: "Family Room",
};

export const ROOM_STATUS_TYPES = {
  OCCUPIED: "Occupied",
  VACANT: "Vacant",
  MAINTENANCE: "Maintenance",
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

export default function CompanyPage() {
  const queryClient = useQueryClient();
  const { data: companies = [], isLoading, isError } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newCompanies, setNewCompanies] = useState<Company[]>([]);
  const deleteBranchMutation = useDeleteBranch();
  const { removeBranchFromCompany, user, updateUserCompanies } = useAuth();
  const updateBranchMutation = useUpdateBranch();
  const { mutate: deleteCompanyMutation, isPending } = useDeleteCompany();

  const showAddCompanyButton = user?.companies.some(
    (company) => company.type === "Multiple"
  );

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Get access token from context or local storage
  const accessToken = localStorage.getItem("sms_access_token");

  // Mutation for creating company
  const createCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/company/create", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Company created successfully!",
      });

      const newCompany = data.company;
      const updatedCompanies = [...(user?.companies || []), newCompany];
      updateUserCompanies(updatedCompanies);

      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setAddCompanyModalOpen(false);
      setCurrentStep(1);
      setNewCompanies([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create company.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (addCompanyModalOpen) {
      setNewCompanies([
        {
          name: "",
          type: COMPANY_BUSINESS_TYPES.MULTIPLE,
          branches: [],
          _id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setCurrentStep(1);
    }
  }, [addCompanyModalOpen]);

  const addCompany = () => {
    const newCompany: Company = {
      _id: `temp-${Date.now()}`,
      name: "",
      type: COMPANY_BUSINESS_TYPES.MULTIPLE,
      branches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNewCompanies([...newCompanies, newCompany]);
  };

  const updateCompany = (index: number, field: string, value: string) => {
    const updatedCompanies = [...newCompanies];
    updatedCompanies[index] = { ...updatedCompanies[index], [field]: value };
    setNewCompanies(updatedCompanies);
  };

  const removeCompany = (index: number) => {
    if (newCompanies.length > 1) {
      const updatedCompanies = newCompanies.filter((_, i) => i !== index);
      setNewCompanies(updatedCompanies);
    }
  };

  const addBranch = (companyIndex: number) => {
    const updatedCompanies = [...newCompanies];
    const newBranch: Branch = {
      _id: `branch-${Date.now()}`,
      name: "",
      address: "",
      locations: [],
    };
    updatedCompanies[companyIndex].branches.push(newBranch);
    setNewCompanies(updatedCompanies);
  };

  const updateBranch = (
    companyIndex: number,
    branchIndex: number,
    field: string,
    value: string
  ) => {
    const updatedCompanies = [...newCompanies];
    updatedCompanies[companyIndex].branches[branchIndex] = {
      ...updatedCompanies[companyIndex].branches[branchIndex],
      [field]: value,
    };
    setNewCompanies(updatedCompanies);
  };

  const removeBranch = (companyIndex: number, branchIndex: number) => {
    const updatedCompanies = [...newCompanies];
    if (updatedCompanies[companyIndex].branches.length > 1) {
      updatedCompanies[companyIndex].branches.splice(branchIndex, 1);
      setNewCompanies(updatedCompanies);
    }
  };

  const addLocation = (companyIndex: number, branchIndex: number) => {
    const updatedCompanies = [...newCompanies];
    const newLocation: Location = {
      _id: `location-${Date.now()}`,
      name: "",
      rooms: [],
    };
    updatedCompanies[companyIndex].branches[branchIndex].locations.push(
      newLocation
    );
    setNewCompanies(updatedCompanies);
  };

  const updateLocation = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    value: string
  ) => {
    const updatedCompanies = [...newCompanies];
    updatedCompanies[companyIndex].branches[branchIndex].locations[
      locationIndex
    ].name = value;
    setNewCompanies(updatedCompanies);
  };

  const removeLocation = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number
  ) => {
    const updatedCompanies = [...newCompanies];
    updatedCompanies[companyIndex].branches[branchIndex].locations.splice(
      locationIndex,
      1
    );
    setNewCompanies(updatedCompanies);
  };

  const addRoom = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number
  ) => {
    const updatedCompanies = [...newCompanies];
    const newRoom: Room = {
      _id: `room-${Date.now()}`,
      roomNumber: "",
      type: ROOM_PREFERENCE_TYPES.SINGLE,
      status: ROOM_STATUS_TYPES.VACANT,
      amenities: [],
      capacity: 1,
    };
    updatedCompanies[companyIndex].branches[branchIndex].locations[
      locationIndex
    ].rooms.push(newRoom);
    setNewCompanies(updatedCompanies);
  };

  const updateRoom = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number,
    field: string,
    value: any
  ) => {
    const updatedCompanies = [...newCompanies];
    updatedCompanies[companyIndex].branches[branchIndex].locations[
      locationIndex
    ].rooms[roomIndex] = {
      ...updatedCompanies[companyIndex].branches[branchIndex].locations[
        locationIndex
      ].rooms[roomIndex],
      [field]: value,
    };
    setNewCompanies(updatedCompanies);
  };

  const removeRoom = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number
  ) => {
    const updatedCompanies = [...newCompanies];
    updatedCompanies[companyIndex].branches[branchIndex].locations[
      locationIndex
    ].rooms.splice(roomIndex, 1);
    setNewCompanies(updatedCompanies);
  };

  const toggleAmenity = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number,
    amenity: string
  ) => {
    const updatedCompanies = [...newCompanies];
    const room =
      updatedCompanies[companyIndex].branches[branchIndex].locations[
        locationIndex
      ].rooms[roomIndex];
    const amenityIndex = room.amenities.indexOf(amenity);

    if (amenityIndex > -1) {
      room.amenities.splice(amenityIndex, 1);
    } else {
      room.amenities.push(amenity);
    }

    setNewCompanies(updatedCompanies);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return newCompanies.every((company) => company.name.trim() !== "");
      case 2:
        return newCompanies.every(
          (company) =>
            company.branches.length > 0 &&
            company.branches.every(
              (branch) =>
                branch.name.trim() !== "" && branch.address.trim() !== ""
            )
        );
      case 3:
        return newCompanies.every((company) =>
          company.branches.every((branch) => branch.locations.length > 0)
        );
      case 4:
        return newCompanies.every((company) =>
          company.branches.every((branch) =>
            branch.locations.every((location) =>
              location.rooms.every(
                (room) =>
                  room.roomNumber.trim() !== "" &&
                  room.capacity > 0 &&
                  room.type &&
                  room.status
              )
            )
          )
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all steps before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!accessToken) {
      toast({
        title: "Authentication Error",
        description: "No access token found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const formattedData = newCompanies.map((company) => ({
      type: company.type,
      name: company.name,
      branches: company.branches.map((branch) => ({
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
      })),
    }));

    createCompanyMutation.mutate(formattedData);
  };

  const renderAddCompanyStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Company Information
              </h2>
              <p className="text-gray-600">Add your company details</p>
            </div>

            <div className="space-y-4">
              {newCompanies.map((company, companyIndex) => (
                <Card key={company._id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">
                      Company {companyIndex + 1}
                    </CardTitle>
                    {newCompanies.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompany(companyIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`company-name-${companyIndex}`}>
                        Company Name *
                      </Label>
                      <Input
                        id={`company-name-${companyIndex}`}
                        value={company.name}
                        onChange={(e) =>
                          updateCompany(companyIndex, "name", e.target.value)
                        }
                        placeholder="Enter company name"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{company.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addCompany}
                className="w-full border-dashed border-2 h-12 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Company
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Branch Information
              </h2>
              <p className="text-gray-600">Add branches for your companies</p>
            </div>

            <div className="space-y-6">
              {newCompanies.map((company, companyIndex) => (
                <Card key={company._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {company.branches.map((branch, branchIndex) => (
                      <Card
                        key={branch._id}
                        className="border-l-4 border-l-red-500"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-base">
                            Branch {branchIndex + 1}
                          </CardTitle>
                          {company.branches.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeBranch(companyIndex, branchIndex)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label
                              htmlFor={`branch-name-${companyIndex}-${branchIndex}`}
                            >
                              Branch Name *
                            </Label>
                            <Input
                              id={`branch-name-${companyIndex}-${branchIndex}`}
                              value={branch.name}
                              onChange={(e) =>
                                updateBranch(
                                  companyIndex,
                                  branchIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Enter branch name"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`branch-address-${companyIndex}-${branchIndex}`}
                            >
                              Branch Address *
                            </Label>
                            <Textarea
                              id={`branch-address-${companyIndex}-${branchIndex}`}
                              value={branch.address}
                              onChange={(e) =>
                                updateBranch(
                                  companyIndex,
                                  branchIndex,
                                  "address",
                                  e.target.value
                                )
                              }
                              placeholder="Enter complete branch address"
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => addBranch(companyIndex)}
                      className="w-full border-dashed border-2 h-12"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Branch
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Location Setup
              </h2>
              <p className="text-gray-600">
                Add locations within each branch (e.g., Floor 1, East Wing)
              </p>
            </div>

            <div className="space-y-6">
              {newCompanies.map((company, companyIndex) => (
                <Card key={company._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {company.branches.map((branch, branchIndex) => (
                      <Card
                        key={branch._id}
                        className="border-l-4 border-l-red-500"
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {branch.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {branch.locations.map((location, locationIndex) => (
                            <div key={location._id} className="flex gap-2">
                              <Input
                                value={location.name}
                                onChange={(e) =>
                                  updateLocation(
                                    companyIndex,
                                    branchIndex,
                                    locationIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Floor 1, East Wing, Reception"
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeLocation(
                                    companyIndex,
                                    branchIndex,
                                    locationIndex
                                  )
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                          <Button
                            variant="outline"
                            onClick={() =>
                              addLocation(companyIndex, branchIndex)
                            }
                            className="w-full border-dashed border-2 h-10"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Location
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Room Configuration
              </h2>
              <p className="text-gray-600">
                Set up rooms for each location with details and amenities
              </p>
            </div>

            <div className="space-y-6">
              {newCompanies.map((company, companyIndex) => (
                <Card key={company._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {company.branches.map((branch, branchIndex) => (
                      <Card
                        key={branch._id}
                        className="border-l-4 border-l-red-500"
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {branch.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {branch.locations.map((location, locationIndex) => (
                            <Card
                              key={location._id}
                              className="border-l-4 border-l-blue-500"
                            >
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Home className="h-4 w-4" />
                                  {location.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {location.rooms.map((room, roomIndex) => (
                                  <Card key={room._id} className="bg-gray-50">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                      <CardTitle className="text-sm">
                                        Room {roomIndex + 1}
                                      </CardTitle>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeRoom(
                                            companyIndex,
                                            branchIndex,
                                            locationIndex,
                                            roomIndex
                                          )
                                        }
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Room Number *</Label>
                                          <Input
                                            value={room.roomNumber}
                                            onChange={(e) =>
                                              updateRoom(
                                                companyIndex,
                                                branchIndex,
                                                locationIndex,
                                                roomIndex,
                                                "roomNumber",
                                                e.target.value
                                              )
                                            }
                                            placeholder="e.g., 101, A-1"
                                            className="mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label>Room Type *</Label>
                                          <Select
                                            value={room.type}
                                            onValueChange={(value) =>
                                              updateRoom(
                                                companyIndex,
                                                branchIndex,
                                                locationIndex,
                                                roomIndex,
                                                "type",
                                                value
                                              )
                                            }
                                          >
                                            <SelectTrigger className="mt-1">
                                              <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {Object.values(
                                                ROOM_PREFERENCE_TYPES
                                              ).map((type) => (
                                                <SelectItem
                                                  key={type}
                                                  value={type}
                                                >
                                                  {type}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 gap-4">
                                        <div>
                                          <Label>Capacity *</Label>
                                          <Input
                                            type="number"
                                            min="1"
                                            value={room.capacity}
                                            onChange={(e) =>
                                              updateRoom(
                                                companyIndex,
                                                branchIndex,
                                                locationIndex,
                                                roomIndex,
                                                "capacity",
                                                Number.parseInt(
                                                  e.target.value
                                                ) || 1
                                              )
                                            }
                                            placeholder="Number of people"
                                            className="mt-1"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <Label className="text-sm font-medium mb-3 block">
                                          Amenities
                                        </Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                          {ROOM_AMENITIES.map((amenity) => (
                                            <div
                                              key={amenity}
                                              className="flex items-center space-x-2"
                                            >
                                              <Checkbox
                                                id={`amenity-${companyIndex}-${branchIndex}-${locationIndex}-${roomIndex}-${amenity}`}
                                                checked={room.amenities.includes(
                                                  amenity
                                                )}
                                                onCheckedChange={() =>
                                                  toggleAmenity(
                                                    companyIndex,
                                                    branchIndex,
                                                    locationIndex,
                                                    roomIndex,
                                                    amenity
                                                  )
                                                }
                                              />
                                              <Label
                                                htmlFor={`amenity-${companyIndex}-${branchIndex}-${locationIndex}-${roomIndex}-${amenity}`}
                                                className="text-sm font-normal"
                                              >
                                                {amenity}
                                              </Label>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}

                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    addRoom(
                                      companyIndex,
                                      branchIndex,
                                      locationIndex
                                    )
                                  }
                                  className="w-full border-dashed border-2 h-10"
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Room
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Calculate totals for a company
  const getCompanyStats = (company: Company) => {
    const totalBranches = company.branches.length;
    const totalLocations = company.branches.reduce(
      (acc, branch) => acc + branch.locations.length,
      0
    );
    const totalRooms = company.branches.reduce(
      (acc, branch) =>
        acc +
        branch.locations.reduce(
          (locAcc, location) => locAcc + location.rooms.length,
          0
        ),
      0
    );
    const totalCapacity = company.branches.reduce(
      (acc, branch) =>
        acc +
        branch.locations.reduce(
          (locAcc, location) =>
            locAcc +
            location.rooms.reduce(
              (roomAcc, room) => roomAcc + room.capacity,
              0
            ),
          0
        ),
      0
    );

    return { totalBranches, totalLocations, totalRooms, totalCapacity };
  };

  // Handle view company
  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setViewModalOpen(true);
  };

  // Handle edit company
  const handleEditCompany = (company: Company) => {
    setEditingCompany({ ...company });
    setEditModalOpen(true);
  };

  // Handle delete company
  const handleDeleteCompany = (company: Company) => {
    setDeletingCompany(company);
    setDeleteDialogOpen(true);
  };

  // Save edited company
  const handleSaveEdit = async () => {
    if (!editingCompany) return;

    try {
      setCompanies(
        companies.map((c) =>
          c._id === editingCompany._id ? editingCompany : c
        )
      );
      setEditModalOpen(false);
      setEditingCompany(null);
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company",
        variant: "destructive",
      });
    }
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!deletingCompany || !user) return;

    deleteCompanyMutation(deletingCompany._id, {
      onSuccess: () => {
        const updatedCompanies = user.companies.filter(
          (c) => c._id !== deletingCompany._id
        );

        // ✅ Update local UI state
        setNewCompanies(updatedCompanies);

        // ✅ Update auth context and localStorage
        updateUserCompanies(updatedCompanies);

        setDeleteDialogOpen(false);
        setDeletingCompany(null);
        toast({
          title: "Success",
          description: "Company deleted successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete company",
          variant: "destructive",
        });
      },
    });
  };

  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editBranchData, setEditBranchData] = useState({
    name: "",
    address: "",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading companies...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Company Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your companies, branches, and locations
            </p>
          </div>
          {showAddCompanyButton && (
            <Button size="sm" onClick={() => setAddCompanyModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Companies Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Branches</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Total Rooms</TableHead>
                  <TableHead>Total Capacity</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => {
                  const stats = getCompanyStats(company);
                  return (
                    <TableRow key={company._id}>
                      <TableCell className="font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{stats.totalBranches}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {stats.totalLocations}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{stats.totalRooms}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{stats.totalCapacity}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(company.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewCompany(company)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCompany(company)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCompany(company)}
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Company Modal */}
        <Dialog
          open={addCompanyModalOpen}
          onOpenChange={setAddCompanyModalOpen}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Add New Company
              </DialogTitle>
            </DialogHeader>
            <div className="bg-white rounded-lg p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              {renderAddCompanyStepContent()}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !validateStep(currentStep) ||
                      createCompanyMutation.isPending
                    }
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                  >
                    {createCompanyMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Setting up...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Company Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {selectedCompany?.name} - Company Details
              </DialogTitle>
            </DialogHeader>
            {selectedCompany && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Company Name
                    </Label>
                    <p className="text-lg font-semibold">
                      {selectedCompany.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Created Date
                    </Label>
                    <p className="text-lg">
                      {new Date(selectedCompany.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Branches ({selectedCompany.branches.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedCompany.branches.map((branch) => (
                      <Card key={branch._id}>
                        <CardHeader className="pb-3 flex justify-between items-start">
                          <div className="flex items-center justify-between w-full">
                            <div>
                              {editingBranchId === branch._id ? (
                                <>
                                  <Input
                                    value={editBranchData.name}
                                    onChange={(e) =>
                                      setEditBranchData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                    className="mb-1"
                                  />
                                  <Input
                                    value={editBranchData.address}
                                    onChange={(e) =>
                                      setEditBranchData((prev) => ({
                                        ...prev,
                                        address: e.target.value,
                                      }))
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  <CardTitle className="text-lg">
                                    {branch.name}
                                  </CardTitle>
                                  <p className="text-gray-600">
                                    {branch.address}
                                  </p>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {editingBranchId === branch._id ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    updateBranchMutation.mutate(
                                      {
                                        branchId: branch._id,
                                        data: editBranchData,
                                      },
                                      {
                                        onSuccess: () => {
                                          toast({
                                            title:
                                              "Branch Updated successfully",
                                          });
                                          setSelectedCompany((prev) => {
                                            if (!prev) return prev;
                                            const updatedBranches =
                                              prev.branches.map((b) =>
                                                b._id === branch._id
                                                  ? { ...b, ...editBranchData }
                                                  : b
                                              );
                                            return {
                                              ...prev,
                                              branches: updatedBranches,
                                            };
                                          });
                                          setEditingBranchId(null);
                                        },
                                      }
                                    );
                                  }}
                                >
                                  Update
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingBranchId(branch._id);
                                    setEditBranchData({
                                      name: branch.name,
                                      address: branch.address,
                                    });
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                                onClick={async () => {
                                  setViewModalOpen(false);

                                  const result = await Swal.fire({
                                    title: "Are you sure?",
                                    text: `Delete branch "${branch.name}"?`,
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#d33",
                                    cancelButtonColor: "#3085d6",
                                    confirmButtonText: "Yes, delete it!",
                                    preConfirm: () => true,
                                  });

                                  if (result.isConfirmed) {
                                    setTimeout(() => {
                                      deleteBranchMutation.mutate(branch._id, {
                                        onSuccess: () => {
                                          toast({
                                            title: "Deleted successfully",
                                          });
                                          removeBranchFromCompany(
                                            selectedCompany._id,
                                            branch._id
                                          );
                                        },
                                        onError: () => {
                                          toast({
                                            title: "Error",
                                            description: `Failed to delete branch`,
                                            variant: "destructive",
                                          });
                                        },
                                      });
                                    }, 100);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                              <Home className="h-4 w-4" />
                              Locations ({branch.locations.length})
                            </h4>
                            {branch.locations.map((location) => (
                              <div
                                key={location._id}
                                className="ml-6 p-3 bg-gray-50 rounded-lg"
                              >
                                <h5 className="font-medium mb-2">
                                  {location.name}
                                </h5>
                                {location.rooms.length > 0 ? (
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                      Rooms ({location.rooms.length}):
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {location.rooms.map((room) => (
                                        <div
                                          key={room._id}
                                          className="p-2 bg-white rounded border"
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <p className="font-medium">
                                                Room {room.roomNumber}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {room.type}
                                              </p>
                                              <p className="text-sm flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                Capacity: {room.capacity}
                                              </p>
                                            </div>
                                          </div>
                                          {room.amenities.length > 0 && (
                                            <div className="mt-2">
                                              <p className="text-xs text-gray-500 mb-1">
                                                Amenities:
                                              </p>
                                              <div className="flex flex-wrap gap-1">
                                                {room.amenities.map(
                                                  (amenity) => (
                                                    <Badge
                                                      key={amenity}
                                                      variant="outline"
                                                      className="text-xs"
                                                    >
                                                      {amenity}
                                                    </Badge>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No rooms in this location
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Company Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
            </DialogHeader>
            {editingCompany && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={editingCompany.name}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                company "{deletingCompany?.name}" and all its branches,
                locations, and rooms.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
