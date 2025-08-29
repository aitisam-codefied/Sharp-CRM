// hooks/useUpdateMedicalStaff.ts
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateStaffData {
  fullName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  type?: string;
}

export const useUpdateMedicalStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStaffData }) => {
      const response = await api.patch(`/medical/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalStaff"] });
    },
  });
};
