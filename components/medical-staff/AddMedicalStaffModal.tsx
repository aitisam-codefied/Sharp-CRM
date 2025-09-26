"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateMedicalStaff } from "@/hooks/useCreateMedicalStaff";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StyledPhoneInput, validatePhone } from "../StyledFormInput";
import { useCompanies } from "@/hooks/useCompnay";

interface AddMedicalStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const staffTypes = ["Dental", "General Practitioner"];

export function AddMedicalStaffModal({
  isOpen,
  onClose,
}: AddMedicalStaffModalProps) {
  const [fullName, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("Active");
  const [companyId, setCompanyId] = useState(""); // 🔹 Selected company
  const [branches, setBranches] = useState<string[]>([]); // 🔹 Now array of branch ids
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const createMutation = useCreateMedicalStaff();
  const { data: companyData } = useCompanies();

  // 🔹 Handle company selection → set its branches
  const handleCompanyChange = (id: string) => {
    setCompanyId(id);
    const selectedCompany = companyData?.find((c: any) => c._id === id);
    if (selectedCompany) {
      const branchIds = selectedCompany.branches.map((b: any) => b._id);
      setBranches(branchIds);
    }
  };

  // 🔹 Validate fields
  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!fullName.trim()) {
      newErrors.fullName = "Name is required.";
      valid = false;
    } else if (fullName.length > 32) {
      newErrors.fullName = "Name must not exceed 32 characters.";
      valid = false;
    }

    if (!emailAddress.trim()) {
      newErrors.emailAddress = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.emailAddress = "Enter a valid email address.";
      valid = false;
    }

    const phoneErr = validatePhone(phoneNumber);
    if (phoneErr) {
      newErrors.phoneNumber = phoneErr;
      valid = false;
    }

    if (!type.trim()) {
      newErrors.type = "Type is required.";
      valid = false;
    }

    if (!companyId.trim()) {
      newErrors.company = "Company is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const resetForm = () => {
    setName("");
    setPhoneNumber("");
    setEmailAddress("");
    setType("");
    setStatus("Active");
    setCompanyId("");
    setBranches([]);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    createMutation.mutate(
      {
        branches, // 🔹 Now full list of branch ids from selected company
        fullName,
        phoneNumber,
        emailAddress,
        type,
        status,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Medical staff added successfully.",
          });
          resetForm();
          onClose();
        },
        onError: (error: any) => {
          toast({
            title: "Error Adding Staff",
            description:
              error.response?.data?.error ||
              error.message ||
              "Failed to add staff member.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const isFormValid =
    fullName.trim() &&
    fullName.length <= 32 &&
    phoneNumber.trim() &&
    !validatePhone(phoneNumber) &&
    emailAddress.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress) &&
    type.trim() &&
    companyId.trim();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medical Staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={fullName}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              {errors.emailAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailAddress}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <StyledPhoneInput
                value={phoneNumber}
                onChange={(val) => setPhoneNumber(val || "")}
                error={errors.phoneNumber}
                defaultCountry="GB"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {staffTypes.map((staffType) => (
                    <SelectItem key={staffType} value={staffType}>
                      {staffType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <Select value={companyId} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                {companyData?.map((company: any) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add Staff"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
