import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface CreateFoodCategoryData {
  name: string;
}

export const useCreateFoodCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFoodCategoryData) => {
      const response = await api.post("/meal-and-meal-images/category", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodCategories"] });
    },
  });
};
