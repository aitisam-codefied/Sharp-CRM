"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import api from "@/lib/axios";
import StepProgress from "./StepProgress";
import CompanyStep from "./CompanyStep";
import BranchStep from "./BranchStep";
import LocationStep from "./LocationStep";
import RoomStep from "./RoomStep";
import { ArrowLeft, ArrowRight, Building2, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

const COMPANY_BUSINESS_TYPES = {
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
  _id: string;
  roomNumber: string;
  type: string;
  status: string;
  amenities: string[];
  capacity: any;
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

export default function AddCompanyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const { user, updateUserCompanies } = useAuth();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [newCompanies, setNewCompanies] = useState<Company[]>([]);
  const totalSteps = 4;
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
        description: "Company created successfully!",
      });
      const newCompany = data.company;
      const updatedCompanies = [...(user?.companies || []), newCompany];
      updateUserCompanies(updatedCompanies);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      onClose();
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
    if (isOpen) {
      setNewCompanies([
        {
          _id: `temp-${Date.now()}`,
          name: "",
          type: COMPANY_BUSINESS_TYPES.MULTIPLE,
          branches: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setCurrentStep(1);
    }
  }, [isOpen]);

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
        return newCompanies.every(
          (company) => company.name.trim() !== "" && company.name.length <= 50
        );
      case 2:
        return newCompanies.every(
          (company) =>
            company.branches.length > 0 &&
            company.branches.every(
              (branch) =>
                branch.name.trim() !== "" &&
                branch.name.length <= 50 &&
                branch.address.trim() !== "" &&
                branch.address.length <= 100
            )
        );
      case 3:
        return newCompanies.every(
          (company) =>
            company.branches.every((branch) => branch.locations.length > 0) &&
            company.branches.every((branch) =>
              branch.locations.every(
                (location) =>
                  location.name.trim() !== "" && location.name.length <= 50
              )
            )
        );
      case 4:
        return newCompanies.every((company) =>
          company.branches.every((branch) =>
            branch.locations.every((location) =>
              location.rooms.every(
                (room) =>
                  room.roomNumber.trim() !== "" &&
                  room.roomNumber.length <= 10 &&
                  room.capacity > 0 &&
                  room.type &&
                  room.status &&
                  room.amenities.length > 0
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
            capacity: room.capacity,
            type: room.type,
            amenities: room.amenities.length > 0 ? room.amenities : [""],
          })),
        })),
      })),
    }));
    createCompanyMutation.mutate(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            Add New Company
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
          {currentStep === 1 && (
            <CompanyStep
              newCompanies={newCompanies}
              addCompany={addCompany}
              updateCompany={updateCompany}
              removeCompany={removeCompany}
            />
          )}
          {currentStep === 2 && (
            <BranchStep
              newCompanies={newCompanies}
              addBranch={addBranch}
              updateBranch={updateBranch}
              removeBranch={removeBranch}
            />
          )}
          {currentStep === 3 && (
            <LocationStep
              newCompanies={newCompanies}
              addLocation={addLocation}
              updateLocation={updateLocation}
              removeLocation={removeLocation}
            />
          )}
          {currentStep === 4 && (
            <RoomStep
              newCompanies={newCompanies}
              addRoom={addRoom}
              updateRoom={updateRoom}
              removeRoom={removeRoom}
              toggleAmenity={toggleAmenity}
            />
          )}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent text-sm sm:text-base h-10 sm:h-11"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-sm sm:text-base h-10 sm:h-11"
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
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-sm sm:text-base h-10 sm:h-11"
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
  );
}
