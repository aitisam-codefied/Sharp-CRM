import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GuestFormData } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DocumentFieldsProps {
  index: number;
  control: any;
  register: any;
}

export const USER_DOCUMENT_TYPES = {
  PASSPORT_ID_DOCUMENT: "Passport/ID Document",
  BIRTH_CERTIFICATE: "Birth Certificate",
  MEDICAL_RECORDS: "Medical Records",
  ASYLUM_APPLICATION: "Asylum Application",
  EDUCATIONAL_CERTIFICATES: "Educational Certificates",
  PREVIOUS_ADDRESS_PROOF: "Previous Address Proof",
  BANK_STATEMENTS: "Bank Statements",
  OTHER_DOCUMENTS: "Other Documents",
};

export function DocumentFields({
  index,
  control,
  register,
}: DocumentFieldsProps) {
  return (
    <div className="space-y-2 mt-4">
      <Label>Documents</Label>
      <Controller
        name={`details.${index}.documents`}
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            {field.value.map((doc: any, docIndex: number) => (
              <div key={docIndex} className="grid grid-cols-2 gap-4">
                {/* Document Type Select */}
                <Controller
                  name={`details.${index}.documents.${docIndex}.type`}
                  control={control}
                  render={({ field: typeField }) => (
                    <Select
                      onValueChange={typeField.onChange}
                      value={typeField.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(USER_DOCUMENT_TYPES).map((docType) => (
                          <SelectItem key={docType} value={docType}>
                            {docType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Document URL Input */}
                <Input
                  placeholder="Document URL"
                  {...register(`details.${index}.documents.${docIndex}.url`)}
                />
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}
