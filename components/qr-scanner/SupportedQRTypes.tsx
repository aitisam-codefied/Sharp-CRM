// src/components/SupportedQRTypes.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode } from "lucide-react";

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

export function SupportedQRTypes() {
  return (
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
  );
}
