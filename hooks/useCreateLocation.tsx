import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Location {
  name: string;
  rooms: Array<{
    roomNumber: string;
    capacity: number;
    type: string;
    amenities: string[];
  }>;
}

interface CreateLocationData {
  branchId: string;
  locations: Location[];
}

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLocationData) => {
      const response = await api.post("/location/create", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
