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
  });

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

  // const branches = allBranches.map((b) => b.name);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const maxDate = eighteenYearsAgo.toISOString().split("T")[0]; // yyyy-mm-dd

  const handleInputChange = (e: any, guestIndex?: number) => {
    const { id, value } = e.target;

    // ✅ Full Name max 20 chars
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

    // ✅ Email strict validation
    if (id === "emailAddress") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // must end with at least 2 letters
      if (value && !emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          emailAddress: "Invalid email format",
        }));
      } else {
        setErrors((prev) => ({ ...prev, emailAddress: "" }));
      }
    }

    // ✅ Address max 150
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

    // ✅ Additional Notes max 150
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

    // ✅ DOB (already added by you)
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

    // 🔹 Rest of your update logic (unchanged) ...
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="Enter full name"
            value={formData.guests[0].fullName || ""}
            onChange={(e) => handleInputChange(e, 0)}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emailAddress">Email Address *</Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="user@temp.com"
            value={formData.guests[0].emailAddress || ""}
            onChange={(e) => handleInputChange(e, 0)}
          />
          {errors.emailAddress && (
            <p className="text-red-500 text-sm">{errors.emailAddress}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
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
            defaultCountry="GB" // 👈 change this if you want another default
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            max={maxDate} // 🔹 disables today & future & under-18
            value={formData.guests[0].dateOfBirth || ""}
            onChange={(e) => handleInputChange(e, 0)}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
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
            <SelectTrigger>
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
          <Label htmlFor="nationality">Nationality *</Label>
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
            <SelectTrigger>
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

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter address"
            value={formData.guests[0].address || ""}
            onChange={(e) => handleInputChange(e, 0)}
            className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Enter any additional notes"
            value={formData.guests[0].additionalNotes || ""}
            onChange={(e) => handleInputChange(e, 0)}
            className="border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors"
          />
          {errors.additionalNotes && (
            <p className="text-red-500 text-sm">{errors.additionalNotes}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
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
            <SelectTrigger className="w-full border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] transition-colors">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="branch">Branch *</Label>
          <Select
            value={formData.branchId || ""}
            onValueChange={(value) =>
              setFormData((prev: any) => ({ ...prev, branchId: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {allBranches?.map((branch: any) => (
                <SelectItem key={branch.id} value={branch.id}>
                  <div className="flex items-center gap-2">
                    <span>{branch.name}</span>-
                    <Badge className="bg-[#F87D7D] text-white">
                      {branch.company}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfDependents">Number of Dependants *</Label>
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
          />
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
