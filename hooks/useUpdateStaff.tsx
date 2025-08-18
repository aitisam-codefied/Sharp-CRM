// hooks/useUpdateStaff.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

const updateStaff = async ({
  id,
  staffData,
}: {
  id: string;
  staffData: any;
}) => {
  console.log("Sending staff update:", staffData);
  const response = await api.patch(`/user/${id}`, staffData);
  return response.data;
};

export function useUpdateStaff(
  onUpdate?: (id: string, data: any) => void,
  onClose?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStaff,
    onSuccess: (data, variables) => {
      toast({
        title: "Staff Member Updated",
        description: `Staff member ${
          data?.fullName ||  "staff"
        } has been successfully updated.`,
      });

      const updatedData = {
        id: data?._id,
        fullName: data?.fullName,
        emailAddress: data?.emailAddress,
        phoneNumber: data?.phoneNumber,
        joinDate: data?.joinDate,
        roles: data?.roles,
        branch: data?.branchId,
        locations: data?.locations,
        company: data?.companyId || "",
      };

      if (onUpdate) onUpdate(data?._id, updatedData);

      queryClient.invalidateQueries({ queryKey: ["staffList"] });

      if (onClose) onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Staff",
        description:
          error.response?.data?.error ||
          "Failed to update staff member. Please try again.",
        variant: "destructive",
      });
    },
  });
}
