"use client";
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
import { useDeleteCompany } from "@/hooks/useDeleteCompany";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";

interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Array<{
    _id: string;
    name: string;
    address: string;
    locations: Array<{
      _id: string;
      name: string;
      rooms: Array<{
        _id: string;
        roomNumber: string;
        type: string;
        capacity: number;
        amenities: string[];
      }>;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function DeleteCompanyDialog({
  company,
  isOpen,
  onClose,
}: {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const { user, updateUserCompanies } = useAuth();
  const { mutate: deleteCompanyMutation, isPending } = useDeleteCompany();

  const confirmDelete = () => {
    if (!company || !user) return;

    deleteCompanyMutation(company._id, {
      onSuccess: () => {
        const updatedCompanies = user.companies.filter(
          (c) => c._id !== company._id
        );
        updateUserCompanies(updatedCompanies);
        onClose();
        toast({
          title: "Success",
          description: "Company deleted successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete company",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            company "{company?.name}" and all its branches, locations, and
            rooms.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
