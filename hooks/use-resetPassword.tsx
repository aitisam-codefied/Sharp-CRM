import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

interface ResetPasswordInput {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const response = await api.post("/auth/password-reset", data);
      return response.data;
    },
  });
};
