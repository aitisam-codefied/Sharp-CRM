import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { WelfareCheckResponse } from "@/lib/types";

interface UseGetWelfareChecksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useGetWelfareChecks = ({ 
  page = 1, 
  limit = 10, 
  search = "", 
  status = "all" 
}: UseGetWelfareChecksParams = {}) => {
  return useQuery<WelfareCheckResponse>({
    queryKey: ["welfare-checks", page, limit, search, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append("search", search);
      }
      
      if (status && status !== "all") {
        params.append("status", status);
      }
      
      const response = await api.get(`/welfare-check/list?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
