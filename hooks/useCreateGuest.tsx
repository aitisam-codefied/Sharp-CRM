import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GuestFormData } from "@/lib/types";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export const useCreateGuest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: FormData) =>
      api.post("/guest/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      // ✅ Auto refresh the service users table
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      router.push("/dashboard/admin/service-users");
    },
  });
};
