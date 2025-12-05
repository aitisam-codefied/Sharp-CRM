import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(`/notification/${notificationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate notifications query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
