import { useState } from "react";
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

  const handleSubmit = () => {
    const updatedData: {
      fullName?: any;
      type?: string;
      emailAddress?: string;
      phoneNumber?: string;
    } = {};
    if (fullName !== staff.fullName) updatedData.fullName = fullName;
    if (type !== staff.type) updatedData.type = type;

    if (Object.keys(updatedData).length === 0) {
      toast({
        title: "No changes",
        description: "No fields were updated.",
        variant: "destructive",
      });
      return;
    }

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
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update staff details.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
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
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium">
              Phone
            </label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
