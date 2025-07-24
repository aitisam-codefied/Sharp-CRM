import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (otp: string) => {
      const response = await api.post("/auth/verify-otp-token", {
         otp,
      });
      return response.data;
    },
  });
};
