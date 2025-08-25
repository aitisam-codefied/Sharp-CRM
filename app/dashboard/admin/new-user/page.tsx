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
import { UserPlus, Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PersonalInfoForm from "@/components/SU-Registration/PersonalInfoForm";
import DependantsForm from "@/components/SU-Registration/DependantForm";

export default function NewUserPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
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
      title: "Medical & Dietary",
      description: "Health and dietary requirements",
    },
    {
      id: 4,
      title: "Support & Services",
      description: "Support needs and services required",
    },
    { id: 5, title: "Documentation", description: "Upload required documents" },
    { id: 6, title: "Room Assignment", description: "Assign accommodation" },
    {
      id: 7,
      title: "Review & Submit",
      description: "Final review and submission",
    },
  ];

  const isStep1Valid = () => {
    return (
      formData.firstName?.trim() &&
      formData.dob?.trim() &&
      formData.nationality?.trim() &&
      formData.numDependants !== undefined
    );
  };

  const isStep2Valid = () => {
    const dependants = parseInt(formData.numDependants || 0);
    const totalPeople = dependants + 1;
    if (
      dependants > 0 &&
      !formData.dependants?.every(
        (dep: any) =>
          dep?.name?.trim() && dep?.dob?.trim() && dep?.nationality?.trim()
      )
    ) {
      return false;
    }

    // Check room assignment
    if (!formData.roomAssignments) return false;
    let totalAssigned = 0;
    for (const roomId in formData.roomAssignments) {
      const assigned = parseInt(formData.roomAssignments[roomId] || 0);
      const room = rooms.find((r) => r.id === roomId);
      if (room && assigned > room.vacant) return false;
      totalAssigned += assigned;
    }
    return totalAssigned === totalPeople;
  };

  // Dummy rooms data (hardcoded)
  const rooms = [
    { id: "101", capacity: 5, occupied: 2, vacant: 3 },
    { id: "102", capacity: 5, occupied: 0, vacant: 5 },
    { id: "103", capacity: 5, occupied: 3, vacant: 2 },
    { id: "104", capacity: 5, occupied: 1, vacant: 4 },
    { id: "105", capacity: 5, occupied: 4, vacant: 1 },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
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
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Complete Registration
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
