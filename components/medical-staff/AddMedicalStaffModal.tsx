"use client";

import { use, useEffect, useState } from "react";
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
import { StyledPhoneInput, validatePhone } from "../StyledFormInputWrapper";
import { useCompanies } from "@/hooks/useCompnay";
import { useMedicalStaff } from "@/hooks/useGetMedicalStaff";

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
  const [medicalTrainingDone, setMedicalTrainingDone] = useState(true);

  // NEW: replacement related states
  const [isReplacement, setIsReplacement] = useState<"no" | "yes">("no");
  const [replacementId, setReplacementId] = useState("");
  const [replacementOptions, setReplacementOptions] = useState<any[]>([]);

  const { toast } = useToast();
  const createMutation = useCreateMedicalStaff();
  const { data: companyData } = useCompanies();
  const { data: medicalStaff } = useMedicalStaff(500);

  useEffect(() => {
    // only log when medicalStaff changes (avoid logging every render)
    console.log("medicalStaff", medicalStaff?.results || []);
  }, [medicalStaff]);

  // 🔹 Handle company selection → set its branches
  const handleCompanyChange = (id: string) => {
    setCompanyId(id);
    const selectedCompany = companyData?.find((c: any) => c._id === id);
    if (selectedCompany) {
      const branchIds = selectedCompany.branches.map((b: any) => b._id);
      setBranches(branchIds);
    } else {
      setBranches([]);
    }
  };

  // useEffect(() => {
  //   if (!type) {
  //     setReplacementOptions([]);
  //     setReplacementId("");
  //     return;
  //   }

  //   const staffList = medicalStaff?.results || [];
  //   const filtered = staffList.filter((s: any) => s.type === type);
  //   setReplacementOptions(filtered);

  //   if (replacementId && !filtered.find((f: any) => f._id === replacementId)) {
  //     setReplacementId("");
  //   }
  // }, [type, medicalStaff]);

  useEffect(() => {
    if (!type || !companyId) {
      setReplacementOptions([]);
      setReplacementId("");
      return;
    }

    const staffList = medicalStaff?.results || [];

    const filtered = staffList.filter((s: any) => {
      return (
        s.type === type &&
        s.branches?.some((b: any) => b.companyId?._id === companyId)
      );
    });

    setReplacementOptions(filtered);

    if (replacementId && !filtered.find((f: any) => f._id === replacementId)) {
      setReplacementId("");
    }
  }, [type, companyId, medicalStaff]);

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

    // reset replacement states
    setIsReplacement("no");
    setReplacementId("");
    setReplacementOptions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    // Build payload and include conditional replacement id key
    const payload: any = {
      branches, // 🔹 Now full list of branch ids from selected company
      fullName,
      phoneNumber,
      emailAddress,
      type,
      status,
      medicalTrainingDone,
    };

    if (isReplacement === "yes" && replacementId) {
      payload.replacementId = replacementId;
    }

    createMutation.mutate(payload, {
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
            error.response?.data?.details ||
            error.message ||
            "Failed to add staff member.",
          variant: "destructive",
        });
      },
    });
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
              {/* clear replacement when changing type */}
              <Select
                value={type}
                onValueChange={(val) => {
                  setType(val);
                  setReplacementId("");
                }}
              >
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

          {/* Medical Training Completed */}
          <div className="mt-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={medicalTrainingDone}
                onChange={(e) => setMedicalTrainingDone(e.target.checked)}
                className="h-4 w-4"
              />
              Training Completed?
            </label>
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

          {/* NEW: Replacement controls (placed under Company as requested) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Replacement? Yes / No */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Is this a replacement?
              </label>
              <Select
                value={isReplacement}
                onValueChange={(val) => {
                  setIsReplacement(val as "no" | "yes");
                  if (val === "no") setReplacementId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Replacement staff dropdown — disabled until `type` is selected and user chose Yes */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Replacement staff
              </label>
              <Select value={replacementId} onValueChange={setReplacementId}>
                <SelectTrigger
                  disabled={
                    isReplacement !== "yes" ||
                    !type ||
                    replacementOptions.length === 0
                  }
                >
                  <SelectValue
                    placeholder={
                      isReplacement !== "yes"
                        ? "Choose Yes above"
                        : !type
                        ? "Select Type first"
                        : "Select replacement staff (optional)"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {replacementOptions.length > 0 ? (
                    replacementOptions.map((s: any) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.fullName}{" "}
                        {s.email
                          ? `- ${s.email}`
                          : s.phoneNumber
                          ? `- ${s.phoneNumber}`
                          : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-staff" disabled>
                      No staff available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Optional — leave empty if not a replacement.
              </p>
            </div>
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
