import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Clock, Bell, MessageSquare } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  createdBy: string;
  createdAt: string;
  scheduledFor: string;
  targetAudience: string;
  branch: string;
  readCount: number;
  totalRecipients: number;
  expiresAt?: string;
  category: string;
}

interface HighPriorityAlertsProps {
  notifications: Notification[];
  onView: (id: string) => void;
}

export function HighPriorityAlerts({
  notifications,
  onView,
}: HighPriorityAlertsProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      case "reminder":
        return <Clock className="h-4 w-4" />;
      case "alert":
        return <Bell className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          High Priority Notifications
        </CardTitle>
        <CardDescription className="text-red-600">
          {notifications.length} high priority notifications require immediate
          attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg"
            >
              <div>
                <p className="font-medium text-red-900 flex items-center gap-2">
                  {getTypeIcon(notification.type)}
                  {notification.title}
                </p>
                <p className="text-sm text-red-600">{notification.message}</p>
                <p className="text-xs text-red-500">
                  {notification.branch} • {notification.readCount}/
                  {notification.totalRecipients} read
                </p>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onView(notification.id)}
              >
                Review
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
