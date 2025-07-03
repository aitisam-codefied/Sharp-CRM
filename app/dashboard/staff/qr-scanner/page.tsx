"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QRScanner } from "@/components/qr-scanner"

export default function QRScannerPage() {
  const handleScan = (data: string) => {
    console.log("Scanned data:", data)
    // Handle the scanned data based on the code type
    if (data.includes("USER")) {
      // Redirect to user profile or meal marking
      console.log("User code detected")
    } else if (data.includes("MEAL")) {
      // Handle meal-related scan
      console.log("Meal code detected")
    } else if (data.includes("WELFARE")) {
      // Handle welfare check scan
      console.log("Welfare code detected")
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: "Staff Dashboard", href: "/dashboard/staff" }, { label: "QR Scanner" }]}>
      <div className="max-w-2xl mx-auto">
        <QRScanner
          onScan={handleScan}
          title="Multi-Purpose QR Scanner"
          description="Scan QR codes for meal marking, welfare checks, or user identification"
          expectedFormat="SMS-[TYPE]-[ID]"
        />
      </div>
    </DashboardLayout>
  )
}
