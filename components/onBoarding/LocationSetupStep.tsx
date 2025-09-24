import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Home, MapPin, Plus, Trash2 } from "lucide-react";
import { Company } from "../../app/dashboard/admin/on-boarding/page";

interface LocationSetupStepProps {
  companies: Company[];
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

export default function LocationSetupStep({
  companies,
  addLocation,
  updateLocation,
  removeLocation,
}: LocationSetupStepProps) {
  const [locationNameErrors, setLocationNameErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    companies.forEach((company, companyIndex) => {
      company.branches.forEach((branch, branchIndex) => {
        branch.locations.forEach((location, locationIndex) => {
          const key = `${companyIndex}-${branchIndex}-${locationIndex}`;
          const name = location.name.trim().toLowerCase();
          if (name) {
            const isDuplicate = branch.locations.some(
              (l, i) =>
                i !== locationIndex && l.name.trim().toLowerCase() === name
            );
            if (isDuplicate) {
              newErrors[key] = "Location name must be unique within the branch";
            }
          }
        });
      });
    });
    setLocationNameErrors(newErrors);
  }, [companies]);

  const handleLocationNameChange = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    value: string
  ) => {
    const branch = companies[companyIndex].branches[branchIndex];
    const name = value.trim().toLowerCase();
    const isDuplicate = branch.locations.some(
      (l, i) => i !== locationIndex && l.name.trim().toLowerCase() === name
    );
    const key = `${companyIndex}-${branchIndex}-${locationIndex}`;
    setLocationNameErrors((prev) => ({
      ...prev,
      [key]: isDuplicate
        ? "Location name must be unique within the branch"
        : "",
    }));
    updateLocation(companyIndex, branchIndex, locationIndex, value);
  };

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
              {company.branches.map((branch, branchIndex) => (
                <div
                  key={branch.id}
                  className="md:card md:border-l-4 md:border-l-red-500"
                >
                  <div className="pb-2 md:pb-4 px-4 md:px-6">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {branch.name}
                    </h3>
                  </div>
                  <div className="space-y-4 p-4 md:p-6">
                    {branch.locations.map((location, locationIndex) => {
                      const errorKey = `${companyIndex}-${branchIndex}-${locationIndex}`;
                      const error = locationNameErrors[errorKey];
                      return (
                        <div key={location.id} className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              value={location.name}
                              onChange={(e) =>
                                handleLocationNameChange(
                                  companyIndex,
                                  branchIndex,
                                  locationIndex,
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Floor 1, East Wing, Reception"
                              className="flex-1"
                            />
                            {error && (
                              <p className="text-red-500 text-sm mt-1">
                                {error}
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
                      );
                    })}

                    <Button
                      variant="outline"
                      onClick={() => addLocation(companyIndex, branchIndex)}
                      className="w-full border-dashed border-2 h-10"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
