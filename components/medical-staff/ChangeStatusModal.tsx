// components/medical-staff/ChangeStatusModal.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpdateMedicalStaffStatus } from "@/hooks/useUpdateMedicalStaffStatus";

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  currentStatus: "Active" | "Inactive";
}

export function ChangeStatusModal({
  isOpen,
  onClose,
  staffId,
  currentStatus,
}: ChangeStatusModalProps) {
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
  const { mutate: updateStatus, isPending } = useUpdateMedicalStaffStatus();
  const { toast } = useToast();

  const handleConfirm = () => {
    updateStatus(
      { id: staffId, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Status updated to ${newStatus}.`,
          });
          onClose();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update status.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Staff Status</AlertDialogTitle>
          <AlertDialogDescription>
            You are changing staff status from {currentStatus} to {newStatus}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Updating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
