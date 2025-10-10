import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateSOPDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updateData,
    }: {
      id: string;
      updateData: FormData | Record<string, any>;
    }) => {
      let config = {};
      if (updateData instanceof FormData) {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      }
      const response = await api.patch(`/sop/${id}`, updateData, config);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sopDocuments"] });
    },
  });
};
