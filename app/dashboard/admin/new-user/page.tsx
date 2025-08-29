"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PersonalInfoForm from "@/components/SU-Registration/PersonalInfoForm";
import DependantsForm from "@/components/SU-Registration/DependantForm";
import axios from "axios";
import api from "@/lib/axios";
import EmergencyContactForm from "@/components/SU-Registration/EmergencyContactForm";
import MedicalDietaryForm from "@/components/SU-Registration/MedicalDietaryForm";
import DentalClinicForm from "@/components/SU-Registration/DentalClinicForm";
import ReviewConfirmationForm from "@/components/SU-Registration/ReviewConfirmationForm";
import { useCreateGuest } from "@/hooks/useCreateGuest";

// Guest Emergency Contact
interface EmergencyContact {
  fullName: string;
  relationship: string;
  phoneNumber: string;
}

// Document Upload (for signature / agreement)
interface UploadedFile {
  file: File; // In Next.js frontend this will be a File object
}

interface Medic {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
}

// Individual Guest inside guests array
interface Guest {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  dateOfBirth?: Date | string;
  gender?: "Male" | "Female" | "Other" | string;
  nationality?: string;
  language?: string;
  numberOfDependents?: number;
  medic?: string; // objectId
  address?: string;
  emergencyContact?: EmergencyContact;
  medicalCondition?: string;
  allergies?: string;
  currentMedications?: string;
  additionalNotes?: string;
  dietaryRequirements?: string[];
}

// Main Form Data Interface
export interface CreateGuestForm {
  branchId: string; // objectId
  locations: string[]; // objectId[]
  assignedRooms: string[]; // objectId[]
  medic?: string; // objectId
  emergencyContact?: EmergencyContact;
  occupancyAgreement: any;
  signature: any;
  areThereMultipleGuests?: boolean;
  consentAccuracy: boolean;
  consentDataProcessing: boolean;
  guests: Guest[];
  numKids?: number;
  hasKids?: boolean;
  sameEmergencyContact?: boolean;
  occupancy?: boolean;
  sameMedic?: boolean;
  roomRequirement?: number;
}

export default function NewUserPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateGuestForm>({
    branchId: "",
    locations: [],
    assignedRooms: [],
    medic: "",
    emergencyContact: {
      fullName: "",
      relationship: "",
      phoneNumber: "",
    },
    occupancyAgreement: null as File | null,
    signature: null as File | null,
    areThereMultipleGuests: false,
    consentAccuracy: false,
    consentDataProcessing: false,
    sameEmergencyContact: false,
    occupancy: false,
    guests: [
      {
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        language: "",
        numberOfDependents: 0,
        medic: "",
        address: "",
        emergencyContact: {
          fullName: "",
          relationship: "",
          phoneNumber: "",
        },
        medicalCondition: "",
        allergies: "",
        currentMedications: "",
        additionalNotes: "",
        dietaryRequirements: [],
      },
    ],
  });
  const [rooms, setRooms] = useState<any[]>([]); // State to store API rooms
  const { toast } = useToast();

  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Basic personal details",
    },
    {
      id: 2,
      title: "Dependants Info",
      description: "Dependants details and rooms",
    },
    {
      id: 3,
      title: "Emergency Contact Info",
      description: "Emergency contact details",
    },
    {
      id: 4,
      title: "Medical & Dietary",
      description: "Health and dietary requirements",
    },
    {
      id: 5,
      title: "Dental Clinic Info",
      description: "Dental clinic preferences",
    },
    {
      id: 6,
      title: "Review And Confirmation",
      description: "Final review and Confirmation",
    },
  ];

  const isStep1Valid = () => {
    return (
      formData.guests[0].fullName?.trim() &&
      formData.guests[0].dateOfBirth &&
      formData.guests[0].nationality?.trim() &&
      formData.guests[0].numberOfDependents !== undefined &&
      formData.branchId?.trim()
    );
  };

  const isStep2Valid = () => {
    const dependants = formData.guests[0].numberOfDependents || 0;
    const totalPeople = Number(dependants) + 1;

    // if (
    //   dependants > 0 &&
    //   (!Array.isArray(formData.guests[0].numberOfDependents) ||
    //     !formData.guests[0].numberOfDependents.every(
    //       (dep: any) =>
    //         dep?.fullName?.trim() &&
    //         dep?.dateOfBirth?.trim() &&
    //         dep?.nationality?.trim()
    //     ))
    // ) {
    //   console.log("Dependants validation failed");
    //   return false;
    // }

    if (!formData.assignedRooms) {
      console.log("Room assignments missing");
      return false;
    }
    let totalAssigned = 0;
    for (const roomId in formData.assignedRooms) {
      const assigned = Number(formData.assignedRooms[roomId]) || 0;
      console.log("assigned", assigned);
      const room = rooms.find((r) => r.id === roomId);
      if (room && assigned > room.availableSpace) {
        console.log(`Room ${roomId} over capacity`);
        return false;
      }
      totalAssigned += assigned;
    }
    console.log("Total assigned:", totalAssigned, "Total people:", totalPeople);
    return totalAssigned === totalPeople;
  };

  // const isStep3Valid = () => {
  //   const numDep = formData.guests[0].numberOfDependents || 0;
  //   const total = numDep + 1;
  //   if (numDep === 0 || formData.sameEmergencyContact) {
  //     const ec = formData.emergencyContact;
  //     return (
  //       ec?.fullName?.trim() &&
  //       ec.phoneNumber?.trim() &&
  //       ec.relationship?.trim()
  //     );
  //   } else {
  //     const ecs = formData.guests || [];
  //     if (ecs.length !== total) return false;
  //     return ecs.every(
  //       (ec: any) =>
  //         ec.emergencyContact.fullName?.trim() &&
  //         ec.emergencyContact.phoneNumber?.trim() &&
  //         ec.emergencyContact.relationship?.trim()
  //     );
  //   }
  // };

  // const isStep5Valid = () => {
  //   const numDep = parseInt(formData.numDependants || 0);
  //   const total = numDep + 1;
  //   if (numDep === 0 || formData.sameDentalClinic) {
  //     const dc = formData.dentalClinic || {};
  //     return dc.name?.trim() && dc.phone?.trim() && dc.email?.trim();
  //   } else {
  //     const dcs = formData.dentalClinics || [];
  //     if (dcs.length !== total) return false;
  //     return dcs.every(
  //       (dc: any) => dc.name?.trim() && dc.phone?.trim() && dc.email?.trim()
  //     );
  //   }
  // };

  const isStep6Valid = () => {
    return (
      formData.consentAccuracy &&
      formData.consentDataProcessing &&
      !!formData.signature
    );
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return isStep6Valid();
      default:
        return true; // For unimplemented steps
    }
  };

  const handleNext = async () => {
    if (!isCurrentStepValid()) return;

    if (currentStep === 1) {
      try {
        const capacity =
          parseInt(String(formData?.guests[0]?.numberOfDependents ?? "0"), 10) +
          1;
        const kids = formData.numKids || 0;
        const branchId = formData.branchId;

        const response = await api.get("/guest/rooms/capacity", {
          params: { capacity, kids, branchId },
        });

        if (response.data.success) {
          setRooms(response.data.data);

          // Extract locationIds from response
          const locationId = response.data.data.map(
            (room: any) => room.locationId
          );

          setFormData((prev: any) => ({
            ...prev,
            locations: locationId, // array of string
          }));
          setCurrentStep(currentStep + 1);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch rooms. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching rooms.",
          variant: "destructive",
        });
      }
    } else if (currentStep < steps.length) {
      console.log("formData", formData);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Move this hook to the top-level of your component (not inside handleSubmit)
  const createGuestMutation = useCreateGuest();

  const handleSubmit = () => {
    // Deep clone and clean data
    let cleanedData = structuredClone(formData);

    // 1. assignedRooms ko object → array of keys
    if (
      cleanedData.assignedRooms &&
      typeof cleanedData.assignedRooms === "object"
    ) {
      cleanedData.assignedRooms = Object.keys(cleanedData.assignedRooms);
    }

    // 2. Remove extra fields
    delete cleanedData?.hasKids;
    delete cleanedData?.numKids;
    delete cleanedData?.occupancy;
    delete cleanedData?.sameEmergencyContact;
    delete cleanedData?.sameMedic;
    delete cleanedData?.roomRequirement;

    // 3. Remove empty objects (recursive)
    const removeEmptyObjects = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj
          .map(removeEmptyObjects)
          .filter(
            (item) =>
              !(
                typeof item === "object" &&
                !Array.isArray(item) &&
                Object.keys(item).length === 0
              )
          );
      } else if (typeof obj === "object" && obj !== null) {
        const newObj: any = {};
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === "object") {
            const cleanedValue = removeEmptyObjects(value);
            if (
              !(
                typeof cleanedValue === "object" &&
                Object.keys(cleanedValue).length === 0
              )
            ) {
              newObj[key] = cleanedValue;
            }
          } else if (value !== "" && value !== null && value !== undefined) {
            newObj[key] = value;
          }
        });
        return newObj;
      }
      return obj;
    };

    cleanedData = removeEmptyObjects(cleanedData);

    console.log("📤 Final cleaned data", cleanedData);

    // Prepare FormData with flattened fields
    const apiFormData = new FormData();

    // Append files
    if (cleanedData.occupancyAgreement) {
      apiFormData.append("occupancyAgreement", cleanedData.occupancyAgreement);
    }
    if (cleanedData.signature) {
      apiFormData.append("signature", cleanedData.signature);
    }

    // Append simple fields
    apiFormData.append("branchId", cleanedData.branchId || "");
    if (cleanedData.medic) {
      apiFormData.append("medic", cleanedData.medic || "");
    }
    apiFormData.append(
      "consentAccuracy",
      String(cleanedData.consentAccuracy || false)
    );
    apiFormData.append(
      "consentDataProcessing",
      String(cleanedData.consentDataProcessing || false)
    );
    apiFormData.append(
      "areThereMultipleGuests",
      String(cleanedData.areThereMultipleGuests || false)
    );

    // Append assignedRooms as an array
    (cleanedData.assignedRooms || []).forEach(
      (roomId: string, index: number) => {
        apiFormData.append(`assignedRooms[${index}]`, roomId);
      }
    );

    // ✅ Sirf assignedRooms ke locationIds lo
    const selectedLocationIds = (rooms || [])
      .filter((room: any) => cleanedData.assignedRooms.includes(room.id))
      .map((room: any) => room.locationId);

    selectedLocationIds.forEach((locId: string, index: number) => {
      apiFormData.append(`locations[${index}]`, locId);
    });

    // Append emergencyContact fields
    if (cleanedData.emergencyContact) {
      apiFormData.append(
        "emergencyContact[fullName]",
        cleanedData.emergencyContact.fullName || ""
      );
      apiFormData.append(
        "emergencyContact[phoneNumber]",
        cleanedData.emergencyContact.phoneNumber || ""
      );
      apiFormData.append(
        "emergencyContact[relationship]",
        cleanedData.emergencyContact.relationship || ""
      );
    }

    // Append guests array with nested fields
    (cleanedData.guests || []).forEach((guest: Guest, index: number) => {
      apiFormData.append(`guests[${index}][fullName]`, guest.fullName || "");
      apiFormData.append(
        `guests[${index}][emailAddress]`,
        guest.emailAddress || ""
      );
      apiFormData.append(
        `guests[${index}][phoneNumber]`,
        guest.phoneNumber || ""
      );
      apiFormData.append(
        `guests[${index}][dateOfBirth]`,
        guest.dateOfBirth || ""
      );
      apiFormData.append(`guests[${index}][gender]`, guest.gender || "");
      apiFormData.append(
        `guests[${index}][nationality]`,
        guest.nationality || ""
      );
      apiFormData.append(`guests[${index}][language]`, guest.language || "");
      apiFormData.append(
        `guests[${index}][numberOfDependents]`,
        String(guest.numberOfDependents || 0)
      );
      apiFormData.append(`guests[${index}][medic]`, guest.medic || "");
      apiFormData.append(`guests[${index}][address]`, guest.address || "");
      apiFormData.append(
        `guests[${index}][medicalCondition]`,
        guest.medicalCondition || ""
      );
      apiFormData.append(`guests[${index}][allergies]`, guest.allergies || "");
      apiFormData.append(
        `guests[${index}][currentMedications]`,
        guest.currentMedications || ""
      );
      apiFormData.append(
        `guests[${index}][additionalNotes]`,
        guest.additionalNotes || ""
      );

      // Append dietaryRequirements as an array
      (guest.dietaryRequirements || []).forEach(
        (req: string, reqIndex: number) => {
          apiFormData.append(
            `guests[${index}][dietaryRequirements][${reqIndex}]`,
            req
          );
        }
      );

      // Append emergencyContact for each guest
      if (guest.emergencyContact) {
        apiFormData.append(
          `guests[${index}][emergencyContact][fullName]`,
          guest.emergencyContact.fullName || ""
        );
        apiFormData.append(
          `guests[${index}][emergencyContact][phoneNumber]`,
          guest.emergencyContact.phoneNumber || ""
        );
        apiFormData.append(
          `guests[${index}][emergencyContact][relationship]`,
          guest.emergencyContact.relationship || ""
        );
      }
    });

    // Call API via mutation
    createGuestMutation.mutate(apiFormData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm formData={formData} setFormData={setFormData} />
        );
      case 2:
        return (
          <DependantsForm
            formData={formData}
            setFormData={setFormData}
            rooms={rooms}
          />
        );
      case 3:
        return (
          <EmergencyContactForm formData={formData} setFormData={setFormData} />
        );
      case 4:
        return (
          <MedicalDietaryForm formData={formData} setFormData={setFormData} />
        );
      case 5:
        return (
          <DentalClinicForm formData={formData} setFormData={setFormData} />
        );
      case 6:
        return (
          <ReviewConfirmationForm
            formData={formData}
            setFormData={setFormData}
            rooms={rooms}
          />
        );
      default:
        return <div />;
    }
  };

  return (
    <DashboardLayout
      title="New Service User Registration"
      description="Complete registration process for new service users"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Registration Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-8 overflow-x-auto px-2">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium transition-all ${
                          isActive
                            ? "bg-red-400 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {String(step.id).padStart(2, "0")}
                      </div>
                      <span
                        className={`text-xs mt-2 text-center whitespace-nowrap ${
                          isActive
                            ? "text-red-400 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-10 h-0.5 bg-gray-300 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit} disabled={!isCurrentStepValid()}>
                <Send className="h-4 w-4 mr-2" />
                Complete Registration
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!isCurrentStepValid()}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
