"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Trash2 } from "lucide-react";

interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Array<any>;
  createdAt: string;
  updatedAt: string;
}

interface CompanyStepProps {
  newCompanies: Company[];
  addCompany: () => void;
  updateCompany: (index: number, field: string, value: string) => void;
  removeCompany: (index: number) => void;
}

export default function CompanyStep({
  newCompanies,
  addCompany,
  updateCompany,
  removeCompany,
}: CompanyStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Company Information
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Add your company details
        </p>
      </div>

      <div className="space-y-4">
        {newCompanies.map((company, companyIndex) => (
          <Card key={company._id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">
                Company {companyIndex + 1}
              </CardTitle>
              {newCompanies.length > 1 && (
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
            <CardContent className="space-y-3 sm:space-y-4">
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
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={addCompany}
          className="w-full border-dashed border-2 h-10 sm:h-12 bg-transparent text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Company
        </Button>
      </div>
    </div>
  );
}
