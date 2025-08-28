import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMedicalStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      branchId: string;
      name: string;
      type: string;
      status: string;
    }) => {
      const response = await api.post("/medical/create", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalStaff"] }); // Invalidate to refetch list
    },
  });
}
