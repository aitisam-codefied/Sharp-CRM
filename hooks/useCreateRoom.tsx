import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Room {
  roomNumber: string;
  type: string;
  amenities: string[];
}

interface CreateRoomData {
  locationId: string;
  rooms: Room[];
}

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomData) => {
      const response = await api.post("/room/create", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
