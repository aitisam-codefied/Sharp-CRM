import { useQuery } from "@tanstack/react-query";
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
  userId: string;
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
}

const fetchActivityLogs = async () => {
  const response = await api.get<ApiResponse>(`/activity-log/list?limit=1000`);
  if (!response.data.success) {
    throw new Error("Failed to fetch activity logs");
  }
  return response.data.logs;
};

export const useActivityLogs = () => {
  return useQuery({
    queryKey: ["activityLogs"],
    queryFn: fetchActivityLogs,
  });
};
