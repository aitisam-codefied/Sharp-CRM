"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, QrCode, Download, Users } from "lucide-react";
import ModuleLogs from "@/components/ModuleLogs";
import ClockRecordsTable from "@/components/clock-system/ClockRecordsTable";
import { useBranches } from "@/hooks/useGetBranches";
import { mapApiToRecord, useClockRecords } from "@/hooks/useGetClockRecords";
import { useQueryClient } from "@tanstack/react-query";
import { ApiClockRecord, ClockRecord } from "@/lib/types";
import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

export default function ClockSystemPage() {
  const queryClient = useQueryClient();
  const { data: clockRecords = [], isPending } = useClockRecords();
  const { data: branchData } = useBranches();

  useEffect(() => {
    console.log("clock", clockRecords);
  });

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

  // const branches = allBranches.map((b) => b.name);

  // Initialize Socket.IO and set up event listeners
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("sms_access_token") },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      // Optionally join a room, e.g., socket.emit('join', { room: 'clock-system' });
    });

    // Listener for new clock-in (add new record)
    socket.on("staff_clocked_in", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        const newRecord = mapApiToRecord(data);
        return oldData ? [...oldData, newRecord] : [newRecord];
      });
    });

    // Listener for clock-out (update existing record)
    socket.on("staff_clocked_out", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((rec) =>
          rec.id === data.id ? mapApiToRecord(data) : rec
        );
      });
    });

    // Listener for disconnection (update existing)
    socket.on("staff_disconnected", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((rec) =>
          rec.id === data.id ? mapApiToRecord(data) : rec
        );
      });
    });

    // Listener for reconnection (update existing)
    socket.on("staff_reconnected", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((rec) =>
          rec.id === data.id ? mapApiToRecord(data) : rec
        );
      });
    });

    // Listener for break start (update existing, e.g., set isOnBreak true)
    socket.on("break_started", (data: ApiClockRecord) => {
      console.log("Received break_started event:", data);
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        const updatedRecord = mapApiToRecord(data);
        console.log("Updated record:", updatedRecord);
        return oldData.map((rec) => (rec.id === data.id ? updatedRecord : rec));
      });
    });

    // Listener for break resume (update existing, e.g., set isOnBreak false)
    socket.on("break_resumed", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((rec) =>
          rec.id === data.id ? mapApiToRecord(data) : rec
        );
      });
    });

    // Listener for early departure request (update existing)
    socket.on("early_departure_requested", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((rec) =>
          rec.id === data.id ? mapApiToRecord(data) : rec
        );
      });
    });

    // Listener for early departure approved (update existing)
    socket.on("early_departure_approved", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((rec) =>
          rec.id === data.id ? mapApiToRecord(data) : rec
        );
      });
    });

    // Listener for early departure rejected (update existing)
    socket.on("early_departure_rejected", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((rec) =>
          rec.id === data.id ? mapApiToRecord(data) : rec
        );
      });
    });

    // Listener for substitute assigned (update existing)
    socket.on("substitute_assigned", (data: ApiClockRecord) => {
      queryClient.setQueryData<ClockRecord[]>(["clockRecords"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((rec) =>
          rec.id === data.id ? mapApiToRecord(data) : rec
        );
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return (
    <DashboardLayout
      title="QR Clock In/Out System"
      description="Monitor staff attendance and working hours across all branches"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance Records
            </CardTitle>
            <CardDescription>
              Real-time staff clock in/out monitoring
            </CardDescription>
          </CardHeader>
          {isPending ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
              <p className="mt-2"> Loading ClockIn/ClockOut...</p>
            </div>
          ) : (
            <CardContent>
              <ClockRecordsTable
                clockRecords={clockRecords}
                branches={allBranches}
              />
            </CardContent>
          )}
        </Card>

        <ModuleLogs
          moduleType="Clock In/Out"
          title="Clock In/Out Activity Logs"
        />
      </div>
    </DashboardLayout>
  );
}
