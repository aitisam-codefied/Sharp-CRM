// hooks/useUpdateMedicalStaffStatus.ts
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdateStatusData {
  status: "active" | "inactive";
}

export const useUpdateMedicalStaffStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStatusData;
    }) => {
      const response = await api.patch(`/medical/${id}/status`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalStaff"] });
    },
  });
};
