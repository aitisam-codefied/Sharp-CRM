import { Label } from "@/components/ui/label";
import { GuestFormData } from "@/lib/types";

interface ConsentFieldsProps {
  index: number;
  register: any;
}

export function ConsentFields({ index, register }: ConsentFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="space-y-2 flex items-center justify-start gap-2">
        <Label
          className="mt-[7px]"
          htmlFor={`details.${index}.consentAccuracy`}
        >
          Consent to Data Accuracy
        </Label>
        <input
          type="checkbox"
          id={`details.${index}.consentAccuracy`}
          {...register(`details.${index}.consentAccuracy`)}
        />
      </div>
      <div className="space-y-2 flex items-center justify-start gap-2">
        <Label
          className="mt-[7px]"
          htmlFor={`details.${index}.consentDataProcessing`}
        >
          Consent to Data Processing
        </Label>
        <input
          type="checkbox"
          id={`details.${index}.consentDataProcessing`}
          {...register(`details.${index}.consentDataProcessing`)}
        />
      </div>
      <div className="space-y-2 flex items-center justify-start gap-2">
        <Label
          className="mt-[7px]"
          htmlFor={`details.${index}.consentDataRetention`}
        >
          Consent to Data Retention
        </Label>
        <input
          type="checkbox"
          id={`details.${index}.consentDataRetention`}
          {...register(`details.${index}.consentDataRetention`)}
        />
      </div>
    </div>
  );
}
