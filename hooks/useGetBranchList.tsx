import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { BranchListResponse, BranchListItem } from "@/lib/types";

export const useGetBranchList = () => {
  return useQuery({
    queryKey: ["branchList"],
    queryFn: async (): Promise<BranchListItem[]> => {
      const res = await api.get<BranchListResponse>("/branch/list");
      if (res.data.success) {
        return res.data.branches;
      } else {
        throw new Error("Failed to fetch branch list");
      }
    },
  });
};
