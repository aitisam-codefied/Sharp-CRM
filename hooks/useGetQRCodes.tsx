import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetQRCodes = () => {
  return useQuery({
    queryKey: ["qrcodes"],
    queryFn: async () => {
      const response = await api.get("/qr-code/list");
      if (!response.data.success) {
        throw new Error("Failed to fetch QR codes");
      }
      return response.data.qrcodes;
    },
  });
};
