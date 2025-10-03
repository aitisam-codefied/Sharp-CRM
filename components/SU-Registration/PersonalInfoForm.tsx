"use client";

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
import DependantsModal from "./DependantsModal";
import { useBranches } from "@/hooks/useGetBranches";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { StyledPhoneInput, validatePhone } from "../StyledFormInput";

const nationalities = [
  "Syrian",
  "Afghan",
  "Venezuelan",
  "Eritrean",
  "Iraqi",
  "Iranian",
  "Sudanese",
];

export default function PersonalInfoForm({ formData, setFormData }: any) {
  const [showModal, setShowModal] = useState(false);
  const { data: branchData } = useBranches();

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    dateOfBirth: "",
    address: "",
    additionalNotes: "",
    portNumber: "",
  });

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const maxDate = eighteenYearsAgo.toISOString().split("T")[0];

  const handleInputChange = (e: any, guestIndex?: number) => {
    const { id, value } = e.target;

    // same validation logic as before
    if (id === "fullName") {
      if (value.length > 20) {
        setErrors((prev) => ({
          ...prev,
          fullName: "Full name cannot exceed 20 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, fullName: "" }));
      }
    }

    if (id === "emailAddress") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value && !emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          emailAddress: "Invalid email format",
        }));
      } else {
        setErrors((prev) => ({ ...prev, emailAddress: "" }));
      }
    }

    if (id === "address") {
      if (value.length > 150) {
        setErrors((prev) => ({
          ...prev,
          address: "Address cannot exceed 150 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, address: "" }));
      }
    }

    if (id === "additionalNotes") {
      if (value.length > 150) {
        setErrors((prev) => ({
          ...prev,
          additionalNotes: "Additional notes cannot exceed 150 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, additionalNotes: "" }));
      }
    }

    if (id === "portNumber") {
      if (value && (value.length < 12 || value.length > 55)) {
        setErrors((prev) => ({
          ...prev,
          portNumber: "Port number must be between 12 and 55 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, portNumber: "" }));
      }
    }

    if (id === "dateOfBirth") {
      if (value) {
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        if (
          age < 18 ||
          (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
        ) {
          setErrors((prev) => ({
            ...prev,
            dateOfBirth: "Primary user should be older than 18 years",
          }));
        } else {
          setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
        }
      }
    }

    setFormData((prev: any) => {
      let newData = { ...prev };

      if (guestIndex !== undefined) {
        newData.guests = prev.guests.map((guest: any, index: number) =>
          index === guestIndex ? { ...guest, [id]: value } : guest
        );
      } else {
        newData = { ...newData, [id]: value };

        if (id === "numberOfDependents") {
          const newDependants = Array.isArray(prev.guests[0].numberOfDependents)
            ? prev.guests[0].numberOfDependents.slice(0, parseInt(value || "0"))
            : Array(parseInt(value || "0")).fill({});
          newData.guests[0].numberOfDependents = newDependants;
          newData.roomAssignments = {};
        }
      }

      return newData;
    });
  };

  return (
    <div className="space-y-8 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      {/* Full Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName" className="text-gray-700 font-medium">
            Full Name *
          </Label>
          <Input
            id="fullName"
            placeholder="Enter full name"
            value={formData.guests[0].fullName || ""}
            onChange={(e) => handleInputChange(e, 0)}
            className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="emailAddress" className="text-gray-700 font-medium">
            Email Address *
          </Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="user@temp.com"
            value={formData.guests[0].emailAddress || ""}
            onChange={(e) => handleInputChange(e, 0)}
            className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]"
          />
          {errors.emailAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
          )}
        </div>
      </div>

      {/* Phone + DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">
            Phone Number *
          </Label>
          <StyledPhoneInput
            id="phoneNumber"
            value={formData.guests[0].phoneNumber || ""}
            onChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                guests: prev.guests.map((guest: any, index: number) =>
                  index === 0 ? { ...guest, phoneNumber: value } : guest
                ),
              }))
            }
            error={validatePhone(formData.guests[0].phoneNumber)}
            defaultCountry="GB"
          />
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
            Date of Birth *
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            max={maxDate}
            value={formData.guests[0].dateOfBirth || ""}
            onChange={(e) => handleInputChange(e, 0)}
            className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      {/* Gender + Nationality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-gray-700 font-medium">Gender *</Label>
          <Select
            value={formData.guests[0].gender || ""}
            onValueChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                guests: prev.guests.map((guest: any, index: number) =>
                  index === 0 ? { ...guest, gender: value } : guest
                ),
              }))
            }
          >
            <SelectTrigger className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-700 font-medium">Nationality *</Label>
          <Select
            value={formData.guests[0].nationality || ""}
            onValueChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                guests: prev.guests.map((guest: any, index: number) =>
                  index === 0 ? { ...guest, nationality: value } : guest
                ),
              }))
            }
          >
            <SelectTrigger className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((nationality) => (
                <SelectItem key={nationality} value={nationality.toLowerCase()}>
                  {nationality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-gray-700 font-medium">Language *</Label>
          <Select
            value={formData.guests[0].language || ""}
            onValueChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                guests: prev.guests.map((guest: any, index: number) =>
                  index === 0 ? { ...guest, language: value } : guest
                ),
              }))
            }
          >
            <SelectTrigger className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]">
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
        <div>
          <Label htmlFor="portNumber" className="text-gray-700 font-medium">
            Port Number *
          </Label>
          <Input
            id="portNumber"
            type="text"
            placeholder="Enter port number"
            value={formData.guests[0].portNumber || ""}
            onChange={(e) => handleInputChange(e, 0)}
            className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]"
          />
          {errors.portNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.portNumber}</p>
          )}
        </div>
      </div>

      {/* Branch + Dependants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-gray-700 font-medium">Branch *</Label>
          <Select
            value={formData.branchId || ""}
            onValueChange={(value) =>
              setFormData((prev: any) => ({ ...prev, branchId: value }))
            }
          >
            <SelectTrigger className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {allBranches?.map((branch: any) => (
                <SelectItem key={branch.id} value={branch.id}>
                  <div className="flex items-center gap-2">
                    <span>{branch.name}</span>-
                    <Badge variant="outline" className="bg-[#F87D7D] text-white">
                      {branch.company}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-700 font-medium">
            Number of Dependants *
          </Label>
          <Input
            id="numberOfDependents"
            type="number"
            min="0"
            value={formData.guests[0].numberOfDependents || ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              handleInputChange(e, 0);

              if (val === 0) {
                setFormData((prev: any) => ({
                  ...prev,
                  areThereMultipleGuests: false,
                }));
              } else if (val >= 1) {
                setShowModal(true);
                setFormData((prev: any) => ({
                  ...prev,
                  areThereMultipleGuests: true,
                }));
              } else {
                setFormData((prev: any) => ({
                  ...prev,
                  areThereMultipleGuests: true,
                }));
              }
            }}
            className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]"
          />
        </div>
      </div>

      {/* Address + Notes  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-gray-700 font-medium">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter address"
            value={formData.guests[0].address || ""}
            onChange={(e) => handleInputChange(e, 0)}
            className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <Label className="text-gray-700 font-medium">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Enter any additional notes"
            value={formData.guests[0].additionalNotes || ""}
            onChange={(e) => handleInputChange(e, 0)}
            className="mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D]"
          />
          {errors.additionalNotes && (
            <p className="text-red-500 text-sm mt-1">
              {errors.additionalNotes}
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <DependantsModal
          setFormData={setFormData}
          onClose={() => setShowModal(false)}
          maxDependants={formData.guests[0].numberOfDependents}
        />
      )}
    </div>
  );
}
