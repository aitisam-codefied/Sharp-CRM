"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { QRScanner } from "@/components/qr-scanner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, History, Settings, Zap } from "lucide-react";

export default function QRScannerPage() {
  const handleScan = (data: string) => {
    console.log("Scanned data:", data);
    // Handle different QR code types
    if (data.includes("USER")) {
      console.log("Service user code detected");
    } else if (data.includes("MEAL")) {
      console.log("Meal code detected");
    } else if (data.includes("WELFARE")) {
      console.log("Welfare check code detected");
    } else if (data.includes("STAFF")) {
      console.log("Staff code detected");
    }
  };

  const scanTypes = [
    {
      type: "Service User",
      format: "SMS-USER-XXXX",
      description: "Scan service user QR codes for identification",
      color: "bg-blue-100 text-blue-800",
    },
    {
      type: "Meal Tracking",
      format: "SMS-MEAL-XXX-XXX",
      description: "Scan for meal attendance marking",
      color: "bg-green-100 text-green-800",
    },
    {
      type: "Welfare Check",
      format: "SMS-WELFARE-XXXX",
      description: "Scan for welfare check logging",
      color: "bg-purple-100 text-purple-800",
    },
    {
      type: "Staff Clock",
      format: "SMS-STAFF-XXXX",
      description: "Scan for staff clock in/out",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    <DashboardLayout
      title="Multi-Purpose QR Scanner"
      description="Scan QR codes for various system operations"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-red-400 text-white">
            <History className="h-4 w-4 mr-2" />
            Scan History
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent bg-white"
            >
              <QrCode className="h-6 w-6 text-red-500" />
              <span>Meal Marking</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent bg-white"
            >
              <QrCode className="h-6 w-6 text-red-500" />
              <span>Welfare Check</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent bg-white"
            >
              <QrCode className="h-6 w-6 text-red-500" />
              <span>Staff Clock</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent bg-white"
            >
              <QrCode className="h-6 w-6 text-red-500" />
              <span>User ID</span>
            </Button>
          </div>
        </CardContent>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* QR Scanner */}
          <div className="lg:col-span-2">
            <QRScanner
              onScan={handleScan}
              title="Universal QR Scanner"
              description="Scan any SMS system QR code for automatic processing"
              expectedFormat="SMS-[TYPE]-[ID]"
            />
          </div>

          {/* Supported QR Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Supported QR Types
              </CardTitle>
              <CardDescription>
                QR code formats recognized by the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanTypes.map((type, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{type.type}</h4>
                      <Badge className={type.color}>{type.format}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
