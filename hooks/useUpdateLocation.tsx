// hooks/useUpdateBranch.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const updateLocation = async ({
  locationId,
  data,
}: {
  locationId: string;
  data: { name: string };
}) => {
  const response = await api.patch(`/location/${locationId}`, data);
  return response.data;
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
    },
  });
};
