import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface CreateFoodData {
  categoryId: string;
  name: string;
  description: string;
  mealType: "Breakfast" | "Lunch" | "Dinner";
  dietaryTags: string[];
  allergens: string[];
  nutritionalInfo: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  preparationTime: any;
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
      formData.append("description", data.description);
      formData.append("mealType", data.mealType);
      formData.append("preparationTime", data.preparationTime.toString());

      // Add arrays
      data.dietaryTags.forEach((tag) => {
        formData.append("dietaryTags[]", tag);
      });

      data.allergens.forEach((allergen) => {
        formData.append("allergens[]", allergen);
      });

      // // Add nutritional info as JSON string
      // if (data.nutritionalInfo) {
      //   formData.append(
      //     "nutritionalInfo",
      //     JSON.stringify(data.nutritionalInfo)
      //   );
      // }

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
