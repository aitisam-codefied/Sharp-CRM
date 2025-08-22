import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface ActionMetadata {
  userRole?: string;
  permissions?: string[];
  entryMethod?: string;
  clockInSessionId?: string | null;
  fullName?: string;
  username?: string;
  clockInId?: string;
  shiftStart?: string;
  earliestAllowed?: string;
  deltaMinutes?: number;
  withinPolicy?: boolean;
  stepNumber?: number;
  duration?: number;
  actionId?: string;
}

interface Log {
  _id: string;
  sessionId: string;
  userId: string; // directly ID now
  fullName: string;
  username: string;
  moduleType: string;
  actionType: string;
  timestamp: string;
  notes: string;
  metadata: ActionMetadata;
  severity: string;
  category: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  moduleStatus: string;
  totalActions: number;
}

interface ApiResponse {
  success: boolean;
  logs: Log[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const fetchActivityLogs = async ({
  pageParam = 1,
}): Promise<{ logs: Log[]; pagination: ApiResponse["pagination"] }> => {
  const response = await api.get<ApiResponse>(
    `/activity-log/list?page=${pageParam}&limit=5`
  );

  if (!response.data.success) {
    throw new Error("Failed to fetch activity logs");
  }

  return {
    logs: response.data.logs,
    pagination: response.data.pagination,
  };
};

export const useActivityLogs = () => {
  return useInfiniteQuery({
    queryKey: ["activityLogs"],
    queryFn: fetchActivityLogs,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};
