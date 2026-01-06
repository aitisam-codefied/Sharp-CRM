import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { StyledPhoneInput, validatePhone } from "../StyledFormInputWrapper";

export default function EmergencyContactForm({ formData, setFormData }: any) {
  const numDependants = Number(formData.guests[0].numberOfDependents) || 0;
  const totalPeople = numDependants + 1;
  const hasDependants = numDependants > 0;

  const [sameEmergencyContact, setSameEmergencyContact] = useState(
    formData.sameEmergencyContact || false
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      sameEmergencyContact: sameEmergencyContact,
    }));
  }, [sameEmergencyContact]);

  const validateField = (field: string, value: string) => {
    if (field === "fullName" && value.length > 20) {
      return "Name must be 20 characters or less";
    }
    if (field === "relationship" && value.length > 15) {
      return "Relation must be 15 characters or less";
    }
    return "";
  };

  const handleSameChange = (checked: boolean) => {
    setSameEmergencyContact(checked);
    setFormData((prev: any) => {
      const newData = { ...prev, sameEmergencyContact: checked };

      if (checked) {
        newData.emergencyContact = {};
        delete newData.emergencyContacts;
        if (prev.guests) {
          newData.guests = prev.guests.map((g: any) => ({
            ...g,
            emergencyContact: {},
          }));
        }
      } else {
        newData.emergencyContacts = Array(totalPeople).fill({});
        delete newData.emergencyContact;
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
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));

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
    const key = `${guestIndex}-${field}`;
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [key]: error }));

    setFormData((prev: any) => {
      const guests = [...prev.guests];
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

      {/* SINGLE CONTACT */}
      {!hasDependants || sameEmergencyContact ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-800">
            Emergency Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="ec-name">Full Name (Optional)</Label>
              <Input
                id="ec-name"
                placeholder="Enter name"
                value={formData?.emergencyContact?.fullName || ""}
                onChange={(e) =>
                  handleContactChange("fullName", e.target.value)
                }
                className={cn(errors["fullName"] && "border-red-500")}
              />
              {errors["fullName"] && (
                <p className="text-red-500 text-sm">{errors["fullName"]}</p>
              )}
            </div>

            {/* Phone Number ✅ replaced with StyledPhoneInput */}
            <div className="space-y-1">
              <Label htmlFor="ec-phone">Phone Number (Optional)</Label>
              <StyledPhoneInput
                id="ec-phone"
                value={formData?.emergencyContact?.phoneNumber || ""}
                onChange={(value) => handleContactChange("phoneNumber", value)}
                error={formData?.emergencyContact?.phoneNumber?.trim() ? validatePhone(formData?.emergencyContact?.phoneNumber) : undefined}
                defaultCountry="GB"
              />
            </div>

            {/* Relationship */}
            <div className="space-y-1">
              <Label htmlFor="ec-relation">Relation (Optional)</Label>
              <Input
                id="ec-relation"
                placeholder="e.g., Family, Friend"
                value={formData?.emergencyContact?.relationship || ""}
                onChange={(e) =>
                  handleContactChange("relationship", e.target.value)
                }
                className={cn(errors["relationship"] && "border-red-500")}
              />
              {errors["relationship"] && (
                <p className="text-red-500 text-sm">{errors["relationship"]}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // MULTIPLE CONTACTS
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
                {/* Full Name */}
                <div className="space-y-1">
                  <Label htmlFor={`ec-name-${i}`}>Name (Optional)</Label>
                  <Input
                    id={`ec-name-${i}`}
                    placeholder="Enter name"
                    value={
                      formData?.guests[i]?.emergencyContact?.fullName || ""
                    }
                    onChange={(e) =>
                      handleContactChangeGuest(i, "fullName", e.target.value)
                    }
                    className={cn(errors[`${i}-fullName`] && "border-red-500")}
                  />
                  {errors[`${i}-fullName`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`${i}-fullName`]}
                    </p>
                  )}
                </div>

                {/* Phone Number ✅ replaced with StyledPhoneInput */}
                <div className="space-y-1">
                  <Label htmlFor={`ec-phone-${i}`}>Phone Number (Optional)</Label>
                  <StyledPhoneInput
                    id={`ec-phone-${i}`}
                    value={
                      formData?.guests[i]?.emergencyContact?.phoneNumber || ""
                    }
                    onChange={(value) =>
                      handleContactChangeGuest(i, "phoneNumber", value)
                    }
                    error={formData?.guests[i]?.emergencyContact?.phoneNumber?.trim() ? validatePhone(
                      formData?.guests[i]?.emergencyContact?.phoneNumber
                    ) : undefined}
                    defaultCountry="GB"
                  />
                </div>

                {/* Relationship */}
                <div className="space-y-1">
                  <Label htmlFor={`ec-relation-${i}`}>Relation (Optional)</Label>
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
                    className={cn(
                      errors[`${i}-relationship`] && "border-red-500"
                    )}
                  />
                  {errors[`${i}-relationship`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`${i}-relationship`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
