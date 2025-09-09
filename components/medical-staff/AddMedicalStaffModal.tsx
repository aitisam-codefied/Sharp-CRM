import { useState, useEffect } from "react";
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

interface AddMedicalStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const staffTypes = [
  "Emergency",
  "Medical",
  "Surgery",
  "Laboratory",
  "Radiology",
  "Pharmacy",
  "Nursing",
  "Dental",
  "Optical",
  "Audiology",
  "Psychology",
  "Counselling",
  "Dietitian",
  "Physical Therapy",
  "Occupational Therapy",
  "General Practitioner",
  "Nurse",
  "Nurse Assistant",
  "Other",
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

  // check agar sab fields filled hain
  const isFormValid =
    fullName.trim() &&
    phoneNumber.trim() &&
    emailAddress.trim() &&
    type.trim() &&
    branches.trim();

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Name is required.";
    if (!emailAddress.trim()) {
      newErrors.emailAddress = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.emailAddress = "Enter a valid email address.";
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone is required.";
    } else if (!/^\+?\d{7,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number.";
    }
    if (!type.trim()) newErrors.type = "Type is required.";
    if (!branches.trim()) newErrors.branches = "Branch is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          onClose();
          // Reset form
          setName("");
          setPhoneNumber("");
          setEmailAddress("");
          setType("");
          setStatus("active");
          setBranches("");
          setErrors({});
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add staff. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medical Staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => setName(e.target.value)}
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
              <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium mb-1"
            >
              Phone
            </label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, ""); // sirf digits allow
                setPhoneNumber(onlyNums);
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
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
            <label htmlFor="status" className="block text-sm font-medium mb-1">
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
