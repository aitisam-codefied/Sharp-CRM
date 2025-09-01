import { Label } from "@/components/ui/label";
import { GuestFormData } from "@/lib/types";

interface ConsentFieldsProps {
  register: any;
}

export function ConsentFields2({ register }: ConsentFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="space-y-2 flex items-center justify-start gap-2">
        <Label className="mt-[7px]" htmlFor={`consentAccuracy`}>
          Consent to Data Accuracy
        </Label>
        <input
          type="checkbox"
          id={`consentAccuracy`}
          {...register(`consentAccuracy`)}
        />
      </div>
      <div className="space-y-2 flex items-center justify-start gap-2">
        <Label className="mt-[7px]" htmlFor={`consentDataProcessing`}>
          Consent to Data Processing
        </Label>
        <input
          type="checkbox"
          id={`consentDataProcessing`}
          {...register(`consentDataProcessing`)}
        />
      </div>
      {/* <div className="space-y-2 flex items-center justify-start gap-2">
        <Label className="mt-[7px]" htmlFor={`consentDataRetention`}>
          Consent to Data Retention
        </Label>
        <input
          type="checkbox"
          id={`consentDataRetention`}
          {...register(`consentDataRetention`)}
        />
      </div> */}
    </div>
  );
}
