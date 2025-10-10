"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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
import api from "@/lib/axios";
import { useCreateGuest } from "@/hooks/useCreateGuest";

// Dynamic imports to prevent SSR issues with browser-only libraries
const PersonalInfoForm = dynamic(() => import("@/components/SU-Registration/PersonalInfoForm"), { ssr: false });
const DependantsForm = dynamic(() => import("@/components/SU-Registration/DependantForm"), { ssr: false });
const EmergencyContactForm = dynamic(() => import("@/components/SU-Registration/EmergencyContactForm"), { ssr: false });
const MedicalDietaryForm = dynamic(() => import("@/components/SU-Registration/MedicalDietaryForm"), { ssr: false });
const DentalClinicForm = dynamic(() => import("@/components/SU-Registration/DentalClinicForm"), { ssr: false });
const ReviewConfirmationForm = dynamic(() => import("@/components/SU-Registration/ReviewConfirmationForm"), { ssr: false });

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
  isKid: boolean;
  dateOfBirth?: Date | string;
  gender?: "Male" | "Female" | "Other" | string;
  nationality?: string;
  language?: string;
  portNumber?: string;
  numberOfDependents?: any;
  medic?: string; // objectId
  dentist?: string;
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
  dentist?: string; // objectId
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
  sameDentist?: boolean;
  roomRequirement?: number;
}

// Safe phone validation wrapper
const isValidPhoneNumber = (phone: string) => {
  if (typeof window === 'undefined') return true; // Skip validation during SSR
  try {
    const { isValidPhoneNumber: validate } = require('react-phone-number-input');
    return validate(phone);
  } catch {
    return true; // If library fails to load, don't block validation
  }
};

export default function NewUserPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<CreateGuestForm>({
    branchId: "",
    locations: [],
    assignedRooms: [],
    medic: "",
    dentist: "",
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
    sameDentist: false,
    sameMedic: false,
    guests: [
      {
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        dateOfBirth: "",
        isKid: false,
        gender: "",
        nationality: "",
        language: "",
        portNumber: "",
        numberOfDependents: "",
        medic: "",
        dentist: "",
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
  const [medicalErrors, setMedicalErrors] = useState<Record<string, string>>(
    {}
  );

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
      title: "Assign Medical & Dental Staff",
      description: "Assign medical and dental staff",
    },
    {
      id: 6,
      title: "Review And Confirmation",
      description: "Final review and Confirmation",
    },
  ];

  const isStep1Valid = () => {
    const dep = formData.guests[0].numberOfDependents;

    const isDependantValid =
      dep !== undefined &&
      dep !== null &&
      String(dep).trim() !== "" && // user ne input kiya ho
      !isNaN(Number(dep)) && // number ho
      Number(dep) >= 0; // 0 ya upar

    return (
      formData.guests[0].fullName?.trim() &&
      formData.guests[0].fullName.length <= 20 &&
      formData.guests[0].emailAddress?.trim() &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.guests[0].emailAddress
      ) &&
      formData.guests[0].phoneNumber?.trim() &&
      isValidPhoneNumber(formData.guests[0].phoneNumber) &&
      formData.guests[0].dateOfBirth &&
      formData.guests[0].gender?.trim() &&
      formData.guests[0].language?.trim() &&
      formData.guests[0].nationality?.trim() &&
      (!formData.guests[0].address ||
        formData.guests[0].address.length <= 150) &&
      formData.guests[0].portNumber?.trim() && // portNumber required
      formData.guests[0].portNumber.length >= 12 && // min 12 characters
      formData.guests[0].portNumber.length <= 55 && // max 55 characters
      // formData.guests[0].additionalNotes?.trim() &&
      // formData.guests[0].additionalNotes.length <= 150 &&
      isDependantValid && // ✅ yahan enforce hoga
      formData.branchId?.trim()
    );
  };

  const isStep2Valid = () => {
    const dependants = formData.guests[0]?.numberOfDependents || 0;
    const totalPeople = Number(dependants) + 1;

    // ✅ Validate all dependents
    if (dependants > 0) {
      for (let i = 1; i <= dependants; i++) {
        const dep = formData.guests[i];

        if (
          !dep?.fullName?.trim() ||
          dep.fullName.length > 20 ||
          !dep?.phoneNumber?.trim() ||
          isValidPhoneNumber(dep.phoneNumber) === false ||
          !dep?.emailAddress?.trim() ||
          !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(dep.emailAddress) ||
          !dep?.dateOfBirth ||
          !dep?.portNumber?.trim() ||
          dep.portNumber.length < 12 ||
          dep.portNumber.length > 55 ||
          !dep?.nationality?.trim() ||
          (dep.address && dep.address.length > 150) ||
          (dep.additionalNotes && dep.additionalNotes.length > 150)
        ) {
          return false;
        }
      }
    }

    // ✅ Validate room assignments
    if (!formData.assignedRooms) return false;

    let totalAssigned = 0;
    let hasError = false;

    for (const roomId in formData.assignedRooms) {
      const assigned = Number(formData.assignedRooms[roomId]) || 0;
      const room = rooms.find((r) => r.id === roomId);

      if (!room) {
        // 🧹 If room no longer exists (e.g., branch changed), skip it
        continue;
      }

      if (assigned > room.availableSpace) {
        hasError = true;
        break;
      }

      totalAssigned += assigned;
    }

    // ✅ If no valid rooms or mismatch, it's invalid
    if (hasError || totalAssigned === 0) return false;

    // ✅ Must exactly match total people
    return totalAssigned === totalPeople;
  };

  // const isStep2Valid = () => {
  //   const dependants = formData.guests[0].numberOfDependents || 0;
  //   const totalPeople = Number(dependants) + 1;

  //   if (dependants > 0) {
  //     for (let i = 1; i <= dependants; i++) {
  //       const dep = formData.guests[i];

  //       if (
  //         !dep?.fullName?.trim() ||
  //         dep.fullName.length > 20 ||
  //         !dep?.phoneNumber?.trim() ||
  //         isValidPhoneNumber(dep.phoneNumber) === false ||
  //         !dep?.emailAddress?.trim() ||
  //         !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(dep.emailAddress) || // ✅ email regex
  //         !dep?.dateOfBirth ||
  //         !dep?.portNumber?.trim() ||
  //         dep.portNumber.length < 12 ||
  //         dep.portNumber.length > 55 ||
  //         !dep?.nationality?.trim() ||
  //         (dep.address && dep.address.length > 150) ||
  //         (dep.additionalNotes && dep.additionalNotes.length > 150)
  //       ) {
  //         // console.log("Dependants validation failed at index", i);
  //         return false;
  //       }
  //     }
  //   }

  //   if (!formData.assignedRooms) {
  //     // console.log("Room assignments missing");
  //     return false;
  //   }

  //   let totalAssigned = 0;
  //   for (const roomId in formData.assignedRooms) {
  //     const assigned = Number(formData.assignedRooms[roomId]) || 0;
  //     const room = rooms.find((r) => r.id === roomId);
  //     if (room && assigned > room.availableSpace) {
  //       // console.log(`Room ${roomId} over capacity`);
  //       return false;
  //     }
  //     totalAssigned += assigned;
  //   }

  //   return totalAssigned === totalPeople;
  // };

  const validateEmergencyContact = (ec: any) => {
    if (!ec?.fullName?.trim()) return false;
    if (ec?.fullName.trim().length > 20) return false;

    if (!ec.phoneNumber?.trim()) return false;
    // Optional: stricter phone number check
    // if (!/^\+?\d{7,15}$/.test(ec.phoneNumber.trim())) return false;

    if (!ec?.relationship?.trim()) return false;
    if (ec?.relationship.trim().length > 15) return false;

    return true;
  };

  const isStep3Valid = () => {
    const numDep = Number(formData.guests?.[0]?.numberOfDependents || 0);
    const total = numDep + 1;

    if (numDep === 0 || formData.sameEmergencyContact) {
      const ec = formData.emergencyContact || {
        fullName: "",
        relationship: "",
        phoneNumber: "",
      };
      return validateEmergencyContact(ec);
    } else {
      const ecs = formData.guests || [];
      if (ecs.length !== total) return false;

      return ecs.every((g: any) =>
        validateEmergencyContact(g.emergencyContact)
      );
    }
  };

  const isStep4Valid = () => {
    // saare error messages empty hone chahiye aur saari fields filled
    if (Object.values(medicalErrors).some((e) => e)) return false;

    const numDep = Number(formData.guests[0]?.numberOfDependents || 0);
    const total = numDep + 1;

    for (let i = 0; i < total; i++) {
      const g = formData.guests[i];
      if (
        !g?.medicalCondition?.trim() ||
        !g?.allergies?.trim() ||
        !g?.currentMedications?.trim()
      ) {
        return false;
      }
    }
    return true;
  };

  const isStep5Valid = () => {
    const numDependants = Number(formData.guests[0]?.numberOfDependents) || 0;
    const hasDependants = numDependants > 0;

    // Validate Medic
    let isMedicValid = false;
    if (!hasDependants || formData.sameMedic) {
      // when same, just check primary user (index 0)
      isMedicValid = !!formData.guests[0]?.medic?.trim();
    } else {
      isMedicValid =
        Array.isArray(formData.guests) &&
        formData.guests.every((guest: any) => guest.medic?.trim());
    }

    // Validate Dentist
    let isDentistValid = false;
    if (!hasDependants || formData.sameDentist) {
      isDentistValid = !!formData.guests[0]?.dentist?.trim();
    } else {
      isDentistValid =
        Array.isArray(formData.guests) &&
        formData.guests.every((guest: any) => guest.dentist?.trim());
    }

    return isMedicValid && isDentistValid;
  };

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
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      case 5:
        return isStep5Valid();
      case 6:
        return isStep6Valid();
      default:
        return true; // For unimplemented steps
    }
  };

  const [Loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!isCurrentStepValid()) return;

    if (currentStep === 1) {
      setLoading(true); // 🔹 Start loader/disable
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
      } finally {
        setLoading(false); // 🔹 Always reset
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
  const isLoading = createGuestMutation.isPending;

  const handleSubmit = () => {
    try {
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
      delete cleanedData?.sameDentist;
      delete cleanedData?.roomRequirement;

      // 3. Remove empty objects (recursive)
      const removeEmptyObjects = (obj: any): any => {
        if (obj instanceof File || obj instanceof Blob) {
          return obj; // Preserve File or Blob objects
        }
        if (Array.isArray(obj)) {
          return obj
            .map(removeEmptyObjects)
            .filter(
              (item) =>
                !(
                  typeof item === "object" &&
                  !(item instanceof File || item instanceof Blob) &&
                  !Array.isArray(item) &&
                  Object.keys(item).length === 0
                )
            );
        } else if (typeof obj === "object" && obj !== null) {
          const newObj: any = {};
          Object.entries(obj).forEach(([key, value]) => {
            if (value instanceof File || value instanceof Blob) {
              newObj[key] = value; // Preserve File or Blob objects
            } else if (typeof value === "object") {
              const cleanedValue = removeEmptyObjects(value);
              if (
                !(
                  typeof cleanedValue === "object" &&
                  !(
                    cleanedValue instanceof File || cleanedValue instanceof Blob
                  ) &&
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

      // Verify File objects
      if (!(cleanedData.occupancyAgreement instanceof File)) {
        console.error(
          "occupancyAgreement is not a File:",
          cleanedData.occupancyAgreement
        );
      }
      if (!(cleanedData.signature instanceof File)) {
        console.error("signature is not a File:", cleanedData.signature);
      }

      // Prepare FormData with flattened fields
      const apiFormData = new FormData();

      console.log("pdf", cleanedData.occupancyAgreement instanceof File);
      // Append files
      if (cleanedData.occupancyAgreement instanceof File) {
        console.log("object", cleanedData.occupancyAgreement instanceof File);
        apiFormData.append(
          "occupancyAgreement",
          cleanedData.occupancyAgreement
        );
      }
      console.log("signature", cleanedData.signature instanceof File);
      if (cleanedData.signature instanceof File) {
        console.log("object", cleanedData.signature instanceof File);
        apiFormData.append("signature", cleanedData.signature);
      }

      // Append simple fields
      apiFormData.append("branchId", cleanedData.branchId || "");

      if (cleanedData.medic) {
        apiFormData.append("medic", cleanedData.medic || "");
      }

      if (cleanedData.dentist) {
        apiFormData.append("dentist", cleanedData.dentist || ""); // new field
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

      // assignedRooms ko comma-separated string me convert karke bhejo
      apiFormData.append("assignedRooms", cleanedData.assignedRooms.join(","));

      // rooms se locationIds nikal kar comma-separated string bhejo
      const selectedLocationIds = (rooms || [])
        .filter((room: any) => cleanedData.assignedRooms.includes(room.id))
        .map((room: any) => room.locationId);

      apiFormData.append("locations", selectedLocationIds.join(","));

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
        if (guest.isKid) {
          apiFormData.append(`guests[${index}][isKid]`, String(guest.isKid));
        }

        if (guest.dateOfBirth) {
          apiFormData.append(
            `guests[${index}][dateOfBirth]`,
            guest.dateOfBirth || ""
          );
        }

        if (guest.gender) {
          apiFormData.append(`guests[${index}][gender]`, guest.gender || "");
        }

        if (guest.nationality) {
          apiFormData.append(
            `guests[${index}][nationality]`,
            guest.nationality || ""
          );
        }

        if (guest.language) {
          apiFormData.append(
            `guests[${index}][language]`,
            guest.language || ""
          );
        }

        apiFormData.append(
          `guests[${index}][portNumber]`,
          guest.portNumber || ""
        );

        apiFormData.append(
          `guests[${index}][numberOfDependents]`,
          String(guest.numberOfDependents || 0)
        );

        if (guest.medic) {
          apiFormData.append(`guests[${index}][medic]`, guest.medic || "");
        }

        if (guest.dentist) {
          apiFormData.append(`guests[${index}][dentist]`, guest.dentist || ""); // new field
        }

        if (guest.address) {
          apiFormData.append(`guests[${index}][address]`, guest.address || "");
        }

        if (guest.medicalCondition) {
          apiFormData.append(
            `guests[${index}][medicalCondition]`,
            guest.medicalCondition || ""
          );
        }

        if (guest.allergies) {
          apiFormData.append(
            `guests[${index}][allergies]`,
            guest.allergies || ""
          );
        }

        if (guest.currentMedications) {
          apiFormData.append(
            `guests[${index}][currentMedications]`,
            guest.currentMedications || ""
          );
        }

        if (guest.additionalNotes) {
          apiFormData.append(
            `guests[${index}][additionalNotes]`,
            guest.additionalNotes || ""
          );
        }

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

      const formDataObj: Record<string, any> = {};
      apiFormData.forEach((value, key) => {
        formDataObj[key] = value;
      });
      console.log("📦 FormData key-value pairs:", formDataObj);

      // Call API via mutation
      createGuestMutation.mutate(apiFormData);

      // ✅ Success feedback
    } catch (err) {
      console.error("Error in handleSubmit", err);
    }
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
          <MedicalDietaryForm
            formData={formData}
            setFormData={setFormData}
            setErrors={setMedicalErrors}
          />
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
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <UserPlus className="h-5 w-5" />
              Registration Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-8 overflow-x-auto px-2 scrollbar-hide">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                return (
                  <div
                    key={step.id}
                    className="flex items-center shrink-0 min-w-[80px] sm:min-w-[100px]"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full border text-xs sm:text-sm font-medium transition-all ${
                          isActive
                            ? "bg-red-400 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {String(step.id).padStart(2, "0")}
                      </div>
                      <span
                        className={`mt-2 text-center whitespace-nowrap text-[10px] sm:text-xs ${
                          isActive
                            ? "text-red-400 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-6 sm:w-10 h-0.5 bg-gray-300 mx-1 sm:mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-sm">
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
              <Button
                onClick={handleSubmit}
                disabled={!isCurrentStepValid() || isLoading}
              >
                {isLoading ? (
                  "Registering..."
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Complete Registration
                  </div>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isCurrentStepValid() || Loading}
              >
                {Loading ? "Loading..." : "Next"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
