import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GuestFormData } from "@/lib/types";
import api from "@/lib/axios";

export const useUpdateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<GuestFormData>;
    }) => {
      const response = await api.patch(`/guest/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["guest"] });
    },
  });
};
