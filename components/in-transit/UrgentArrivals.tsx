// src/components/in-transit/UrgentArrivals.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { InTransitUser } from "@/hooks/useGetInTransitUsers";

interface UrgentArrivalsProps {
  filteredUsers: InTransitUser[];
  handleViewUser: (userId: string) => void;
}

export default function UrgentArrivals({
  filteredUsers,
  handleViewUser,
}: UrgentArrivalsProps) {
  const arrivingToday = filteredUsers.filter(
    (user) => user.expectedArrival === new Date().toISOString().split("T")[0]
  ).length;

  if (arrivingToday === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Arrivals Expected Today
        </CardTitle>
        <CardDescription className="text-blue-600">
          {arrivingToday} service users are expected to arrive today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredUsers
            .filter(
              (user) =>
                user.expectedArrival === new Date().toISOString().split("T")[0]
            )
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg"
              >
                <div>
                  <p className="font-medium text-blue-900">
                    {user.name} - Expected at {user.expectedTime}
                  </p>
                  <p className="text-sm text-blue-600">
                    {user.destinationBranch} - Room {user.assignedRoom}
                  </p>
                  <p className="text-xs text-blue-500">
                    Transport: {user.transportMethod} • Case Worker:{" "}
                    {user.caseWorker}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewUser(user.id)}
                >
                  Prepare
                </Button>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
