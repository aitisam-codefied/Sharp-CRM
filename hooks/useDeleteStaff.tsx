import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteStaff = async (staffId: string) => {
  const response = await api.delete(`/user/${staffId}`);
  return response.data;
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      // Invalidate staff list so it refetches fresh data
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
    onError: (error: any) => {
      console.error("Failed to delete staff", error);
    },
  });
};
