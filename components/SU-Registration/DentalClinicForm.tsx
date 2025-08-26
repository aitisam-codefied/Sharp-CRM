import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function DentalClinicForm({ formData, setFormData }: any) {
  const numDependants = parseInt(formData.numDependants || 0);
  const totalPeople = numDependants + 1;
  const hasDependants = numDependants > 0;

  const [sameDentalClinic, setSameDentalClinic] = useState(
    formData.sameDentalClinic || false
  );

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      sameDentalClinic: sameDentalClinic,
    }));
  }, [sameDentalClinic, setFormData]);

  const handleSameChange = (checked: boolean) => {
    setSameDentalClinic(checked);
    setFormData((prev: any) => {
      const newData = { ...prev, sameDentalClinic: checked };

      if (checked) {
        // Switching to same: Use primary's clinic if available, or empty
        let commonClinic = {};
        if (prev.dentalClinics && prev.dentalClinics[0]) {
          commonClinic = prev.dentalClinics[0];
        } else if (prev.dentalClinic) {
          commonClinic = prev.dentalClinic;
        }
        newData.dentalClinic = commonClinic;
        delete newData.dentalClinics;
      } else {
        // Switching to separate: Replicate the common clinic to all if available
        let initialClinics = Array(totalPeople).fill({});
        if (prev.dentalClinic) {
          initialClinics = Array(totalPeople).fill(prev.dentalClinic);
        } else if (prev.dentalClinics) {
          initialClinics = prev.dentalClinics;
        }
        newData.dentalClinics = initialClinics;
        delete newData.dentalClinic;
      }

      return newData;
    });
  };

  const handleClinicChange = (field: string, value: string, index?: number) => {
    setFormData((prev: any) => {
      if (!hasDependants || sameDentalClinic) {
        // Update single dentalClinic
        return {
          ...prev,
          dentalClinic: {
            ...(prev.dentalClinic || {}),
            [field]: value,
          },
        };
      } else {
        // Update specific index in dentalClinics
        const clinics = [
          ...(prev.dentalClinics || Array(totalPeople).fill({})),
        ];
        clinics[index!] = {
          ...clinics[index!],
          [field]: value,
        };
        return {
          ...prev,
          dentalClinics: clinics,
        };
      }
    });
  };

  const getClinic = (index: number) => {
    if (!hasDependants || sameDentalClinic) {
      return formData.dentalClinic || {};
    } else {
      return (formData.dentalClinics || [])[index] || {};
    }
  };

  return (
    <div className="space-y-6">
      {hasDependants && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="same-dental"
            checked={sameDentalClinic}
            onCheckedChange={handleSameChange}
          />
          <Label htmlFor="same-dental">
            Same dental clinic details for all dependants?
          </Label>
        </div>
      )}

      {!hasDependants || sameDentalClinic ? (
        // Single clinic form for primary (or all if same)
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-800">
            Dental Clinic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dc-name">Clinic Name *</Label>
              <Input
                id="dc-name"
                placeholder="Enter clinic name"
                value={getClinic(0).name || ""}
                onChange={(e) => handleClinicChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dc-phone">Phone Number *</Label>
              <Input
                id="dc-phone"
                type="tel"
                placeholder="+44 7700 900000"
                value={getClinic(0).phone || ""}
                onChange={(e) => handleClinicChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dc-email">Email *</Label>
              <Input
                id="dc-email"
                type="email"
                placeholder="clinic@example.com"
                value={getClinic(0).email || ""}
                onChange={(e) => handleClinicChange("email", e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : (
        // Separate clinics for primary and each dependant
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Dental Clinic Details
          </h3>
          {[...Array(totalPeople)].map((_, i) => (
            <div
              key={i}
              className="border p-6 rounded-lg bg-white shadow-sm relative hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-md mb-4 text-gray-800">
                {i === 0 ? "Primary User" : `Dependant ${i}`}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`dc-name-${i}`}>Clinic Name *</Label>
                  <Input
                    id={`dc-name-${i}`}
                    placeholder="Enter clinic name"
                    value={getClinic(i).name || ""}
                    onChange={(e) =>
                      handleClinicChange("name", e.target.value, i)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`dc-phone-${i}`}>Phone Number *</Label>
                  <Input
                    id={`dc-phone-${i}`}
                    type="tel"
                    placeholder="+44 7700 900000"
                    value={getClinic(i).phone || ""}
                    onChange={(e) =>
                      handleClinicChange("phone", e.target.value, i)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`dc-email-${i}`}>Email *</Label>
                  <Input
                    id={`dc-email-${i}`}
                    type="email"
                    placeholder="clinic@example.com"
                    value={getClinic(i).email || ""}
                    onChange={(e) =>
                      handleClinicChange("email", e.target.value, i)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
