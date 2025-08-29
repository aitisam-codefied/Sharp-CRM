import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export const DIETARY_REQUIREMENT_TYPES = {
  VEGETARIAN: "Vegetarian",
  VEGAN: "Vegan",
  GLUTEN_FREE: "Gluten Free",
  DAIRY_FREE: "Dairy Free",
  KETOGENIC: "Ketogenic",
  LACTO_VEGAN: "Lacto-Vegan",
  OMNIVORE: "Omnivore",
  HALAL: "Halal",
  OTHER: "Other",
};

export default function MedicalDietaryForm({ formData, setFormData }: any) {
  const numDependants = Number(formData.guests[0].numberOfDependents[0]) || 0;
  const totalPeople = numDependants + 1;

  const handleMedicalChange = (
    guestIndex: number,
    field: string,
    value: string | string[]
  ) => {
    setFormData((prev: any) => {
      const guests = [...prev.guests]; // clone
      guests[guestIndex] = {
        ...guests[guestIndex],
        [field]: value,
      };
      return { ...prev, guests };
    });
  };

  const toggleDietary = (guestIndex: number, type: string) => {
    const current = formData.guests[guestIndex]?.dietaryRequirements || [];
    const updated = current.includes(type)
      ? current.filter((t: string) => t !== type)
      : [...current, type];

    handleMedicalChange(guestIndex, "dietaryRequirements", updated);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg text-gray-800">
        Medical & Dietary Requirements
      </h3>
      {[...Array(totalPeople)].map((_, i) => (
        <div
          key={i}
          className="border p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <h4 className="font-semibold text-md mb-4 text-gray-800">
            {i === 0 ? "Primary User" : `Dependant ${i}`}
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`medical-conditions-${i}`}>
                Medical Conditions
              </Label>
              <Textarea
                id={`medical-conditions-${i}`}
                placeholder="Describe any medical conditions"
                value={formData.guests[i]?.medicalCondition || ""}
                onChange={(e) =>
                  handleMedicalChange(i, "medicalCondition", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`allergies-${i}`}>Allergies</Label>
              <Textarea
                id={`allergies-${i}`}
                placeholder="List any allergies"
                value={formData.guests[i]?.allergies || ""}
                onChange={(e) =>
                  handleMedicalChange(i, "allergies", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`medications-${i}`}>Current Medications</Label>
              <Textarea
                id={`medications-${i}`}
                placeholder="List current medications"
                value={formData.guests[i]?.currentMedications || ""}
                onChange={(e) =>
                  handleMedicalChange(i, "currentMedications", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Dietary Requirements (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.values(DIETARY_REQUIREMENT_TYPES).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dietary-${type}-${i}`}
                      checked={(
                        formData.guests[i]?.dietaryRequirements || []
                      ).includes(type)}
                      onCheckedChange={() => toggleDietary(i, type)}
                    />
                    <Label htmlFor={`dietary-${type}-${i}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
