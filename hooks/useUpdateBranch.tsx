// hooks/useUpdateBranch.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const updateBranch = async ({
  branchId,
  data,
}: {
  branchId: string;
  data: { name: string; address: string };
}) => {
  const response = await api.patch(`/branch/${branchId}`, data);
  return response.data;
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
    },
  });
};
