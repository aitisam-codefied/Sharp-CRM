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
  breakStartTime?: string;
  breakEndTime?: string;
  totalBreakMinutes?: number;
  isBreakExtended?: boolean;
  breakExtensionMinutes?: number;
  breakReason?: string;
  breakNotes?: string;
  isBypass?: boolean;
  isDisconnection?: boolean;
  disconnectionMinutes?: number;
  disconnectionReason?: string;
  sessionType?: string;
  previousRecordId?: string;
  reconnectionTime?: string;
  clockOutId?: string;
  clockOutAt?: string;
  disconnectionTime?: string;
  sessionEnded?: boolean;
}

interface Action {
  actionType: string;
  timestamp: string;
  notes: string;
  metadata: ActionMetadata;
  stepNumber: number;
  duration: number;
  _id: string;
}

interface UserId {
  _id: string;
  username: string;
  fullName: string;
}

interface BranchId {
  _id: string;
  name: string;
}

interface Performance {
  totalActions: number;
  averageActionTime: number;
  idleTime: number;
  lastActivity: string;
}

interface Log {
  _id: string;
  sessionId: string;
  userId: UserId;
  moduleType: string;
  activityType: string;
  resource: string;
  resourceId: string;
  branchId: BranchId;
  locationIds: string[];
  userRole: string;
  userPermissions: string[];
  details: {
    qrCodeId: string;
    entryMethod: string;
    clockInSessionId: string | null;
  };
  metadata: {
    scope: {
      branchId: string;
    };
    isShiftActive: boolean;
  };
  startedAt: string;
  isActive: boolean;
  moduleStatus: string;
  currentStep: string;
  totalSteps: number;
  progress: number;
  actions: Action[];
  performance: Performance;
  severity: string;
  category: string;
  errors: any[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  [key: string]: Log | boolean; // Allow numeric keys for logs and 'success' boolean
}

const fetchActivityLogs = async () => {
  const response = await api.get<ApiResponse>(`/activity-log/list?limit=1000`);
  if (!response.data.success) {
    throw new Error("Failed to fetch activity logs");
  }

  // Extract logs from numeric keys and flatten actions
  const logs: Log[] = Object.keys(response.data)
    .filter((key) => key !== "success")
    .map((key) => response.data[key] as Log);

  // Flatten actions into a format compatible with the component
  const flattenedLogs = logs.flatMap((log) =>
    log.actions.map((action) => ({
      _id: action._id,
      sessionId: log.sessionId,
      userId: log.userId._id,
      fullName: log.userId.fullName,
      username: log.userId.username,
      moduleType: log.moduleType,
      actionType: action.actionType,
      timestamp: action.timestamp,
      notes: action.notes,
      metadata: action.metadata,
      severity: log.severity,
      category: log.category,
      startedAt: log.startedAt,
      endedAt: log.updatedAt,
      durationMinutes:
        action.metadata.totalBreakMinutes || action.duration || 0,
      moduleStatus: log.moduleStatus,
      totalActions: log.performance.totalActions,
    }))
  );

  return flattenedLogs;
};

export const useActivityLogs = () => {
  return useQuery({
    queryKey: ["activityLogs"],
    queryFn: fetchActivityLogs,
  });
};
