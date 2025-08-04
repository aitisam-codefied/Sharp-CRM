// hooks/company/useUpdateCompany.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

export interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Array<{
    _id: string;
    name: string;
    address: string;
    locations: Array<{
      _id: string;
      name: string;
      rooms: Array<{
        _id: string;
        roomNumber: string;
        type: string;
        capacity: number;
        amenities: string[];
      }>;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const useUpdateCompany = (
  onSuccessCallback: (updated: Company) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Company) => {
      const response = await api.patch(`/company/${data._id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("sms_access_token")}`,
        },
      });
      return response.data;
    },
    onSuccess: (updatedCompany) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
      onSuccessCallback(updatedCompany);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update company",
        variant: "destructive",
      });
    },
  });
};
