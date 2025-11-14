import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export const useCreateGuest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

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
      router.push("/service-users");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to add service user.",
        variant: "destructive",
      });
    },
  });
};
