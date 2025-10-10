import api from "@/lib/axios";
import { ApiClockRecord, ClockRecord } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const mapApiToRecord = (apiRecord: any): ClockRecord => {
  const clockInDate = apiRecord.clockIn ? new Date(apiRecord.clockIn) : null;
  const clockOutDate = apiRecord.clockOut ? new Date(apiRecord.clockOut) : null;

  const formatTime = (date: Date | null): string | null =>
    date
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : null;

  const calculateTotalHours = (): string => {
    if (!clockInDate) return "0h 0m";
    const endDate = clockOutDate || new Date();
    const diffMs = endDate.getTime() - clockInDate.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  const date = clockInDate ? clockInDate.toISOString().split("T")[0] : null;
  const location =
    apiRecord.locations && apiRecord.locations.length > 0
      ? apiRecord.locations.map((l: any) => l.name).join(", ")
      : "Unknown";

  // Prefer API currentStatus if available, fallback to logic
  let status: string =
    apiRecord.currentStatus || (clockOutDate ? "completed" : "active");
  if (apiRecord.isOnBreak) status = "on break";
  if (apiRecord.isDisconnected) status = "disconnected";
  if (apiRecord.isLate) status = "late";
  if (apiRecord.isEarly) status = "early";
  if (apiRecord.isAbsent) status = "absent";

  return {
    id: apiRecord.id,
    tenantId: apiRecord.tenantId,
    branch: apiRecord.branch,
    locations: apiRecord.locations || [],
    staff: apiRecord.staff || null,
    clockIn: formatTime(clockInDate),
    clockOut: formatTime(clockOutDate),
    totalHours: calculateTotalHours(),
    status,
    date,
    location,
    overtime: apiRecord.isOverTime || false,
    method: apiRecord.method,
    withinPolicy: apiRecord.withinPolicy,
    deltaMinutes: apiRecord.deltaMinutes,
    createdAt: apiRecord.createdAt,
    updatedAt: apiRecord.updatedAt,
    notes: apiRecord.notes || null,
    isDisconnected: apiRecord.isDisconnected,
    disconnectionTime: apiRecord.disconnectionTime,
    disconnectionMinutes: apiRecord.disconnectionMinutes,
    disconnectionReason: apiRecord.disconnectionReason,
    disconnectionNotes: apiRecord.disconnectionNotes,
    sessionType: apiRecord.sessionType,
    previousSessionId: apiRecord.previousSessionId,
    nextSessionId: apiRecord.nextSessionId,
    shiftStart: apiRecord.shiftStart || apiRecord.shiftStartTime,
    shiftEnd: apiRecord.shiftEnd || apiRecord.shiftEndTime,
    totalShiftMinutes: apiRecord.totalShiftMinutes,
    actualWorkMinutes: apiRecord.actualWorkMinutes,
    totalDisconnectionMinutes: apiRecord.totalDisconnectionMinutes,
    efficiencyPercentage: apiRecord.efficiencyPercentage,
    isLate: apiRecord.isLate,
    isEarly: apiRecord.isEarly,
    isOnBreak: apiRecord.isOnBreak,
    isOverTime: apiRecord.isOverTime,
    isAbsent: apiRecord.isAbsent,
    isClockedIn: apiRecord.isClockedIn,
    extraSubstituteMinutes: apiRecord.extraSubstituteMinutes,
    currentStatus: apiRecord.currentStatus,
    clockInTime: apiRecord.clockInTime || apiRecord.clockIn,
    currentTime: apiRecord.currentTime,
  };
};

export const useClockRecords = () => {
  return useQuery<ClockRecord[]>({
    queryKey: ["clockRecords"], // Must match setQueryData key
    queryFn: async () => {
      console.log("Fetching clock records from API");
      const response = await api.get<{
        success: boolean;
        message: string;
        data: ApiClockRecord[];
      }>("/clock-in-out/list");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch clock records"
        );
      }
      return response.data.data.map(mapApiToRecord);
    },
  });
};
