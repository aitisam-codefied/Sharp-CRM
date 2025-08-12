import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GuestFormData } from "@/lib/types";
import api from "@/lib/axios";

export const useCreateGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GuestFormData) => api.post("/guest/create", data),
    onSuccess: () => {
      // ✅ Auto refresh the service users table
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
};
