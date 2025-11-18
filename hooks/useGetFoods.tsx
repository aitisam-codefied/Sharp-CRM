"use client"

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Food {
  _id: string;
  branchId: {
    _id: string;
    name: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  name: string;
  description: string;
  images: string[];
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' ;
  dietaryTags: string[];
  allergens: string[];
  nutritionalInfo: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  preparationTime: number;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useGetFoods = (branchId?: string) => {
  return useQuery<Food[]>({
    queryKey: ["foods", branchId],
    queryFn: async () => {
      const params = branchId && branchId !== "all-branches" ? { branchId } : {};
      const response = await api.get("/meal-and-meal-images/list", { params });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch foods");
      }
    },
  });
};
