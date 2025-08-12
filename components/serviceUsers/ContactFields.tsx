import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GuestFormData } from "@/lib/types";

interface ContactFieldsProps {
  index: number;
  control: any;
  register: any;
}

export function ContactFields({
  index,
  control,
  register,
}: ContactFieldsProps) {
  return (
    <div className="space-y-2 mt-4">
      <Label>Emergency Contacts</Label>
      <Controller
        name={`details.${index}.emergencyContacts`}
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            {field.value.map((_: any, contactIndex: number) => (
              <div key={contactIndex} className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Contact Name"
                    {...register(
                      `details.${index}.emergencyContacts.${contactIndex}.fullName`
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Relationship"
                    {...register(
                      `details.${index}.emergencyContacts.${contactIndex}.relationship`
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Phone Number"
                    {...register(
                      `details.${index}.emergencyContacts.${contactIndex}.phoneNumber`
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}
