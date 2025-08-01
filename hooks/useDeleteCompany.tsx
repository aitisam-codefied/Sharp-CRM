import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteCompany = async (companyId: string) => {
  const response = await api.delete(`/company/${companyId}`);
  return response.data;
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] }); // replace with your query key
    },
  });
};
