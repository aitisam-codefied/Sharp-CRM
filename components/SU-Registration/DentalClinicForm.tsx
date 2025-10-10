import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMedicalStaff } from "@/hooks/useGetMedicalStaff";

export default function MedicalAndDentalForm({ formData, setFormData }: any) {
  const numDependants = Number(formData.guests[0]?.numberOfDependents) || 0;
  const totalPeople = numDependants + 1;
  const hasDependants = numDependants > 0;

  const { data } = useMedicalStaff(500);
  const medicalStaff: any[] = Array.isArray(data?.results)
    ? data.results.filter((staff: any) => staff.status === "Active")
    : [];
  const generalPractitioners = medicalStaff.filter(
    (staff: any) => staff.type === "General Practitioner"
  );
  const dentists = medicalStaff.filter((staff: any) => staff.type === "Dental");

  const [sameMedic, setSameMedic] = useState(formData.sameMedic || false);
  const [sameDentist, setSameDentist] = useState(formData.sameDentist || false);

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      sameMedic,
      sameDentist,
    }));
  }, [sameMedic, sameDentist, setFormData]);

  const handleSameMedicChange = (checked: boolean) => {
    setSameMedic(checked);
  };

  const handleSameDentistChange = (checked: boolean) => {
    setSameDentist(checked);
  };

  const handleMedicChangeGuest = (guestIndex: number, value: string) => {
    setFormData((prev: any) => {
      const newData = { ...prev };

      if (prev.sameMedic) {
        // ✅ store globally if sameMedic is checked
        newData.medic = value;
        // wipe medic fields inside guests
        newData.guests = prev.guests.map((g: any, idx: number) => ({
          ...g,
          medic: idx === 0 ? value : "", // optional: keep primary same as top-level
        }));
      } else {
        // ✅ store per guest
        const guests = [...prev.guests];
        guests[guestIndex] = { ...guests[guestIndex], medic: value };
        newData.guests = guests;
        delete newData.medic; // no top-level medic in this mode
      }

      return newData;
    });
  };

  const handleDentistChangeGuest = (guestIndex: number, value: string) => {
    setFormData((prev: any) => {
      const newData = { ...prev };

      if (prev.sameDentist) {
        // ✅ store globally if sameDentist is checked
        newData.dentist = value;
        newData.guests = prev.guests.map((g: any, idx: number) => ({
          ...g,
          dentist: idx === 0 ? value : "",
        }));
      } else {
        const guests = [...prev.guests];
        guests[guestIndex] = { ...guests[guestIndex], dentist: value };
        newData.guests = guests;
        delete newData.dentist; // no top-level dentist in this mode
      }

      return newData;
    });
  };

  return (
    <div className="space-y-6">
      {hasDependants && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-medic"
              checked={sameMedic}
              onCheckedChange={handleSameMedicChange}
            />
            <Label htmlFor="same-medic">
              Same assigned medical staff for all dependants?
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-dentist"
              checked={sameDentist}
              onCheckedChange={handleSameDentistChange}
            />
            <Label htmlFor="same-dentist">
              Same assigned dentist for all dependants?
            </Label>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="font-semibold text-lg text-gray-800">
          Assigned Medical & Dental Staff
        </h3>

        {[...Array(totalPeople)].map((_, i) => (
          <div
            key={i}
            className="border p-6 rounded-lg bg-white shadow-sm relative hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-md mb-4 text-gray-800">
              {i === 0 ? "Primary User" : `Dependant ${i}`}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medic field */}
              <div className="space-y-2">
                <Label>Select Medical Staff *</Label>
                {sameMedic && i > 0 ? (
                  <p className="text-gray-500 text-sm">Same as Primary User</p>
                ) : (
                  <Select
                    value={formData?.guests[i]?.medic || ""}
                    onValueChange={(value) => handleMedicChangeGuest(i, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a medical staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {generalPractitioners.map((staff: any) => (
                        <SelectItem key={staff._id} value={String(staff._id)}>
                          {staff.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Dentist field */}
              <div className="space-y-2">
                <Label>Select Dentist *</Label>
                {sameDentist && i > 0 ? (
                  <p className="text-gray-500 text-sm">Same as Primary User</p>
                ) : (
                  <Select
                    value={formData?.guests[i]?.dentist || ""}
                    onValueChange={(value) =>
                      handleDentistChangeGuest(i, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a dentist" />
                    </SelectTrigger>
                    <SelectContent>
                      {dentists.map((staff: any) => (
                        <SelectItem key={staff._id} value={String(staff._id)}>
                          {staff.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
