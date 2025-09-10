import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUpdateMedicalStaff } from "@/hooks/useUpdateMedicalStaff";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditMedicalStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    type: string;
  };
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

export function EditMedicalStaffModal({
  isOpen,
  onClose,
  staff,
}: EditMedicalStaffModalProps) {
  const [fullName, setfullName] = useState(staff.fullName);
  const [emailAddress, setEmailAddress] = useState(staff.emailAddress);
  const [phoneNumber, setPhoneNumber] = useState(staff.phoneNumber);
  const [type, setType] = useState(staff.type);
  const { mutate: updateStaff, isPending } = useUpdateMedicalStaff();
  const { toast } = useToast();

  // ✅ validate inputs
  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress),
    [emailAddress]
  );

  const hasEmptyFields = useMemo(
    () =>
      !fullName.trim() ||
      !emailAddress.trim() ||
      !phoneNumber.trim() ||
      !type.trim(),
    [fullName, emailAddress, phoneNumber, type]
  );

  // ✅ check if anything changed
  const isChanged = useMemo(() => {
    return (
      fullName !== staff.fullName ||
      emailAddress !== staff.emailAddress ||
      phoneNumber !== staff.phoneNumber ||
      type !== staff.type
    );
  }, [fullName, emailAddress, phoneNumber, type, staff]);

  // ✅ final condition for enabling button
  const isFormValid = isChanged && !hasEmptyFields && isValidEmail;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const updatedData: {
      fullName?: string;
      type?: string;
      emailAddress?: string;
      phoneNumber?: string;
    } = {};
    if (fullName !== staff.fullName) updatedData.fullName = fullName;
    if (type !== staff.type) updatedData.type = type;
    if (emailAddress !== staff.emailAddress)
      updatedData.emailAddress = emailAddress;
    if (phoneNumber !== staff.phoneNumber)
      updatedData.phoneNumber = phoneNumber;

    updateStaff(
      { id: staff._id, data: updatedData },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Staff details updated successfully.",
          });
          onClose();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.details || "Failed to update staff.",
            variant: "destructive",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (isOpen && staff) {
      setfullName(staff.fullName || "");
      setEmailAddress(staff.emailAddress || "");
      setPhoneNumber(staff.phoneNumber || "");
      setType(staff.type || "");
    }
  }, [isOpen, staff]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium">
              Name
            </label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="emailAddress" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="emailAddress"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
            {!isValidEmail && emailAddress && (
              <p className="text-red-500 text-sm">Invalid email format</p>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium">
              Phone
            </label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                setPhoneNumber(onlyNums);
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium">
              Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select staff type" />
              </SelectTrigger>
              <SelectContent>
                {staffTypes.map((staffType) => (
                  <SelectItem key={staffType} value={staffType}>
                    {staffType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={!isFormValid || isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
