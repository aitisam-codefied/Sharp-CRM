"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  Briefcase,
  Bed,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  status: string;
  amenities: string[];
  capacity: number;
  price: number;
}

interface Location {
  id: string;
  name: string;
  rooms: Room[];
}

interface Branch {
  id: string;
  name: string;
  address: string;
  locations: Location[];
}

interface Company {
  name: string;
  type: string;
  branches: Branch[];
}

export const OnBoardingFormValues = {
  type: "",
  name: "",
  branches: [
    {
      name: "",
      address: "",
      locations: [
        {
          name: "",
          rooms: [
            {
              roomNumber: "",
              type: "",
              capacity: 0,
              amenities: [""],
            },
          ],
        },
      ],
    },
  ],
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (selectedBusinessType) {
      if (selectedBusinessType === COMPANY_BUSINESS_TYPES.SINGLE) {
        setCompanies([
          {
            name: "",
            type: selectedBusinessType,
            branches: [
              {
                id: "branch-1",
                name: "",
                address: "",
                locations: [],
              },
            ],
          },
        ]);
      } else {
        setCompanies([
          {
            name: "",
            type: selectedBusinessType,
            branches: [],
          },
        ]);
      }
    }
  }, [selectedBusinessType]);

  const addCompany = () => {
    const newCompany: Company = {
      name: "",
      type: selectedBusinessType,
      branches: [],
    };
    setCompanies([...companies, newCompany]);
  };

  const updateCompany = (index: number, field: string, value: string) => {
    const updatedCompanies = [...companies];
    updatedCompanies[index] = { ...updatedCompanies[index], [field]: value };
    setCompanies(updatedCompanies);
  };

  const removeCompany = (index: number) => {
    if (companies.length > 1) {
      const updatedCompanies = companies.filter((_, i) => i !== index);
      setCompanies(updatedCompanies);
    }
  };

  const addBranch = (companyIndex: number) => {
    const updatedCompanies = [...companies];
    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      name:
        selectedBusinessType === COMPANY_BUSINESS_TYPES.FRANCHISE
          ? updatedCompanies[companyIndex].name
          : "",
      address: "",
      locations: [],
    };
    updatedCompanies[companyIndex].branches.push(newBranch);
    setCompanies(updatedCompanies);
  };

  const updateBranch = (
    companyIndex: number,
    branchIndex: number,
    field: string,
    value: string
  ) => {
    const updatedCompanies = [...companies];
    updatedCompanies[companyIndex].branches[branchIndex] = {
      ...updatedCompanies[companyIndex].branches[branchIndex],
      [field]: value,
    };
    setCompanies(updatedCompanies);
  };

  const removeBranch = (companyIndex: number, branchIndex: number) => {
    const updatedCompanies = [...companies];
    if (updatedCompanies[companyIndex].branches.length > 1) {
      updatedCompanies[companyIndex].branches.splice(branchIndex, 1);
      setCompanies(updatedCompanies);
    }
  };

  const addLocation = (companyIndex: number, branchIndex: number) => {
    const updatedCompanies = [...companies];
    const newLocation: Location = {
      id: `location-${Date.now()}`,
      name: "",
      rooms: [],
    };
    updatedCompanies[companyIndex].branches[branchIndex].locations.push(
      newLocation
    );
    setCompanies(updatedCompanies);
  };

  const updateLocation = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    value: string
  ) => {
    const updatedCompanies = [...companies];
    updatedCompanies[companyIndex].branches[branchIndex].locations[
      locationIndex
    ].name = value;
    setCompanies(updatedCompanies);
  };

  const removeLocation = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number
  ) => {
    const updatedCompanies = [...companies];
    updatedCompanies[companyIndex].branches[branchIndex].locations.splice(
      locationIndex,
      1
    );
    setCompanies(updatedCompanies);
  };

  const addRoom = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number
  ) => {
    const updatedCompanies = [...companies];
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      roomNumber: "",
      type: ROOM_PREFERENCE_TYPES.SINGLE,
      status: ROOM_STATUS_TYPES.VACANT,
      amenities: [],
      capacity: 1,
      price: 0,
    };
    updatedCompanies[companyIndex].branches[branchIndex].locations[
      locationIndex
    ].rooms.push(newRoom);
    setCompanies(updatedCompanies);
  };

  const updateRoom = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number,
    field: string,
    value: any
  ) => {
    const updatedCompanies = [...companies];
    updatedCompanies[companyIndex].branches[branchIndex].locations[
      locationIndex
    ].rooms[roomIndex] = {
      ...updatedCompanies[companyIndex].branches[branchIndex].locations[
        locationIndex
      ].rooms[roomIndex],
      [field]: value,
    };
    setCompanies(updatedCompanies);
  };

  const removeRoom = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number
  ) => {
    const updatedCompanies = [...companies];
    updatedCompanies[companyIndex].branches[branchIndex].locations[
      locationIndex
    ].rooms.splice(roomIndex, 1);
    setCompanies(updatedCompanies);
  };

  const toggleAmenity = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number,
    amenity: string
  ) => {
    const updatedCompanies = [...companies];
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

    setCompanies(updatedCompanies);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedBusinessType !== "";
      case 2:
        return companies.every((company) => company.name.trim() !== "");
      case 3:
        return companies.every(
          (company) =>
            company.branches.length > 0 &&
            company.branches.every(
              (branch) =>
                branch.name.trim() !== "" && branch.address.trim() !== ""
            )
        );
      case 4:
        return companies.every((company) =>
          company.branches.every((branch) => branch.locations.length > 0)
        );
      case 5:
        return companies.every((company) =>
          company.branches.every((branch) =>
            branch.locations.every((location) =>
              location.rooms.every(
                (room) =>
                  room.roomNumber.trim() !== "" &&
                  room.capacity > 0 &&
                  room.price >= 0 &&
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
    if (!validateStep(5)) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all steps before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Transform companies data to match OnBoardingFormValues format
    const formattedData = companies.map((company) => ({
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

    // Log the formatted data to console
    console.log(
      "Onboarding Form Data:",
      JSON.stringify(formattedData, null, 2)
    );

    // Simulate API call delay (optional, for UX)
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard/admin");
    }, 1000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Business Type
              </h2>
              <p className="text-gray-600">
                Select the type that best describes your business structure
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(COMPANY_BUSINESS_TYPES).map(([key, value]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBusinessType === value
                      ? "ring-2 ring-red-500 bg-red-50"
                      : ""
                  }`}
                  onClick={() => setSelectedBusinessType(value)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="h-6 w-6 text-red-500" />
                    </div>
                    <h3 className="font-semibold mb-2">{value}</h3>
                    <p className="text-sm text-gray-600">
                      {key === "SINGLE" && "One company with one branch"}
                      {key === "FRANCHISE" &&
                        "One company with multiple branches (same name)"}
                      {key === "MULTIPLE" &&
                        "Multiple companies with different branches"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Company Information
              </h2>
              <p className="text-gray-600">
                {selectedBusinessType === COMPANY_BUSINESS_TYPES.MULTIPLE
                  ? "Add your companies"
                  : "Enter your company details"}
              </p>
            </div>

            <div className="space-y-4">
              {companies.map((company, companyIndex) => (
                <Card key={companyIndex}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">
                      {selectedBusinessType === COMPANY_BUSINESS_TYPES.MULTIPLE
                        ? `Company ${companyIndex + 1}`
                        : "Company Details"}
                    </CardTitle>
                    {selectedBusinessType === COMPANY_BUSINESS_TYPES.MULTIPLE &&
                      companies.length > 1 && (
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

              {selectedBusinessType === COMPANY_BUSINESS_TYPES.MULTIPLE && (
                <Button
                  variant="outline"
                  onClick={addCompany}
                  className="w-full border-dashed border-2 h-12 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Company
                </Button>
              )}
            </div>
          </div>
        );

      case 3:
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
              {companies.map((company, companyIndex) => (
                <Card key={companyIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {company.branches.map((branch, branchIndex) => (
                      <Card
                        key={branch.id}
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
                              placeholder={
                                selectedBusinessType ===
                                COMPANY_BUSINESS_TYPES.FRANCHISE
                                  ? company.name
                                  : "Enter branch name"
                              }
                              disabled={
                                selectedBusinessType ===
                                COMPANY_BUSINESS_TYPES.FRANCHISE
                              }
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

      case 4:
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
              {companies.map((company, companyIndex) => (
                <Card key={companyIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {company.branches.map((branch, branchIndex) => (
                      <Card
                        key={branch.id}
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
                            <div key={location.id} className="flex gap-2">
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

      case 5:
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
              {companies.map((company, companyIndex) => (
                <Card key={companyIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {company.branches.map((branch, branchIndex) => (
                      <Card
                        key={branch.id}
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
                              key={location.id}
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
                                  <Card key={room.id} className="bg-gray-50">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-pink-500">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sharp MS Setup
              </h1>
              <p className="text-gray-600">
                Let's get your management system configured
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
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
              disabled={!validateStep(currentStep) || isLoading}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
            >
              {isLoading ? (
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
    </div>
  );
}
