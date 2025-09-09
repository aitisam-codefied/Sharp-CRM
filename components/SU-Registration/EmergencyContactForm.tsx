import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function EmergencyContactForm({ formData, setFormData }: any) {
  const numDependants = Number(formData.guests[0].numberOfDependents) || 0;
  console.log("numDependants", numDependants);
  const totalPeople = numDependants + 1;
  const hasDependants = numDependants > 0;

  const [sameEmergencyContact, setSameEmergencyContact] = useState(
    formData.sameEmergencyContact || false
  );

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      sameEmergencyContact: sameEmergencyContact,
    }));
  }, [sameEmergencyContact]);

  const handleSameChange = (checked: boolean) => {
    setSameEmergencyContact(checked);
    setFormData((prev: any) => {
      const newData = { ...prev, sameEmergencyContact: checked };

      if (checked) {
        // Switching to same: reset and keep only primary empty contact
        newData.emergencyContact = {};
        delete newData.emergencyContacts;

        // also reset guests ke emergencyContact
        if (prev.guests) {
          newData.guests = prev.guests.map((g: any) => ({
            ...g,
            emergencyContact: {},
          }));
        }
      } else {
        // Switching to separate: reset all contacts for each person
        newData.emergencyContacts = Array(totalPeople).fill({});
        delete newData.emergencyContact;

        // guests ke contacts bhi reset
        if (prev.guests) {
          newData.guests = prev.guests.map((g: any) => ({
            ...g,
            emergencyContact: {},
          }));
        }
      }

      return newData;
    });
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      emergencyContact: {
        ...(prev.emergencyContact || {}),
        [field]: value,
      },
    }));
  };

  const handleContactChangeGuest = (
    guestIndex: number,
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => {
      const guests = [...prev.guests]; // clone array
      guests[guestIndex] = {
        ...guests[guestIndex],
        emergencyContact: {
          ...(guests[guestIndex]?.emergencyContact || {}),
          [field]: value,
        },
      };
      return { ...prev, guests };
    });
  };

  const getContact = (index: number) => {
    if (!hasDependants || sameEmergencyContact) {
      return formData.emergencyContact || {};
    } else {
      return (formData.emergencyContacts || [])[index] || {};
    }
  };

  const getContactGuest = (index: number) => {
    if (!hasDependants || sameEmergencyContact) {
      return formData.guests.emergencyContact || {};
    } else {
      return (formData.guests.emergencyContacts || [])[index] || {};
    }
  };

  return (
    <div className="space-y-6">
      {hasDependants && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="same-emergency"
            checked={sameEmergencyContact}
            onCheckedChange={handleSameChange}
          />
          <Label htmlFor="same-emergency">
            Same emergency contact details for all dependants?
          </Label>
        </div>
      )}

      {!hasDependants || sameEmergencyContact ? (
        // Single contact form for primary (or all if same)
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-800">
            Emergency Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ec-name">Full Name *</Label>
              <Input
                id="ec-name"
                placeholder="Enter name"
                value={formData?.emergencyContact?.fullName || ""}
                onChange={(e) =>
                  handleContactChange("fullName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-phone">Phone Number *</Label>
              <Input
                id="ec-phone"
                type="tel"
                placeholder="+44 7700 900000"
                value={formData?.emergencyContact?.phoneNumber || ""}
                onChange={(e) =>
                  handleContactChange("phoneNumber", e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    !(e.key === "+" && e.currentTarget.selectionStart === 0) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-relation">Relation *</Label>
              <Input
                id="ec-relation"
                placeholder="e.g., Family, Friend"
                value={formData?.emergencyContact?.relationship || ""}
                onChange={(e) =>
                  handleContactChange("relationship", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ) : (
        // Separate contacts for primary and each dependant
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Emergency Contact Details
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
                  <Label htmlFor={`ec-name-${i}`}>Name *</Label>
                  <Input
                    id={`ec-name-${i}`}
                    placeholder="Enter name"
                    value={
                      formData?.guests[i]?.emergencyContact?.fullName || ""
                    }
                    onChange={(e) =>
                      handleContactChangeGuest(i, "fullName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ec-phone-${i}`}>Phone Number *</Label>
                  <Input
                    id={`ec-phone-${i}`}
                    type="tel"
                    placeholder="+44 7700 900000"
                    value={
                      formData?.guests[i]?.emergencyContact?.phoneNumber || ""
                    }
                    onChange={(e) =>
                      handleContactChangeGuest(i, "phoneNumber", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ec-relation-${i}`}>Relation *</Label>
                  <Input
                    id={`ec-relation-${i}`}
                    placeholder="e.g., Family, Friend"
                    value={
                      formData?.guests[i]?.emergencyContact?.relationship || ""
                    }
                    onChange={(e) =>
                      handleContactChangeGuest(
                        i,
                        "relationship",
                        e.target.value
                      )
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
