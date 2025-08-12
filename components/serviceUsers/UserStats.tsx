import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, Calendar } from "lucide-react";
import { GuestFormData, ServiceUser } from "@/lib/types";

interface UserStatsProps {
  users: GuestFormData[];
}

export function UserStats({ users }: UserStatsProps) {
  const getStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const transitioningUsers = users.filter(
      (u) => u.status === "transitioning"
    ).length;
    const newArrivals = users.filter(
      (u) =>
        new Date(u.arrivalDate) >=
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalUsers, activeUsers, transitioningUsers, newArrivals };
  };

  const stats = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Service Users
              </p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Residents</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.activeUsers}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transitioning</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.transitioningUsers}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                New Arrivals (7 days)
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.newArrivals}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
