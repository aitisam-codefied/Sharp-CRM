import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateShiftTimesData {
  start: string;
  end: string;
}

export const useUpdateUserShiftTimes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateShiftTimesData;
    }) => {
      const response = await api.patch(`/user/${userId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersByShiftTimes"] });
    },
  });
};

