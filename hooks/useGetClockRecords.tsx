import api from "@/lib/axios";
import { ApiClockRecord, ClockRecord } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const mapApiToRecord = (apiRecord: ApiClockRecord): ClockRecord => {
  console.log("Mapping ApiClockRecord:", apiRecord);
  const clockInDate = new Date(apiRecord.clockInTime);
  const clockOutDate = apiRecord.clockOut ? new Date(apiRecord.clockOut) : null;

  const formatTime = (date: Date): string =>
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const calculateTotalHours = (): string => {
    const endDate = clockOutDate || new Date();
    const diffMs = endDate.getTime() - clockInDate.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  const date = clockInDate.toISOString().split("T")[0];
  const location =
    apiRecord.locations.map((l) => l.name).join(", ") || "Unknown";

  let status: string = clockOutDate ? "completed" : "active";
  if (apiRecord.isOnBreak) status = "on break";
  if (apiRecord.isDisconnected) status = "disconnected";
  if (apiRecord.isLate) status = "late";
  if (apiRecord.isEarly) status = "early";
  if (apiRecord.isAbsent) status = "absent";

  const result = {
    id: apiRecord.id,
    tenantId: apiRecord.tenantId,
    branch: {
      _id: apiRecord.branch._id,
      name: apiRecord.branch.name,
    },
    locations: apiRecord.locations,
    staff: {
      _id: apiRecord.staff._id,
      username: apiRecord.staff.username,
      fullName: apiRecord.staff.fullName,
    },
    clockIn: formatTime(clockInDate),
    clockOut: clockOutDate ? formatTime(clockOutDate) : null,
    totalHours: calculateTotalHours(),
    status,
    date,
    location,
    overtime: apiRecord.isOverTime,
    shiftStart: apiRecord.shiftStart,
    shiftEnd: apiRecord.shiftEnd,
    method: apiRecord.method,
    withinPolicy: apiRecord.withinPolicy,
    deltaMinutes: apiRecord.deltaMinutes,
    createdAt: apiRecord.createdAt,
    updatedAt: apiRecord.updatedAt,
    isDisconnected: apiRecord.isDisconnected,
    disconnectionMinutes: apiRecord.disconnectionMinutes,
    disconnectionReason: apiRecord.disconnectionReason,
    sessionType: apiRecord.sessionType,
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
    clockInTime: apiRecord.clockInTime,
    currentTime: apiRecord.currentTime,
  };

  console.log("Mapped ClockRecord:", result);
  return result;
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
