"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Plus, Trash2 } from "lucide-react";
import { COMPANY_BUSINESS_TYPES } from "../../app/on-boarding/page";
import { Company } from "../../app/on-boarding/page";
import { useEffect, useState } from "react";

interface BranchInfoStepProps {
  companies: Company[];
  selectedBusinessType: string;
  addBranch: (companyIndex: number) => void;
  updateBranch: (
    companyIndex: number,
    branchIndex: number,
    field: string,
    value: string
  ) => void;
  removeBranch: (companyIndex: number, branchIndex: number) => void;
}

export default function BranchInfoStep({
  companies,
  selectedBusinessType,
  addBranch,
  updateBranch,
  removeBranch,
}: BranchInfoStepProps) {
  const [branchNameErrors, setBranchNameErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    companies.forEach((company, companyIndex) => {
      company.branches.forEach((branch, branchIndex) => {
        const key = `${companyIndex}-${branchIndex}`;
        const name = branch.name.trim().toLowerCase();
        if (name) {
          const isDuplicate = company.branches.some(
            (b, i) => i !== branchIndex && b.name.trim().toLowerCase() === name
          );
          if (isDuplicate) {
            newErrors[key] = "Branch name must be unique within the company";
          }
        }
      });
    });
    setBranchNameErrors(newErrors);
  }, [companies]);

  const handleBranchNameChange = (
    companyIndex: number,
    branchIndex: number,
    value: string
  ) => {
    const company = companies[companyIndex];
    const name = value.trim().toLowerCase();
    const isDuplicate = company.branches.some(
      (b, i) => i !== branchIndex && b.name.trim().toLowerCase() === name
    );
    const key = `${companyIndex}-${branchIndex}`;
    setBranchNameErrors((prev) => ({
      ...prev,
      [key]: isDuplicate ? "Branch name must be unique within the company" : "",
    }));
    updateBranch(companyIndex, branchIndex, "name", value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Branch Information
        </h2>
        <p className="text-gray-600">Add branches for your companies</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {companies.map((company, companyIndex) => (
          <Card key={companyIndex}>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6">
              {company.branches.map((branch, branchIndex) => {
                const errorKey = `${companyIndex}-${branchIndex}`;
                const error = branchNameErrors[errorKey];
                return (
                  <div
                    key={branch.id}
                    className="md:card md:border-l-4 md:border-l-red-500"
                  >
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-4 px-4 md:px-6">
                      <h3 className="text-base font-semibold">
                        Branch {branchIndex + 1}
                      </h3>
                      {selectedBusinessType !== COMPANY_BUSINESS_TYPES.SINGLE &&
                        company.branches.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeBranch(companyIndex, branchIndex)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                    <div className="space-y-4 p-4 md:p-6">
                      <div>
                        <Label
                          htmlFor={`branch-name-${companyIndex}-${branchIndex}`}
                        >
                          Branch Name *
                        </Label>
                        <Input
                          id={`branch-name-${companyIndex}-${branchIndex}`}
                          value={branch.name}
                          onChange={(e) =>
                            handleBranchNameChange(
                              companyIndex,
                              branchIndex,
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />
                        {error && (
                          <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor={`branch-address-${companyIndex}-${branchIndex}`}
                        >
                          Branch Address *
                        </Label>
                        <Textarea
                          id={`branch-address-${companyIndex}-${branchIndex}`}
                          value={branch.address}
                          onChange={(e) =>
                            updateBranch(
                              companyIndex,
                              branchIndex,
                              "address",
                              e.target.value
                            )
                          }
                          placeholder="Enter complete branch address"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {selectedBusinessType !== COMPANY_BUSINESS_TYPES.SINGLE ||
              company.branches.length === 0 ? (
                <Button
                  variant="outline"
                  onClick={() => addBranch(companyIndex)}
                  className="w-full border-dashed border-2 h-12"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
