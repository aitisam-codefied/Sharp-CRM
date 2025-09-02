"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import api from "@/lib/axios";
import BusinessTypeStep from "../../../../components/onBoarding/BusinessTypeStep";
import CompanyInfoStep from "../../../../components/onBoarding/CompanyInfoStep";
import BranchInfoStep from "../../../../components/onBoarding/BranchInfoStep";
import LocationSetupStep from "../../../../components/onBoarding/LocationSetupStep";
import RoomConfigStep from "../../../../components/onBoarding/RoomConfigStep";

export const COMPANY_BUSINESS_TYPES = {
  SINGLE: "Single",
  FRANCHISE: "Franchise",
  MULTIPLE: "Multiple",
};

export const ROOM_PREFERENCE_TYPES = {
  SINGLE: "Single Room (Capacity 1)",
  DOUBLE: "Double Room (Capacity 2)",
  TWIN: "Twin Room (Capacity 2 - 2 single beds)",
  TRIPLE: "Triple Room (Capacity 3)",
  QUAD: "Quad Room (Capacity 4)",
  QUINTUPLE: "Quintuple Room (Capacity 5)",
};

export const ROOM_STATUS_TYPES = {
  OCCUPIED: "Occupied",
  VACANT: "Vacant",
  MAINTENANCE: "Maintenance",
};

export const ROOM_AMENITIES = [
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
  capacity: any;
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

export interface Company {
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
              capacity: 1,
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, updateUserCompanies } = useAuth();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const accessToken = localStorage.getItem("sms_access_token");

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
        description: "Company setup completed successfully!",
      });

      const newCompany = data.company;
      updateUserCompanies(newCompany);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.push("/dashboard/admin");
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
    if (
      selectedBusinessType === COMPANY_BUSINESS_TYPES.SINGLE &&
      updatedCompanies[companyIndex].branches.length >= 1
    ) {
      toast({
        title: "Limit Reached",
        description: "Single company type can only have one branch.",
        variant: "destructive",
      });
      return;
    }
    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      name: "",
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
        return companies.every((company) => {
          if (company.type === COMPANY_BUSINESS_TYPES.SINGLE) {
            return (
              company.branches.length === 1 &&
              company.branches.every(
                (branch) =>
                  branch.name.trim() !== "" && branch.address.trim() !== ""
              )
            );
          }
          const branchNames = company.branches.map((b) =>
            b.name.trim().toLowerCase()
          );
          const uniqueBranches =
            new Set(branchNames).size === branchNames.length;
          return (
            company.branches.length > 0 &&
            company.branches.every(
              (branch) =>
                branch.name.trim() !== "" && branch.address.trim() !== ""
            ) &&
            uniqueBranches
          );
        });
      case 4:
        return companies.every((company) =>
          company.branches.every((branch) => {
            const locationNames = branch.locations.map((l) =>
              l.name.trim().toLowerCase()
            );
            const uniqueLocations =
              new Set(locationNames).size === locationNames.length;
            return (
              branch.locations.length > 0 &&
              branch.locations.every(
                (location) => location.name.trim() !== ""
              ) &&
              uniqueLocations
            );
          })
        );
      case 5:
        return companies.every((company) =>
          company.branches.every((branch) =>
            branch.locations.every((location) => {
              const roomNumbers = location.rooms.map((r) =>
                r.roomNumber.trim().toLowerCase()
              );
              const uniqueRooms =
                new Set(roomNumbers).size === roomNumbers.length;
              return (
                location.rooms.every(
                  (room) =>
                    room.roomNumber.trim() !== "" &&
                    room.capacity > 0 &&
                    // room.price >= 0 &&
                    room.type &&
                    room.status
                ) && uniqueRooms
              );
            })
          )
        );
      default:
        return false;
    }
  };

  // const validateStep = (step: number) => {
  //   switch (step) {
  //     case 1:
  //       return selectedBusinessType !== "";
  //     case 2:
  //       return companies.every((company) => company.name.trim() !== "");
  //     case 3:
  //       return companies.every((company) => {
  //         if (company.type === COMPANY_BUSINESS_TYPES.SINGLE) {
  //           return (
  //             company.branches.length === 1 &&
  //             company.branches.every(
  //               (branch) =>
  //                 branch.name.trim() !== "" && branch.address.trim() !== ""
  //             )
  //           );
  //         }
  //         return (
  //           company.branches.length > 0 &&
  //           company.branches.every(
  //             (branch) =>
  //               branch.name.trim() !== "" && branch.address.trim() !== ""
  //           )
  //         );
  //       });
  //     case 4:
  //       return companies.every((company) =>
  //         company.branches.every((branch) => branch.locations.length > 0)
  //       );
  //     case 5:
  //       return companies.every((company) =>
  //         company.branches.every((branch) =>
  //           branch.locations.every((location) =>
  //             location.rooms.every(
  //               (room) =>
  //                 room.roomNumber.trim() !== "" &&
  //                 room.capacity > 0 &&
  //                 room.price >= 0 &&
  //                 room.type &&
  //                 room.status
  //             )
  //           )
  //         )
  //       );
  //     default:
  //       return false;
  //   }
  // };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Incomplete Information",
        description:
          "Please fill in all required fields and ensure no duplicates before proceeding.",
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
        description:
          "Please complete all steps and ensure no duplicates before submitting.",
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
      router.push("/login");
      return;
    }

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

    createCompanyMutation.mutate(formattedData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessTypeStep
            selectedBusinessType={selectedBusinessType}
            setSelectedBusinessType={setSelectedBusinessType}
          />
        );
      case 2:
        return (
          <CompanyInfoStep
            companies={companies}
            selectedBusinessType={selectedBusinessType}
            addCompany={addCompany}
            updateCompany={updateCompany}
            removeCompany={removeCompany}
          />
        );
      case 3:
        return (
          <BranchInfoStep
            companies={companies}
            selectedBusinessType={selectedBusinessType}
            addBranch={addBranch}
            updateBranch={updateBranch}
            removeBranch={removeBranch}
          />
        );
      case 4:
        return (
          <LocationSetupStep
            companies={companies}
            addLocation={addLocation}
            updateLocation={updateLocation}
            removeLocation={removeLocation}
          />
        );
      case 5:
        return (
          <RoomConfigStep
            companies={companies}
            addRoom={addRoom}
            updateRoom={updateRoom}
            removeRoom={removeRoom}
            toggleAmenity={toggleAmenity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderStepContent()}
        </div>

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
                !validateStep(currentStep) || createCompanyMutation.isPending
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
    </div>
  );
}
