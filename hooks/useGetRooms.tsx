// hooks/useCompanies.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  amenities: string[];
}

export const useRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async (): Promise<Room[]> => {
      const res = await api.get("/room/list");
      if (res.data.success) {
        return res.data.rooms;
      } else {
        throw new Error("Failed to fetch rooms");
      }
    },
  });
};
