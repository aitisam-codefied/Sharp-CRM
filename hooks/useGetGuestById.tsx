import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ServiceUser } from "@/lib/types";
import api from "@/lib/axios";

export const useGetGuestById = (id: string) => {
  return useQuery<ServiceUser>({
    queryKey: ["guest", id],
    queryFn: async () => {
      const response = await api.get(`/guest/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
