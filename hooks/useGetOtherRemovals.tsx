"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useOtherRemovals = () => {
  return useQuery<any[]>({
    queryKey: ["otherRemovals"],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: any[];
      }>("/su-removal/other-removals");
      return response.data.data;
    },
  });
};
