// hooks/useDeleteBranch.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (branchId: string) => {
      const response = await api.delete(`/branch/${branchId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
