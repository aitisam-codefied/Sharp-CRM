import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { CreateFoodData } from "./useCreateFood"; // Import from your create hook file

export const useUpdateFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateFoodData }) => {
      const formData = new FormData();
      // Add basic fields (always send for update)
      formData.append("categoryId", data.categoryId);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("mealType", data.mealType);
      formData.append("preparationTime", data.preparationTime.toString());

      // Add nutritional info if provided
      if (Object.keys(data.nutritionalInfo).length > 0) {
        formData.append(
          "nutritionalInfo",
          JSON.stringify(data.nutritionalInfo)
        );
      }

      // Add images only if new files are provided (server keeps existing otherwise)
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await api.patch(
        `/meal-and-meal-images/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });
};
