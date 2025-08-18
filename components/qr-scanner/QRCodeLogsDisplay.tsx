import { Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface QRCodeLog {
  _id: string;
  staffId: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
  };
  qrCodeId: { _id: string; type: string; code: string };
  branchId: { _id: string; name: string; address: string };
  startedAt: string;
  durationMaxLimitMinutes: number;
  isActive: boolean;
  actions: {
    actionType: string;
    timestamp: string;
    notes: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface QRCodeLogsDisplayProps {
  qrCodeLogs: QRCodeLog[];
  isLoading: boolean;
}

export function QRCodeLogsDisplay({
  qrCodeLogs,
  isLoading,
}: QRCodeLogsDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F87D7D]"></div>
      </div>
    );
  }

  if (!qrCodeLogs.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No QR code logs available.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Flatten and sort all actions by timestamp in descending order
  const allActions = qrCodeLogs
    .flatMap((log) =>
      log.actions.map((action) => ({
        ...action,
        staffName: log.staffId?.fullName,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[#F87D7D]">Action Log</h3>
      {allActions.length > 0 ? (
        <ul className="space-y-2">
          {allActions.map((action) => (
            <li
              key={action._id}
              className="text-xs p-2 rounded-md gap-2 bg-gray-50"
            >
              <div className="flex flex-col items-start gap-2">
                <span className="text-xs py-1 text-black rounded-full">
                  [{formatDate(action.timestamp)}]
                </span>
                <span className="font-normal text-sm text-black">
                  {action.staffName}:{" "}
                  <Badge className="text-[10px] bg-muted-foreground text-white">
                    {action.actionType}
                  </Badge>
                </span>
              </div>
              <div className="mt-2">
                {action.notes && (
                  <p className="text-xs text-gray-600">{action.notes}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No actions recorded.</p>
      )}
    </div>
  );
}
