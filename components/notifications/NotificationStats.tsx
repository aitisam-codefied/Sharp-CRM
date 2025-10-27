import { Card, CardContent } from "@/components/ui/card";
import { Bell, AlertTriangle, Calendar } from "lucide-react";

interface Stats {
  totalNotifications: number;
  activeNotifications: number;
  highPriorityNotifications: number;
  scheduledNotifications: number;
}

interface NotificationStatsProps {
  stats: Stats;
}

export function NotificationStats({ stats }: NotificationStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Notifications
              </p>
              <p className="text-2xl font-bold">{stats.totalNotifications}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>{" "}
              {/* Changed from "Pending" */}
              <p className="text-2xl font-bold text-red-600">
                {stats.highPriorityNotifications}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>{" "}
              {/* Changed from "Read" */}
              <p className="text-2xl font-bold text-blue-600">
                {stats.scheduledNotifications}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
