import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface ActionMetadata {
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

export interface ActivityLog {
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
  logs: ActivityLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const fetchModuleLogs = async (moduleType: string): Promise<ActivityLog[]> => {
  const response = await api.get<ApiResponse>(
    `/activity-log/list?moduleType=${encodeURIComponent(moduleType)}`
  );
  if (!response.data.success) {
    throw new Error("Failed to fetch module logs");
  }
  return response.data.logs;
};

export const useActivityLogsByModule = (moduleType: string) => {
  return useQuery({
    queryKey: ["moduleLogs", moduleType],
    queryFn: () => fetchModuleLogs(moduleType),
    enabled: !!moduleType, // only run when moduleType provided
  });
};
