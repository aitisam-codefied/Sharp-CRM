"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Home, Plus, Trash2 } from "lucide-react";

interface Location {
  _id: string;
  name: string;
  rooms: Array<any>;
}

interface Branch {
  _id: string;
  name: string;
  address: string;
  locations: Location[];
}

interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Branch[];
  createdAt: string;
  updatedAt: string;
}

interface LocationStepProps {
  newCompanies: Company[];
  addLocation: (companyIndex: number, branchIndex: number) => void;
  updateLocation: (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    value: string
  ) => void;
  removeLocation: (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number
  ) => void;
}

export default function LocationStep({
  newCompanies,
  addLocation,
  updateLocation,
  removeLocation,
}: LocationStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Home className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Floor Setup
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Add floors within each branch (e.g., Floor 1, East Wing)
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
            <CardContent className="space-y-4 p-0 sm:p-6">
              {company.branches.map((branch, branchIndex) => (
                <Card
                  key={branch._id}
                  className="border-0 sm:border sm:border-l-4 sm:border-l-red-500"
                >
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {branch.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                    {branch.locations.map((location, locationIndex) => (
                      <div
                        key={location._id}
                        className="flex gap-2 items-center"
                      >
                        <div className="w-full">
                          <Input
                            value={location.name}
                            maxLength={51}
                            onChange={(e) =>
                              updateLocation(
                                companyIndex,
                                branchIndex,
                                locationIndex,
                                e.target.value
                              )
                            }
                            placeholder="e.g., Floor 1, East Wing, Reception"
                            className="flex-1 text-sm sm:text-base"
                          />
                          {location.name.length > 50 && (
                            <p className="text-red-500 text-xs mt-1">
                              Floor name cannot exceed 50 characters.
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeLocation(
                              companyIndex,
                              branchIndex,
                              locationIndex
                            )
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => addLocation(companyIndex, branchIndex)}
                      className="w-full border-dashed border-2 h-10 text-sm sm:text-base"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Floor
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
