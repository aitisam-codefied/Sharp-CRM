import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2 } from "lucide-react";
import { COMPANY_BUSINESS_TYPES } from "../../app/dashboard/admin/on-boarding/page";

interface BusinessTypeStepProps {
  selectedBusinessType: string;
  setSelectedBusinessType: (type: string) => void;
}

export default function BusinessTypeStep({
  selectedBusinessType,
  setSelectedBusinessType,
}: BusinessTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Business Type
        </h2>
        <p className="text-gray-600">
          Select the type that best describes your business structure
        </p>
      </div>
      <div className="flex justify-center">
        <Badge
          variant="destructive"
          className="text-sm px-4 py-1 rounded-full text-center"
        >
          This is a one-time process and can't be changed later
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(COMPANY_BUSINESS_TYPES).map(([key, value]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedBusinessType === value
                ? "ring-2 ring-red-500 bg-red-50"
                : ""
            }`}
            onClick={() => setSelectedBusinessType(value)}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-semibold mb-2">{value}</h3>
              <p className="text-sm text-gray-600">
                {key === "SINGLE" && "One company with one branch"}
                {key === "FRANCHISE" &&
                  "One company with multiple branches (same name)"}
                {key === "MULTIPLE" &&
                  "Multiple companies with different branches"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
