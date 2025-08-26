import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const nationalities = [
  "Syrian",
  "Afghan",
  "Venezuelan",
  "Eritrean",
  "Iraqi",
  "Iranian",
  "Sudanese",
  "Other",
];

export default function DependantsForm({ formData, setFormData, rooms }: any) {
  const dependants = parseInt(formData.numDependants || 0);
  const totalPeople = dependants + 1;

  const handleDependantChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => {
      const updatedDependants = Array.isArray(prev.dependants)
        ? [...prev.dependants]
        : Array(parseInt(prev.numDependants || 0)).fill({});
      updatedDependants[index] = {
        ...updatedDependants[index],
        [field]: value,
      };
      return {
        ...prev,
        dependants: updatedDependants,
      };
    });
  };

  const handleRoomAssignmentChange = (roomId: string, value: string) => {
    const num = parseInt(value) || 0;
    setFormData((prev: any) => ({
      ...prev,
      roomAssignments: {
        ...(prev.roomAssignments || {}),
        [roomId]: num > 0 ? num : undefined, // Remove if 0
      },
    }));
  };

  let totalAssigned = 0;
  let hasError = false;
  const roomErrors: { [key: string]: string } = {};
  for (const roomId in formData.roomAssignments || {}) {
    const assigned = parseInt(formData.roomAssignments[roomId] || 0);
    const room = rooms.find((r: any) => r.id === roomId);
    if (room) {
      if (assigned > room.availableSpace) {
        hasError = true;
        roomErrors[
          roomId
        ] = `Only ${room.availableSpace} vacancies available in this room.`;
      }
      totalAssigned += assigned;
    }
  }
  if (totalAssigned > totalPeople) {
    hasError = true;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">Room Assignment</h3>
        <p className="text-sm text-gray-600">
          Total people to assign: {totalPeople} (including primary user). Assign
          people to rooms without exceeding vacancies.
        </p>
        {rooms.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room: any) => (
              <div
                key={room.id}
                className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-semibold text-lg text-gray-800">
                    Room {room.roomNumber}
                  </Label>
                  <Badge
                    variant="outline"
                    className="bg-[#F87D7D] text-white border-[#F87D7D] font-medium"
                  >
                    {room.availableAdultSpace} Vacant
                  </Badge>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-700 border-yellow-300"
                  >
                    Capacity: {room.capacity}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 border-green-300"
                  >
                    Occupied: {room.currentOccupancy}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">
                      Location: {room.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.amenities.map((amenity: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="default"
                          className="px-2 py-1 text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Label htmlFor={`assign-${room.id}`} className="text-black">
                    Assign people
                  </Label>
                  <Input
                    id={`assign-${room.id}`}
                    type="number"
                    min="0"
                    max={room.availableSpace}
                    value={formData.roomAssignments?.[room.id] || ""}
                    onChange={(e) =>
                      handleRoomAssignmentChange(room.id, e.target.value)
                    }
                    placeholder="0"
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                  {roomErrors[room.id] && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{roomErrors[room.id]}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            No rooms available for current number of people.
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <p className="text-sm font-medium text-gray-800">
            Total assigned: {totalAssigned} / {totalPeople}
          </p>
          {totalAssigned !== totalPeople && (
            <Alert variant="destructive" className="flex-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {totalAssigned < totalPeople
                  ? `You need to assign ${
                      totalPeople - totalAssigned
                    } more people.`
                  : "You have assigned more people than needed."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      {dependants > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Dependants Information
          </h3>
          {[...Array(dependants)].map((_, i) => (
            <div
              key={i}
              className="border p-6 rounded-lg bg-white shadow-sm relative hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-md mb-4 text-gray-800">
                Dependant {i + 1}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">Name *</Label>
                  <Input
                    placeholder="Full Name"
                    value={formData.dependants?.[i]?.name || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "name", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`email-${i}`} className="text-gray-600">
                    Email Address
                  </Label>
                  <Input
                    id={`email-${i}`}
                    type="email"
                    placeholder="user@temp.com"
                    value={formData.dependants?.[i]?.email || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "email", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`phone-${i}`} className="text-gray-600">
                    Phone Number
                  </Label>
                  <Input
                    id={`phone-${i}`}
                    placeholder="+44 7700 900000"
                    value={formData.dependants?.[i]?.phone || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "phone", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`dob-${i}`} className="text-gray-600">
                    Date of Birth *
                  </Label>
                  <Input
                    id={`dob-${i}`}
                    type="date"
                    value={formData.dependants?.[i]?.dob || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "dob", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`gender-${i}`} className="text-gray-600">
                    Gender
                  </Label>
                  <Select
                    value={formData.dependants?.[i]?.gender || ""}
                    onValueChange={(value) =>
                      handleDependantChange(i, "gender", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`nationality-${i}`} className="text-gray-600">
                    Nationality *
                  </Label>
                  <Select
                    value={formData.dependants?.[i]?.nationality || ""}
                    onValueChange={(value) =>
                      handleDependantChange(i, "nationality", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((nationality) => (
                        <SelectItem
                          key={nationality}
                          value={nationality.toLowerCase()}
                        >
                          {nationality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* New fields for each dependant: Address and Language */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`address-${i}`} className="text-gray-600">
                    Address
                  </Label>
                  <Textarea
                    id={`address-${i}`}
                    placeholder="Enter address"
                    value={formData.dependants?.[i]?.address || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "address", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`additional-notes-${i}`}
                    className="text-gray-600"
                  >
                    Additional Notes
                  </Label>
                  <Textarea
                    id={`additional-notes-${i}`}
                    placeholder="Enter additional notes"
                    value={formData.dependants?.[i]?.additionalNotes || ""}
                    onChange={(e) =>
                      handleDependantChange(
                        i,
                        "additionalNotes",
                        e.target.value
                      )
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`language-${i}`} className="text-gray-600">
                    Language
                  </Label>
                  <Input
                    id={`language-${i}`}
                    placeholder="Enter preferred language"
                    value={formData.dependants?.[i]?.language || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "language", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
