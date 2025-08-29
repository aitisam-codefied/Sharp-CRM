// hooks/useGetMealMarkings.js (Separate hook file)
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetMealMarkings = (date: any) => {
  return useQuery({
    queryKey: ["mealMarkings", date],
    queryFn: async () => {
      const response = await api.get(`/meal-marking/list?date=${date}`);
      return response.data.data.results;
    },
    enabled: !!date, // Only fetch if date is set
  });
};
