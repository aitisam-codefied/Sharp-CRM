"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Building2, MapPin, Home, Plus, Trash2, Bed } from "lucide-react";

export const ROOM_PREFERENCE_TYPES = {
  SINGLE: "Single Room (Capacity 1)",
  DOUBLE: "Double Room (Capacity 2)",
  TWIN: "Twin Room (Capacity 2 - 2 single beds)",
  TRIPLE: "Triple Room (Capacity 3)",
  QUAD: "Quad Room (Capacity 4)",
  QUINTUPLE: "Quintuple Room (Capacity 5)",
};

const ROOM_TYPE_CAPACITY: Record<string, number> = {
  "Single Room (Capacity 1)": 1,
  "Double Room (Capacity 2)": 2,
  "Twin Room (Capacity 2 - 2 single beds)": 2,
  "Triple Room (Capacity 3)": 3,
  "Quad Room (Capacity 4)": 4,
  "Quintuple Room (Capacity 5)": 5,
};

export const ROOM_STATUS_TYPES = {
  OCCUPIED: "Occupied",
  VACANT: "Vacant",
  MAINTENANCE: "Maintenance",
};

const ROOM_AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Private Bathroom",
  "Shared Bathroom",
  "TV",
  "Refrigerator",
  "Microwave",
  "Desk",
  "Wardrobe",
  "Balcony",
  "Kitchen Access",
  "Laundry Access",
];

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  status: string;
  amenities: string[];
  capacity: any;
}

interface Location {
  _id: string;
  name: string;
  rooms: Room[];
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

interface RoomStepProps {
  newCompanies: Company[];
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

export default function RoomStep({
  newCompanies,
  addRoom,
  updateRoom,
  removeRoom,
  toggleAmenity,
}: RoomStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Bed className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Room Configuration
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Set up rooms for each location with details and amenities
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
            <CardContent className="space-y-4 sm:space-y-6 p-0 sm:p-6">
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
                  <CardContent className="sm:p-6 space-y-4 p-0">
                    {branch.locations.map((location, locationIndex) => (
                      <Card
                        key={location._id}
                        className="border-0 sm:border sm:border-l-4 sm:border-l-blue-500"
                      >
                        <CardHeader className="p-3 sm:p-6">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            {location.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 space-y-4">
                          {location.rooms.map((room, roomIndex) => (
                            <Card
                              key={room._id}
                              className="bg-gray-50 border-0 sm:border"
                            >
                              <CardHeader className="p-3 sm:p-6 flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
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
                              <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                                  <div>
                                    <Label>Room Number *</Label>
                                    <Input
                                      value={room.roomNumber}
                                      maxLength={10} // Prevent typing beyond 10 characters
                                      onChange={(e) =>
                                        updateRoom(
                                          companyIndex,
                                          branchIndex,
                                          locationIndex,
                                          roomIndex,
                                          "roomNumber",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g., 101, A-1"
                                      className="mt-1 text-sm sm:text-base"
                                    />
                                    {room.roomNumber.length > 10 && (
                                      <p className="text-xs text-red-500 mt-1">
                                        Room number cannot exceed 10 characters.
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <Label>Room Type *</Label>
                                    <Select
                                      value={room.type}
                                      onValueChange={(value) => {
                                        updateRoom(
                                          companyIndex,
                                          branchIndex,
                                          locationIndex,
                                          roomIndex,
                                          "type",
                                          value
                                        );
                                        // Auto-update capacity if mapping exists
                                        const autoCapacity =
                                          ROOM_TYPE_CAPACITY[value];
                                        if (autoCapacity) {
                                          updateRoom(
                                            companyIndex,
                                            branchIndex,
                                            locationIndex,
                                            roomIndex,
                                            "capacity",
                                            String(autoCapacity)
                                          );
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="mt-1 text-sm">
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
                                  <div className="hidden">
                                    <Label>Room Capacity</Label>
                                    <Select value={room.capacity} disabled>
                                      <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="Auto-selected" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[1, 2, 3, 4, 5].map((num) => (
                                          <SelectItem
                                            key={num}
                                            value={String(num)}
                                          >
                                            {num}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-2 sm:mb-3 block">
                                    Amenities
                                  </Label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
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
                          ))}
                          <Button
                            variant="outline"
                            onClick={() =>
                              addRoom(companyIndex, branchIndex, locationIndex)
                            }
                            className="w-full border-dashed border-2 h-10 text-sm sm:text-base"
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
