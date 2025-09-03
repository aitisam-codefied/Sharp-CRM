import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GuestFormData } from "@/lib/types";

interface ContactFieldsProps {
  control: any;
  register: any;
}

export function ContactFields2({ control, register }: ContactFieldsProps) {
  console.log("Index:");
  return (
    <div className="space-y-2 mt-4">
      <Label>Emergency Contacts</Label>
      <Controller
        name={`emergencyContacts`}
        control={control}
        render={({ field }) => {
          console.log("Field value:", field.value);
          const contacts = Array.isArray(field.value) ? field.value : [];
          return (
            <div className="space-y-2">
              {contacts.map((_, contactIndex) => (
                <div
                  key={contactIndex}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                  <Input
                    placeholder="Contact Name"
                    {...register(`emergencyContacts.${contactIndex}.fullName`)}
                  />
                  <Input
                    placeholder="Relationship"
                    {...register(
                      `emergencyContacts.${contactIndex}.relationship`
                    )}
                  />
                  <Input
                    placeholder="Phone Number"
                    {...register(
                      `emergencyContacts.${contactIndex}.phoneNumber`
                    )}
                  />
                </div>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
}
