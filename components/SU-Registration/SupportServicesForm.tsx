import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const SUPPORT_SERVICE_TYPES = {
  LEGAL_ADVICE: "Legal Advice",
  MEDICAL_SUPPORT: "Medical Support",
  MENTAL_HEALTH_SUPPORT: "Mental Health Support",
  JOB_TRAINING: "Job Training",
  HOUSING_SUPPORT: "Housing Support",
  LANGUAGE_CLASSES: "Language Classes",
  EDUCATION: "Education",
  BENEFITS_ADVICE: "Benefits Advice",
};

export default function SupportServicesForm({ formData, setFormData }: any) {
  const numDependants = parseInt(formData.numDependants || 0);
  const totalPeople = numDependants + 1;
  const hasDependants = numDependants > 0;

  const [sameSupportServices, setSameSupportServices] = useState(
    formData.sameSupportServices || false
  );

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      sameSupportServices: sameSupportServices,
    }));
  }, [sameSupportServices, setFormData]);

  const handleSameChange = (checked: boolean) => {
    setSameSupportServices(checked);
    setFormData((prev: any) => {
      const newData = { ...prev, sameSupportServices: checked };

      if (checked) {
        // Switching to same: Use primary's services if available, or empty
        let commonServices = { services: [], notes: "" };
        if (prev.supportServicesList && prev.supportServicesList[0]) {
          commonServices = prev.supportServicesList[0];
        } else if (prev.supportServices) {
          commonServices = prev.supportServices;
        }
        newData.supportServices = commonServices;
        delete newData.supportServicesList;
      } else {
        // Switching to separate: Replicate the common services to all if available
        let initialServices = Array(totalPeople).fill({
          services: [],
          notes: "",
        });
        if (prev.supportServices) {
          initialServices = Array(totalPeople).fill(prev.supportServices);
        } else if (prev.supportServicesList) {
          initialServices = prev.supportServicesList;
        }
        newData.supportServicesList = initialServices;
        delete newData.supportServices;
      }

      return newData;
    });
  };

  const handleServiceChange = (index: number, service: string) => {
    setFormData((prev: any) => {
      if (!hasDependants || sameSupportServices) {
        // Update single supportServices
        const currentServices = prev.supportServices?.services || [];
        const updatedServices = currentServices.includes(service)
          ? currentServices.filter((s: string) => s !== service)
          : [...currentServices, service];
        return {
          ...prev,
          supportServices: {
            ...(prev.supportServices || {}),
            services: updatedServices,
          },
        };
      } else {
        // Update specific index in supportServicesList
        const servicesList = [
          ...(prev.supportServicesList ||
            Array(totalPeople).fill({ services: [], notes: "" })),
        ];
        const currentServices = servicesList[index]?.services || [];
        const updatedServices = currentServices.includes(service)
          ? currentServices.filter((s: string) => s !== service)
          : [...currentServices, service];
        servicesList[index] = {
          ...servicesList[index],
          services: updatedServices,
        };
        return {
          ...prev,
          supportServicesList: servicesList,
        };
      }
    });
  };

  const handleNotesChange = (index: number, value: string) => {
    setFormData((prev: any) => {
      if (!hasDependants || sameSupportServices) {
        // Update single supportServices
        return {
          ...prev,
          supportServices: {
            ...(prev.supportServices || {}),
            notes: value,
          },
        };
      } else {
        // Update specific index in supportServicesList
        const servicesList = [
          ...(prev.supportServicesList ||
            Array(totalPeople).fill({ services: [], notes: "" })),
        ];
        servicesList[index] = {
          ...servicesList[index],
          notes: value,
        };
        return {
          ...prev,
          supportServicesList: servicesList,
        };
      }
    });
  };

  const getServices = (index: number) => {
    if (!hasDependants || sameSupportServices) {
      return formData.supportServices || { services: [], notes: "" };
    } else {
      return (
        (formData.supportServicesList || [])[index] || {
          services: [],
          notes: "",
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {hasDependants && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="same-support-services"
            checked={sameSupportServices}
            onCheckedChange={handleSameChange}
          />
          <Label htmlFor="same-support-services">
            Same support services for all dependants?
          </Label>
        </div>
      )}

      {!hasDependants || sameSupportServices ? (
        // Single services form for primary (or all if same)
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-800">
            Support Services
          </h3>
          <div className="space-y-2">
            <Label>Support Services (Select all that apply) *</Label>
            <div className="flex flex-wrap gap-2">
              {Object.values(SUPPORT_SERVICE_TYPES).map((service) => (
                <Badge
                  key={service}
                  variant={
                    getServices(0).services.includes(service)
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer px-3 py-1 text-sm transition-colors ${
                    getServices(0).services.includes(service)
                      ? "bg-[#F87D7D] text-white border-[#F87D7D]"
                      : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => handleServiceChange(0, service)}
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Separate services for primary and each dependant
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Support Services
          </h3>
          {[...Array(totalPeople)].map((_, i) => (
            <div
              key={i}
              className="border p-6 rounded-lg bg-white shadow-sm relative hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-md mb-4 text-gray-800">
                {i === 0 ? "Primary User" : `Dependant ${i}`}
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Support Services (Select all that apply) *</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(SUPPORT_SERVICE_TYPES).map((service) => (
                      <Badge
                        key={service}
                        variant={
                          getServices(i).services.includes(service)
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer px-3 py-1 text-sm transition-colors ${
                          getServices(i).services.includes(service)
                            ? "bg-[#F87D7D] text-white border-[#F87D7D]"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                        onClick={() => handleServiceChange(i, service)}
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
