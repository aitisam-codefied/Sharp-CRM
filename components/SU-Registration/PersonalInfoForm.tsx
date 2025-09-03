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

export default function PersonalInfoForm({ formData, setFormData }: any) {
  const [showModal, setShowModal] = useState(false);
  const { data: branchData } = useBranches();

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

  // const branches = allBranches.map((b) => b.name);

  const handleInputChange = (e: any, guestIndex?: number) => {
    const { id, value } = e.target;
    // console.log("Updating field:", id, "with value:", value);
    // console.log("guestIndex:", guestIndex);
    setFormData((prev: any) => {
      let newData = { ...prev };

      // 🔹 If updating guest field
      if (guestIndex !== undefined) {
        newData.guests = prev.guests.map((guest: any, index: number) =>
          index === guestIndex ? { ...guest, [id]: value } : guest
        );
      } else {
        // 🔹 Normal top-level field update
        newData = { ...newData, [id]: value };

        // Clean up dependants array if number of dependants is reduced
        if (id === "numberOfDependents") {
          const newDependants = Array.isArray(prev.guests[0].numberOfDependents)
            ? prev.guests[0].numberOfDependents.slice(0, parseInt(value || "0"))
            : Array(parseInt(value || "0")).fill({});
          newData.guests[0].numberOfDependents = newDependants;
          newData.roomAssignments = {};
        }
        console.log("value", value);
        if ((id === "numberOfDependents" && value) || 0 >= 5) {
          setShowModal(true);
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="user@temp.com"
            value={formData.guests[0].emailAddress || ""}
            onChange={(e) => handleInputChange(e, 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="+44 7700 900000"
            value={formData.guests[0].phoneNumber || ""}
            onChange={(e) => handleInputChange(e, 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.guests[0].dateOfBirth || ""}
            onChange={(e) => handleInputChange(e, 0)}
          />
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
          <Label htmlFor="numberOfDependents">Number of Dependants</Label>
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
              } else if (val >= 5) {
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
        />
      )}
    </div>
  );
}
