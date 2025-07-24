
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

interface PasswordChangeRequestPayload {
  emailAddress: string;
}

export const useRequestPasswordChange = () => {
  return useMutation({
    mutationFn: async ({ emailAddress }: PasswordChangeRequestPayload) => {
      const response = await api.post("/auth/password-change-request", {
        emailAddress,
      });
      return response.data;
    },
  });
};
