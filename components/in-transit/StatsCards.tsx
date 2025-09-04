// src/components/in-transit/StatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Calendar, Clock, AlertTriangle } from "lucide-react";
import { InTransitUser } from "@/hooks/useGetInTransitUsers";

interface StatsCardsProps {
  filteredUsers: InTransitUser[];
}

export default function StatsCards({ filteredUsers }: StatsCardsProps) {
  const getStats = () => {
    const totalInTransit = filteredUsers.length;
    const arrivingToday = filteredUsers.filter(
      (u) => u.expectedArrival === new Date().toISOString().split("T")[0]
    ).length;
    const delayed = filteredUsers.filter((u) => u.status === "delayed").length;
    const inTransit = filteredUsers.filter(
      (u) => u.status === "in_transit"
    ).length;

    return { totalInTransit, arrivingToday, delayed, inTransit };
  };

  const stats = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total In-Transit</p>
              <p className="text-2xl font-bold">{stats.totalInTransit}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Arriving Today</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.arrivingToday}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Currently In-Transit
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.inTransit}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Delayed</p>
              <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
