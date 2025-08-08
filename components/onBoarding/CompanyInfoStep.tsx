import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Building2 } from "lucide-react";
import { COMPANY_BUSINESS_TYPES } from "../../app/dashboard/admin/on-boarding/page";
import { Company } from "../../app/dashboard/admin/on-boarding/page";

interface CompanyInfoStepProps {
  companies: Company[];
  selectedBusinessType: string;
  addCompany: () => void;
  updateCompany: (index: number, field: string, value: string) => void;
  removeCompany: (index: number) => void;
}

export default function CompanyInfoStep({
  companies,
  selectedBusinessType,
  addCompany,
  updateCompany,
  removeCompany,
}: CompanyInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Company Information
        </h2>
        <p className="text-gray-600">
          {selectedBusinessType === COMPANY_BUSINESS_TYPES.MULTIPLE
            ? "Add your companies"
            : "Enter your company details"}
        </p>
      </div>

      <div className="space-y-4">
        {companies.map((company, companyIndex) => (
          <Card key={companyIndex}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">
                {selectedBusinessType === COMPANY_BUSINESS_TYPES.MULTIPLE
                  ? `Company ${companyIndex + 1}`
                  : "Company Details"}
              </CardTitle>
              {selectedBusinessType === COMPANY_BUSINESS_TYPES.MULTIPLE &&
                companies.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCompany(companyIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`company-name-${companyIndex}`}>
                  Company Name *
                </Label>
                <Input
                  id={`company-name-${companyIndex}`}
                  value={company.name}
                  onChange={(e) =>
                    updateCompany(companyIndex, "name", e.target.value)
                  }
                  placeholder="Enter company name"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{company.type}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {selectedBusinessType === COMPANY_BUSINESS_TYPES.MULTIPLE && (
          <Button
            variant="outline"
            onClick={addCompany}
            className="w-full border-dashed border-2 h-12 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Company
          </Button>
        )}
      </div>
    </div>
  );
}
