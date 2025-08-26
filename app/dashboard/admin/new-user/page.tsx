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

export default function NewUserPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
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
    // {
    //   id: 6,
    //   title: "Support Services",
    //   description: "Support services",
    // },

    {
      id: 6,
      title: "Review And Confirmation",
      description: "Final review and Confirmation",
    },
  ];

  const isStep1Valid = () => {
    return (
      formData.firstName?.trim() &&
      formData.dob?.trim() &&
      formData.nationality?.trim() &&
      formData.numDependants !== undefined &&
      formData.branch?.trim()
    );
  };

  const isStep2Valid = () => {
    const dependants = parseInt(formData.numDependants || 0);
    const totalPeople = dependants + 1;

    // console.log("isStep2Valid:", {
    //   dependants,
    //   totalPeople,
    //   isDependantsArray: Array.isArray(formData.dependants),
    //   dependantsData: formData.dependants,
    //   roomAssignments: formData.roomAssignments,
    // });

    if (
      dependants > 0 &&
      (!Array.isArray(formData.dependants) ||
        !formData.dependants.every(
          (dep: any) =>
            dep?.name?.trim() && dep?.dob?.trim() && dep?.nationality?.trim()
        ))
    ) {
      // console.log("Dependants validation failed");
      return false;
    }

    if (!formData.roomAssignments) {
      console.log("Room assignments missing");
      return false;
    }
    let totalAssigned = 0;
    for (const roomId in formData.roomAssignments) {
      const assigned = parseInt(formData.roomAssignments[roomId] || 0);
      const room = rooms.find((r) => r.id === roomId);
      if (room && assigned > room.availableSpace) {
        // console.log(`Room ${roomId} over capacity`);
        return false;
      }
      totalAssigned += assigned;
    }
    // console.log("Total assigned:", totalAssigned, "Total people:", totalPeople);
    return totalAssigned === totalPeople;
  };

  const isStep3Valid = () => {
    const numDep = parseInt(formData.numDependants || 0);
    const total = numDep + 1;
    if (numDep === 0 || formData.sameEmergencyContact) {
      const ec = formData.emergencyContact || {};
      return ec.name?.trim() && ec.phone?.trim() && ec.relation?.trim();
    } else {
      const ecs = formData.emergencyContacts || [];
      if (ecs.length !== total) return false;
      return ecs.every(
        (ec: any) => ec.name?.trim() && ec.phone?.trim() && ec.relation?.trim()
      );
    }
  };

  const isStep5Valid = () => {
    const numDep = parseInt(formData.numDependants || 0);
    const total = numDep + 1;
    if (numDep === 0 || formData.sameDentalClinic) {
      const dc = formData.dentalClinic || {};
      return dc.name?.trim() && dc.phone?.trim() && dc.email?.trim();
    } else {
      const dcs = formData.dentalClinics || [];
      if (dcs.length !== total) return false;
      return dcs.every(
        (dc: any) => dc.name?.trim() && dc.phone?.trim() && dc.email?.trim()
      );
    }
  };

  // const isStep6Valid = () => {
  //   const numDep = parseInt(formData.numDependants || 0);
  //   const total = numDep + 1;
  //   if (numDep === 0 || formData.sameSupportServices) {
  //     const ss = formData.supportServices || {};
  //     return Array.isArray(ss.services) && ss.services.length > 0;
  //   } else {
  //     const ssl = formData.supportServicesList || [];
  //     if (ssl.length !== total) return false;
  //     return ssl.every(
  //       (ss: any) => Array.isArray(ss.services) && ss.services.length > 0
  //     );
  //   }
  // };

  const isStep6Valid = () => {
    return (
      formData.consents?.accuracy &&
      formData.consents?.processing &&
      formData.consents?.retention &&
      !!formData.signatureUrl
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
        return true;
      case 5:
        return isStep5Valid();
      // case 6:
      //   return isStep6Valid();
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
        const capacity = parseInt(formData.numDependants || 0) + 1;
        const kids = formData.numKids || 0;
        const branchId = formData.branch;

        const response = await api.get("/guest/rooms/capacity", {
          params: { capacity, kids, branchId },
        });

        if (response.data.success) {
          setRooms(response.data.data);
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
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log(JSON.stringify(formData, null, 2));
    toast({
      title: "Registration Complete",
      description:
        "New service user has been successfully registered and assigned accommodation.",
    });
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
      // case 6:
      //   return (
      //     <SupportServicesForm formData={formData} setFormData={setFormData} />
      //   );
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
