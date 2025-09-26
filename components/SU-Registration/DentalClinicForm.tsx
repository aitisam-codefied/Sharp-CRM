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

export default function AssignedMedicalStaff({ formData, setFormData }: any) {
  const numDependants = Number(formData.guests[0]?.numberOfDependents) || 0;
  const totalPeople = numDependants + 1;
  const hasDependants = numDependants > 0;

  const { data } = useMedicalStaff(500);
  const medicalStaff: any[] = Array.isArray(data?.results)
    ? data.results.filter((staff: any) => staff.status === "Active")
    : [];

  const [sameMedic, setSameMedic] = useState(formData.sameMedic || false);

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      sameMedic,
    }));
  }, [sameMedic]);

  const handleSameChange = (checked: boolean) => {
    setSameMedic(checked);
    setFormData((prev: any) => {
      const newData = { ...prev, sameMedic: checked };

      if (checked) {
        // common medic (reset)
        newData.medic = "";
        delete newData.assignedStaff;

        if (prev.guests) {
          newData.guests = prev.guests.map((g: any) => ({
            ...g,
            medic: "",
          }));
        }
      } else {
        // separate medic (reset)
        newData.assignedStaff = Array(totalPeople).fill("");
        delete newData.medic;

        if (prev.guests) {
          newData.guests = prev.guests.map((g: any) => ({
            ...g,
            medic: "",
          }));
        }
      }
      return newData;
    });
  };

  // update single common medic
  const handleMedicChange = (value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      medic: value,
    }));
  };

  // update guest medic individually
  const handleMedicChangeGuest = (guestIndex: number, value: string) => {
    setFormData((prev: any) => {
      const guests = [...prev.guests];
      guests[guestIndex] = {
        ...guests[guestIndex],
        medic: value,
      };
      return { ...prev, guests };
    });
  };

  return (
    <div className="space-y-6">
      {hasDependants && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="same-medic"
            checked={sameMedic}
            onCheckedChange={handleSameChange}
          />
          <Label htmlFor="same-medic">
            Same assigned medical staff for all dependants?
          </Label>
        </div>
      )}

      {!hasDependants || sameMedic ? (
        // Single medic for primary/all
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-800">
            Assigned Medical Staff
          </h3>
          <Select
            value={formData?.medic || ""}
            onValueChange={(value) => handleMedicChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select medical staff" />
            </SelectTrigger>
            <SelectContent>
              {medicalStaff.map((staff: any) => (
                <SelectItem key={staff._id} value={String(staff._id)}>
                  {staff.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        // Separate medic for each guest
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Assigned Medical Staff
          </h3>
          {[...Array(totalPeople)].map((_, i) => (
            <div
              key={i}
              className="border p-6 rounded-lg bg-white shadow-sm relative hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-md mb-4 text-gray-800">
                {i === 0 ? "Primary User" : `Dependant ${i}`}
              </h4>
              <div className="space-y-2">
                <Label>Select Medical Staff *</Label>
                <Select
                  value={formData?.guests[i]?.medic || ""}
                  onValueChange={(value) => handleMedicChangeGuest(i, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a medical staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalStaff.map((staff: any) => (
                      <SelectItem key={staff._id} value={String(staff._id)}>
                        {staff.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
