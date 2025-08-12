import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GuestFormData } from "@/lib/types";
import api from "@/lib/axios";

export const useGetGuests = () => {
  return useQuery<GuestFormData[]>({
    queryKey: ["guests"],
    queryFn: async () => {
      const response = await api.get("/guest/list");
      return response.data.guests;
    },
  });
};
