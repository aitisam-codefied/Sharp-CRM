import { useEffect, useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { StyledPhoneInput, validatePhone } from "../StyledFormInputWrapper";

const nationalities = [
  "Syrian",
  "Afghan",
  "Venezuelan",
  "Eritrean",
  "Iraqi",
  "Iranian",
  "Sudanese",
];

export default function DependantsForm({ formData, setFormData, rooms }: any) {
  const [touchedRooms, setTouchedRooms] = useState<{
    [roomId: string]: boolean;
  }>({});

  const dependants = parseInt(formData.guests[0].numberOfDependents || 0);
  const totalPeople = dependants + 1;

  const [errors, setErrors] = useState<{
    [key: number]: {
      email?: string;
      dob?: string;
      additionalNotes?: string;
      fullName?: string;
      address?: string;
      portNumber?: string;
    };
  }>({});

  // Compute min date for DOB based on whether all dependents are kids
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const minDate =
    Number(formData.numKids || 0) === dependants && dependants > 0
      ? eighteenYearsAgo.toISOString().split("T")[0]
      : undefined;
  const maxDate = today.toISOString().split("T")[0];

  // Auto-check kids if all dependants are kids
  useEffect(() => {
    const totalDependents = Number(formData.guests[0]?.numberOfDependents || 0);
    const numKids = Number(formData.numKids || 0);

    if (totalDependents > 0 && totalDependents === numKids) {
      setFormData((prev: any) => {
        let updatedGuests = [...prev.guests];

        for (let i = 1; i <= totalDependents; i++) {
          if (!updatedGuests[i]) {
            updatedGuests[i] = {};
          }
          updatedGuests[i] = { ...updatedGuests[i], isKid: true };
        }

        return { ...prev, guests: updatedGuests };
      });
    }
  }, [formData.guests[0]?.numberOfDependents, formData.numKids, setFormData]);

  // Auto-set isKid=false for all dependants when no kids
  useEffect(() => {
    const totalDependents = Number(formData.guests[0]?.numberOfDependents || 0);
    const numKids = Number(formData.numKids || 0);

    if (numKids === 0 && totalDependents > 0) {
      setFormData((prev: any) => {
        let updatedGuests = [...prev.guests];

        for (let i = 1; i <= totalDependents; i++) {
          if (!updatedGuests[i]) {
            updatedGuests[i] = {};
          }
          updatedGuests[i] = { ...updatedGuests[i], isKid: false };
        }

        return { ...prev, guests: updatedGuests };
      });
    }
  }, [formData.numKids, formData.guests[0]?.numberOfDependents, setFormData]);

  const handleDependantChange = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updatedGuests = Array.isArray(prev.guests) ? [...prev.guests] : [];
      updatedGuests[index] = {
        ...updatedGuests[index],
        [field]: value,
      };
      return {
        ...prev,
        guests: updatedGuests,
      };
    });

    setErrors((prev) => {
      const newErrors = { ...prev };

      // Name validation
      if (field === "fullName") {
        if (!value.trim()) {
          newErrors[index] = {
            ...newErrors[index],
            fullName: "Name is required.",
          };
        } else if (value.length > 20) {
          newErrors[index] = {
            ...newErrors[index],
            fullName: "Name cannot exceed 20 characters.",
          };
        } else {
          if (newErrors[index]) delete newErrors[index].fullName;
        }
      }

      // Email validation
      if (field === "emailAddress") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!value.trim()) {
          newErrors[index] = {
            ...newErrors[index],
            email: "Email is required.",
          };
        } else if (!emailRegex.test(value)) {
          newErrors[index] = {
            ...newErrors[index],
            email: "Invalid email format.",
          };
        } else {
          if (newErrors[index]) delete newErrors[index].email;
        }
      }

      // DOB validation
      if (field === "dateOfBirth") {
        const today = new Date();
        const selected = new Date(value);
        if (!value.trim()) {
          newErrors[index] = {
            ...newErrors[index],
            dob: "Date of birth is required.",
          };
        } else if (selected > today) {
          newErrors[index] = {
            ...newErrors[index],
            dob: "DOB cannot be today or future date.",
          };
        } else if (
          Number(formData.numKids || 0) === dependants &&
          dependants > 0 &&
          selected < eighteenYearsAgo
        ) {
          newErrors[index] = {
            ...newErrors[index],
            dob: "Kids must be under 18 years old.",
          };
        } else {
          if (newErrors[index]) delete newErrors[index].dob;
        }
      }

      // Address validation
      if (field === "address") {
        if (value.length > 150) {
          newErrors[index] = {
            ...newErrors[index],
            address: "Address cannot exceed 150 characters.",
          };
        } else {
          if (newErrors[index]) delete newErrors[index].address;
        }
      }

      // Additional Notes validation
      if (field === "additionalNotes") {
        if (value.length > 150) {
          newErrors[index] = {
            ...newErrors[index],
            additionalNotes: "Additional notes cannot exceed 150 characters.",
          };
        } else {
          if (newErrors[index]) delete newErrors[index].additionalNotes;
        }
      }

      // Port Number validation
      if (field === "portNumber") {
        const portNumberRegex = /^[a-zA-Z0-9]*$/;
        if (!value.trim()) {
          newErrors[index] = {
            ...newErrors[index],
            portNumber: "Port number is required.",
          };
          // } else if (!portNumberRegex.test(value)) {
          //   newErrors[index] = {
          //     ...newErrors[index],
          //     portNumber: "Port number must be alphanumeric.",
          //   };
        } else if (value.length < 12) {
          newErrors[index] = {
            ...newErrors[index],
            portNumber: "Port number must be at least 12 characters.",
          };
        } else if (value.length > 55) {
          newErrors[index] = {
            ...newErrors[index],
            portNumber: "Port number cannot exceed 55 characters.",
          };
        } else {
          if (newErrors[index]) delete newErrors[index].portNumber;
        }
      }

      return newErrors;
    });
  };

  const handleRoomAssignmentChange = (roomId: string, value: string) => {
    const num = parseInt(value) || 0;

    setFormData((prev: any) => {
      const updated = { ...(prev.assignedRooms || {}) };

      if (num > 0) {
        updated[roomId] = num;
      } else {
        delete updated[roomId];
      }

      return {
        ...prev,
        assignedRooms: updated,
      };
    });
  };

  let totalAssigned = 0;
  let hasError = false;
  const roomErrors: { [key: string]: string } = {};
  for (const roomId in formData.assignedRooms || {}) {
    const assigned = parseInt(formData.assignedRooms[roomId] || 0);
    const room = rooms.find((r: any) => r.id === roomId);
    if (room) {
      if (assigned > room.totalAvailableSpace) {
        hasError = true;
        roomErrors[
          roomId
        ] = `Only ${room.totalAvailableSpace} vacancies available in this room.`;
      }
      totalAssigned += assigned;
    }
  }
  if (totalAssigned > totalPeople) {
    hasError = true;
  }

  const numKidsLimit = Number(formData.numKids || 0);
  const currentKidsCount = formData.guests
    ?.slice(1)
    ?.filter((guest: any) => guest?.isKid).length;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">Room Assignment</h3>
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 flex items-center">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Total people to assign: {totalPeople} (including primary user).
            Assign people to rooms without exceeding vacancies.
          </AlertDescription>
        </Alert>
        {rooms.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room: any) => (
              <div
                key={room.id}
                className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-semibold text-sm text-gray-800">
                    Room {room.roomNumber}
                  </Label>
                  <Badge
                    variant="outline"
                    className="bg-[#F87D7D] text-white border-[#F87D7D] font-medium"
                  >
                    Total Available Space: {room.totalAvailableSpace}
                  </Badge>
                </div>
                <div className="w-full flex flex-wrap gap-2 mb-3">
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
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 border-blue-300"
                  >
                    Status: {room.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">
                      Location: {room.location}
                    </p>
                    <p className="text-xs text-gray-600">
                      Room Type: {room.roomType}
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
                    <p className="text-xs text-black mt-2">
                      {room.recommendedFor}
                    </p>
                  </div>
                  <Label htmlFor={`assign-${room.id}`} className="text-black">
                    Assign people
                  </Label>
                  <Input
                    id={`assign-${room.id}`}
                    type="number"
                    min="0"
                    max={room.totalAvailableSpace}
                    value={formData.assignedRooms?.[room.id] || ""}
                    onFocus={() =>
                      setTouchedRooms((prev) => ({ ...prev, [room.id]: true }))
                    }
                    onChange={(e) =>
                      handleRoomAssignmentChange(room.id, e.target.value)
                    }
                    placeholder="0"
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                  {touchedRooms[room.id] && roomErrors[room.id] && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{roomErrors[room.id]}</AlertDescription>
                    </Alert>
                  )}
                  {touchedRooms[room.id] && totalAssigned !== totalPeople && (
                    <Alert variant="destructive" className="mt-2">
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
            ))}
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            No rooms available for current number of people.
          </div>
        )}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm font-medium text-gray-800">
            Total assigned: {totalAssigned} / {totalPeople}
          </p>
        </div>
      </div>
      {dependants > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Dependants Information
          </h3>
          {Array.from({ length: dependants }, (_, idx) => idx + 1).map((i) => (
            <div
              key={i}
              className="border p-6 rounded-lg bg-white shadow-sm relative hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-md mb-4 text-gray-800">
                Dependant {i}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">Name *</Label>
                  <Input
                    placeholder="Full Name"
                    value={formData.guests?.[i]?.fullName || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "fullName", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                  {errors[i]?.fullName && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors[i].fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`emailAddress-${i}`}
                    className="text-gray-600"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id={`emailAddress-${i}`}
                    type="email"
                    placeholder="user@temp.com"
                    value={formData.guests?.[i]?.emailAddress || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "emailAddress", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                  {errors[i]?.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors[i].email}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`phone-${i}`} className="text-gray-600">
                    Phone Number *
                  </Label>
                  <StyledPhoneInput
                    id={`phone-${i}`}
                    value={formData.guests?.[i]?.phoneNumber || ""}
                    onChange={(value) =>
                      handleDependantChange(i, "phoneNumber", value)
                    }
                    error={validatePhone(formData.guests?.[i]?.phoneNumber)}
                    defaultCountry="GB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`dob-${i}`} className="text-gray-600">
                    Date of Birth *
                  </Label>
                  <Input
                    id={`dob-${i}`}
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={formData.guests?.[i]?.dateOfBirth || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "dateOfBirth", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                  {errors[i]?.dob && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors[i].dob}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`gender-${i}`} className="text-gray-600">
                    Gender
                  </Label>
                  <Select
                    value={formData.guests?.[i]?.gender || ""}
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
                    value={formData.guests?.[i]?.nationality || ""}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`portNumber-${i}`} className="text-gray-600">
                    Port Number *
                  </Label>
                  <Input
                    id={`portNumber-${i}`}
                    placeholder="Enter port number"
                    value={formData.guests?.[i]?.portNumber || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "portNumber", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                  {errors[i]?.portNumber && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors[i].portNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`language-${i}`} className="text-gray-600">
                    Language
                  </Label>
                  <Select
                    value={formData.guests?.[i]?.language || ""}
                    onValueChange={(value) =>
                      handleDependantChange(i, "language", value)
                    }
                  >
                    <SelectTrigger
                      id={`language-${i}`}
                      className="w-full border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                    >
                      <SelectValue placeholder="Select preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                    value={formData.guests?.[i]?.additionalNotes || ""}
                    onChange={(e) =>
                      handleDependantChange(
                        i,
                        "additionalNotes",
                        e.target.value
                      )
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                  {errors[i]?.additionalNotes && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />{" "}
                      {errors[i].additionalNotes}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`address-${i}`} className="text-gray-600">
                    Address
                  </Label>
                  <Textarea
                    id={`address-${i}`}
                    placeholder="Enter address"
                    value={formData.guests?.[i]?.address || ""}
                    onChange={(e) =>
                      handleDependantChange(i, "address", e.target.value)
                    }
                    className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
                  />
                  {errors[i]?.address && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors[i].address}
                    </p>
                  )}
                </div>
              </div>
              {Number(formData.numKids || 0) > 0 && (
                <div className="mt-4">
                  <Card className="shadow-lg bg-white border border-gray-200 rounded-xl">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`isKid-${i}`}
                          checked={formData?.guests?.[i]?.isKid || false}
                          onCheckedChange={(checked) =>
                            handleDependantChange(
                              i,
                              "isKid",
                              checked as boolean
                            )
                          }
                          disabled={
                            !formData?.guests?.[i]?.isKid &&
                            currentKidsCount >= numKidsLimit
                          }
                          className="border-[#F87D7D] data-[state=checked]:bg-[#F87D7D]"
                        />
                        <Label
                          htmlFor={`isKid-${i}`}
                          className="text-gray-700 text-sm leading-relaxed"
                        >
                          If Kid Then check
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
