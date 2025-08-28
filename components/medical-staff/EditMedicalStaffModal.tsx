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
    name: string;
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
  const [name, setName] = useState(staff.name);
  const [type, setType] = useState(staff.type);
  const { mutate: updateStaff, isPending } = useUpdateMedicalStaff();
  const { toast } = useToast();

  const handleSubmit = () => {
    const updatedData: { name?: string; type?: string } = {};
    if (name !== staff.name) updatedData.name = name;
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
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
