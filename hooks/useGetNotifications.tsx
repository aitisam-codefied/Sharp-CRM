import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notification/list");
      if (!response.data.success) {
        throw new Error("Failed to fetch notifications");
      }
      return response.data.notifications;
    },
  });
};
