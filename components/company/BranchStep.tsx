"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Plus, Trash2 } from "lucide-react";

interface Branch {
  _id: string;
  name: string;
  address: string;
  locations: Array<any>;
}

interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Branch[];
  createdAt: string;
  updatedAt: string;
}

interface BranchStepProps {
  newCompanies: Company[];
  addBranch: (companyIndex: number) => void;
  updateBranch: (
    companyIndex: number,
    branchIndex: number,
    field: string,
    value: string
  ) => void;
  removeBranch: (companyIndex: number, branchIndex: number) => void;
}

export default function BranchStep({
  newCompanies,
  addBranch,
  updateBranch,
  removeBranch,
}: BranchStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Branch Information
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Add branches for your companies
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {newCompanies.map((company, companyIndex) => (
          <Card key={company._id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.branches.map((branch, branchIndex) => (
                <Card key={branch._id} className="border-l-4 border-l-red-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                    <CardTitle className="text-sm sm:text-base">
                      Branch {branchIndex + 1}
                    </CardTitle>
                    {company.branches.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBranch(companyIndex, branchIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
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
                          updateBranch(
                            companyIndex,
                            branchIndex,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Enter branch name"
                        className="mt-1 mb-1 text-sm sm:text-base"
                        maxLength={51} // stop typing beyond 50
                      />
                      {branch.name.length > 50 && (
                        <p className="text-red-500 text-xs mt-1">
                          Branch name cannot exceed 50 characters.
                        </p>
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
                        className="mt-1 text-sm sm:text-base"
                        rows={3}
                        maxLength={101} // stop typing beyond 100
                      />
                      {branch.address.length > 100 && (
                        <p className="text-red-500 text-xs mt-1">
                          Branch address cannot exceed 100 characters.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => addBranch(companyIndex)}
                className="w-full border-dashed border-2 h-10 sm:h-12 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
