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
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Location Setup
        </h2>
        <p className="text-gray-600">
          Add locations within each branch (e.g., Floor 1, East Wing)
        </p>
      </div>

      <div className="space-y-6">
        {newCompanies.map((company, companyIndex) => (
          <Card key={company._id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.branches.map((branch, branchIndex) => (
                <Card key={branch._id} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {branch.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {branch.locations.map((location, locationIndex) => (
                      <div key={location._id} className="flex gap-2">
                        <Input
                          value={location.name}
                          onChange={(e) =>
                            updateLocation(
                              companyIndex,
                              branchIndex,
                              locationIndex,
                              e.target.value
                            )
                          }
                          placeholder="e.g., Floor 1, East Wing, Reception"
                          className="flex-1"
                        />
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
                      className="w-full border-dashed border-2 h-10"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
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
