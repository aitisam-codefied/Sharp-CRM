"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetQRCodes } from "@/hooks/useGetQRCodes";
import { useGetQRCodeLogs } from "@/hooks/useGetQRCodeLogs";
import { BranchList } from "@/components/qr-scanner/BranchList";
import { QRCodeTable } from "@/components/qr-scanner/QRCodeTable";
import { QRCodeLogsDisplay } from "@/components/qr-scanner/QRCodeLogsDisplay";
import { useEffect, useState } from "react";

interface QRCode {
  _id: string;
  type: string;
  branchId: { _id: string; name: string; address: string };
  code: string;
  createdAt: string;
}

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

export default function QRScannerPage() {
  const { data: qrcodes = [], isPending: isQRCodesPending } = useGetQRCodes();
  const { data: qrCodeLogs = [], isPending: isLogsPending } =
    useGetQRCodeLogs();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Filter QR codes and logs based on selected branch
  const filteredQRCodes = selectedBranch
    ? qrcodes.filter((qr: QRCode) => qr.branchId._id === selectedBranch)
    : qrcodes;
  // const filteredQRCodeLogs = selectedBranch
  //   ? qrCodeLogs.filter((log: QRCodeLog) => log.branchId._id === selectedBranch)
  //   : qrCodeLogs;

  useEffect(() => {
    console.log("qrcodes", qrcodes);
    console.log("filteredQRCodes", filteredQRCodes);
    console.log("qrCodeLogs", qrCodeLogs);
    // console.log("filteredQRCodeLogs", filteredQRCodeLogs);
  }, [qrcodes, filteredQRCodes, qrCodeLogs]);

  return (
    <DashboardLayout
      title="Multi-Purpose QR Scanner"
      description="Scan QR codes for various system operations"
      actions={<div className="flex gap-2"></div>}
    >
      <div className="space-y-6">
        <CardContent>
          <BranchList onBranchSelect={setSelectedBranch} />
        </CardContent>

        {/* QR Codes Table */}
        <Card>
          <CardHeader>
            <CardTitle>QR Codes List</CardTitle>
            <CardDescription>
              {selectedBranch
                ? `QR codes for selected branch`
                : "All available QR codes from the system"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeTable
              qrcodes={filteredQRCodes}
              isLoading={isQRCodesPending}
            />
          </CardContent>
        </Card>

        {/* QR Code Logs Display */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Logs</CardTitle>
            <CardDescription>
              {selectedBranch
                ? `QR code logs for selected branch`
                : "All QR code logs from the system"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeLogsDisplay
              qrCodeLogs={qrCodeLogs}
              isLoading={isLogsPending}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
