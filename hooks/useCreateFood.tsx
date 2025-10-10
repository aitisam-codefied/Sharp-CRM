"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface CreateFoodData {
  categoryId: string;
  name: string;
  mealType: "Breakfast" | "Lunch" | "Dinner";
  images?: File[];
}

export const useCreateFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFoodData) => {
      const formData = new FormData();

      // Add basic fields
      formData.append("categoryId", data.categoryId);
      formData.append("name", data.name);
      formData.append("mealType", data.mealType);

      // Add images if any
      if (data.images) {
        data.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await api.post(
        "/meal-and-meal-images/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });
};
