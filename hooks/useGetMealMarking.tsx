// hooks/useGetMealMarkings.js (Separate hook file)
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetMealMarkings = () => {
  return useQuery({
    queryKey: ["mealMarkings"],
    queryFn: async () => {
      const response = await api.get(`/meal-marking/list`);
      return response.data.data.data;
    },
    // enabled: !!date, // Only fetch if date is set
  });
};
