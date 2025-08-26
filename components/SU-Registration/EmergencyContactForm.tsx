import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function EmergencyContactForm({ formData, setFormData }: any) {
  const numDependants = parseInt(formData.numDependants || 0);
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
  }, [sameEmergencyContact, setFormData]);

  const handleSameChange = (checked: boolean) => {
    setSameEmergencyContact(checked);
    setFormData((prev: any) => {
      const newData = { ...prev, sameEmergencyContact: checked };

      if (checked) {
        // Switching to same: Use primary's contact if available, or empty
        let commonContact = {};
        if (prev.emergencyContacts && prev.emergencyContacts[0]) {
          commonContact = prev.emergencyContacts[0];
        } else if (prev.emergencyContact) {
          commonContact = prev.emergencyContact;
        }
        newData.emergencyContact = commonContact;
        delete newData.emergencyContacts;
      } else {
        // Switching to separate: Replicate the common contact to all if available
        let initialContacts = Array(totalPeople).fill({});
        if (prev.emergencyContact) {
          initialContacts = Array(totalPeople).fill(prev.emergencyContact);
        } else if (prev.emergencyContacts) {
          initialContacts = prev.emergencyContacts;
        }
        newData.emergencyContacts = initialContacts;
        delete newData.emergencyContact;
      }

      return newData;
    });
  };

  const handleContactChange = (
    field: string,
    value: string,
    index?: number
  ) => {
    setFormData((prev: any) => {
      if (!hasDependants || sameEmergencyContact) {
        // Update single emergencyContact
        return {
          ...prev,
          emergencyContact: {
            ...(prev.emergencyContact || {}),
            [field]: value,
          },
        };
      } else {
        // Update specific index in emergencyContacts
        const contacts = [
          ...(prev.emergencyContacts || Array(totalPeople).fill({})),
        ];
        contacts[index!] = {
          ...contacts[index!],
          [field]: value,
        };
        return {
          ...prev,
          emergencyContacts: contacts,
        };
      }
    });
  };

  const getContact = (index: number) => {
    if (!hasDependants || sameEmergencyContact) {
      return formData.emergencyContact || {};
    } else {
      return (formData.emergencyContacts || [])[index] || {};
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
              <Label htmlFor="ec-name">Name *</Label>
              <Input
                id="ec-name"
                placeholder="Enter name"
                value={getContact(0).name || ""}
                onChange={(e) => handleContactChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-phone">Phone Number *</Label>
              <Input
                id="ec-phone"
                type="tel"
                placeholder="+44 7700 900000"
                value={getContact(0).phone || ""}
                onChange={(e) => handleContactChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-relation">Relation *</Label>
              <Input
                id="ec-relation"
                placeholder="e.g., Family, Friend"
                value={getContact(0).relation || ""}
                onChange={(e) =>
                  handleContactChange("relation", e.target.value)
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
                    value={getContact(i).name || ""}
                    onChange={(e) =>
                      handleContactChange("name", e.target.value, i)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ec-phone-${i}`}>Phone Number *</Label>
                  <Input
                    id={`ec-phone-${i}`}
                    type="tel"
                    placeholder="+44 7700 900000"
                    value={getContact(i).phone || ""}
                    onChange={(e) =>
                      handleContactChange("phone", e.target.value, i)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ec-relation-${i}`}>Relation *</Label>
                  <Input
                    id={`ec-relation-${i}`}
                    placeholder="e.g., Family, Friend"
                    value={getContact(i).relation || ""}
                    onChange={(e) =>
                      handleContactChange("relation", e.target.value, i)
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
