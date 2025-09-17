import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBranches } from "@/hooks/useGetBranches";
import { useCreateMedicalStaff } from "@/hooks/useCreateMedicalStaff";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { StyledPhoneInput, validatePhone } from "../StyledFormInput";

interface AddMedicalStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const staffTypes = [
  // "Emergency",
  // "Medical",
  // "Surgery",
  // "Laboratory",
  // "Radiology",
  // "Pharmacy",
  // "Nursing",
  "Dental",
  // "Optical",
  // "Audiology",
  // "Psychology",
  // "Counselling",
  // "Dietitian",
  // "Physical Therapy",
  // "Occupational Therapy",
  "General Practitioner",
  // "Nurse",
  // "Nurse Assistant",
  // "Other",
];

export function AddMedicalStaffModal({
  isOpen,
  onClose,
}: AddMedicalStaffModalProps) {
  const [fullName, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("active");
  const [branches, setBranches] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const createMutation = useCreateMedicalStaff();
  const { data: branchData } = useBranches();

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

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

    if (!branches.trim()) {
      newErrors.branches = "Branch is required.";
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
    setStatus("active");
    setBranches("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    createMutation.mutate(
      {
        branches: [branches],
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
    branches.trim();

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
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medical Staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-1"
              >
                Name
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  setErrors((prev) => ({
                    ...prev,
                    fullName:
                      value.length > 32
                        ? "Name must not exceed 32 characters."
                        : "",
                  }));
                }}
                maxLength={40} // UI cap, but validation enforces 32
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="emailAddress"
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <Input
                id="emailAddress"
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
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium mb-1"
              >
                Phone
              </label>
              <StyledPhoneInput
                id="phoneNumber"
                value={phoneNumber}
                onChange={(val) => {
                  setPhoneNumber(val || "");
                  setErrors((prev) => ({
                    ...prev,
                    phoneNumber: validatePhone(val || ""),
                  }));
                }}
                error={errors.phoneNumber}
                defaultCountry="GB"
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Type
              </label>
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
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Branch */}
          <div>
            <label htmlFor="branch" className="block text-sm font-medium mb-1">
              Branch
            </label>
            <Select value={branches} onValueChange={setBranches}>
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {allBranches.map((branch: any) => (
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
            {errors.branches && (
              <p className="text-red-500 text-sm mt-1">{errors.branches}</p>
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
