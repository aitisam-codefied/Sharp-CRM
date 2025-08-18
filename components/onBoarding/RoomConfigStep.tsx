import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, MapPin, Home, Bed, Plus, Trash2 } from "lucide-react";
import {
  ROOM_PREFERENCE_TYPES,
  ROOM_AMENITIES,
} from "../../app/dashboard/admin/on-boarding/page";
import { Company } from "../../app/dashboard/admin/on-boarding/page";

interface RoomConfigStepProps {
  companies: Company[];
  addRoom: (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number
  ) => void;
  updateRoom: (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number,
    field: string,
    value: any
  ) => void;
  removeRoom: (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number
  ) => void;
  toggleAmenity: (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number,
    amenity: string
  ) => void;
}

export default function RoomConfigStep({
  companies,
  addRoom,
  updateRoom,
  removeRoom,
  toggleAmenity,
}: RoomConfigStepProps) {
  const [roomNumberErrors, setRoomNumberErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    companies.forEach((company, companyIndex) => {
      company.branches.forEach((branch, branchIndex) => {
        branch.locations.forEach((location, locationIndex) => {
          location.rooms.forEach((room, roomIndex) => {
            const key = `${companyIndex}-${branchIndex}-${locationIndex}-${roomIndex}`;
            const number = room.roomNumber.trim().toLowerCase();
            if (number) {
              const isDuplicate = location.rooms.some(
                (r, i) =>
                  i !== roomIndex &&
                  r.roomNumber.trim().toLowerCase() === number
              );
              if (isDuplicate) {
                newErrors[key] =
                  "Room number must be unique within the location";
              }
            }
          });
        });
      });
    });
    setRoomNumberErrors(newErrors);
  }, [companies]);

  const handleRoomNumberChange = (
    companyIndex: number,
    branchIndex: number,
    locationIndex: number,
    roomIndex: number,
    value: string
  ) => {
    const location =
      companies[companyIndex].branches[branchIndex].locations[locationIndex];
    const number = value.trim().toLowerCase();
    const isDuplicate = location.rooms.some(
      (r, i) => i !== roomIndex && r.roomNumber.trim().toLowerCase() === number
    );
    const key = `${companyIndex}-${branchIndex}-${locationIndex}-${roomIndex}`;
    setRoomNumberErrors((prev) => ({
      ...prev,
      [key]: isDuplicate
        ? "Room number must be unique within the location"
        : "",
    }));
    updateRoom(
      companyIndex,
      branchIndex,
      locationIndex,
      roomIndex,
      "roomNumber",
      value
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bed className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Room Configuration
        </h2>
        <p className="text-gray-600">
          Set up rooms for each location with details and amenities
        </p>
      </div>

      <div className="space-y-6">
        {companies.map((company, companyIndex) => (
          <Card key={companyIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {company.branches.map((branch, branchIndex) => (
                <Card key={branch.id} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {branch.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {branch.locations.map((location, locationIndex) => (
                      <Card
                        key={location.id}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            {location.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {location.rooms.map((room, roomIndex) => {
                            const errorKey = `${companyIndex}-${branchIndex}-${locationIndex}-${roomIndex}`;
                            const error = roomNumberErrors[errorKey];
                            return (
                              <Card key={room.id} className="bg-gray-50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                  <CardTitle className="text-sm">
                                    Room {roomIndex + 1}
                                  </CardTitle>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeRoom(
                                        companyIndex,
                                        branchIndex,
                                        locationIndex,
                                        roomIndex
                                      )
                                    }
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Room Number *</Label>
                                      <Input
                                        value={room.roomNumber}
                                        onChange={(e) =>
                                          handleRoomNumberChange(
                                            companyIndex,
                                            branchIndex,
                                            locationIndex,
                                            roomIndex,
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g., 101, A-1"
                                        className="mt-1"
                                      />
                                      {error && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {error}
                                        </p>
                                      )}
                                    </div>
                                    <div>
                                      <Label>Room Type *</Label>
                                      <Select
                                        value={room.type}
                                        onValueChange={(value) =>
                                          updateRoom(
                                            companyIndex,
                                            branchIndex,
                                            locationIndex,
                                            roomIndex,
                                            "type",
                                            value
                                          )
                                        }
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Object.values(
                                            ROOM_PREFERENCE_TYPES
                                          ).map((type) => (
                                            <SelectItem key={type} value={type}>
                                              {type}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium mb-3 block">
                                      Amenities
                                    </Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {ROOM_AMENITIES.map((amenity) => (
                                        <div
                                          key={amenity}
                                          className="flex items-center space-x-2"
                                        >
                                          <Checkbox
                                            id={`amenity-${companyIndex}-${branchIndex}-${locationIndex}-${roomIndex}-${amenity}`}
                                            checked={room.amenities.includes(
                                              amenity
                                            )}
                                            onCheckedChange={() =>
                                              toggleAmenity(
                                                companyIndex,
                                                branchIndex,
                                                locationIndex,
                                                roomIndex,
                                                amenity
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`amenity-${companyIndex}-${branchIndex}-${locationIndex}-${roomIndex}-${amenity}`}
                                            className="text-sm font-normal"
                                          >
                                            {amenity}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}

                          <Button
                            variant="outline"
                            onClick={() =>
                              addRoom(companyIndex, branchIndex, locationIndex)
                            }
                            className="w-full border-dashed border-2 h-10"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Room
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
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
