import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GuestFormData } from "@/lib/types";
import api from "@/lib/axios";

export const useGetGuests = () => {
  return useQuery<GuestFormData[]>({
    queryKey: ["guests"],
    queryFn: async () => {
      const response = await api.get("/guest/list", {
        params: { limit: 1000 }, // 🚨 fetch ALL guests
      });
      return response.data.guests;
    },
  });
};
