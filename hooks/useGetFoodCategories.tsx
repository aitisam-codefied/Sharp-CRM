import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface FoodCategory {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useGetFoodCategories = () => {
  return useQuery<FoodCategory[]>({
    queryKey: ["foodCategories"],
    queryFn: async () => {
      const response = await api.get("/meal-and-meal-images/categories");
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch food categories");
      }
    },
  });
};
