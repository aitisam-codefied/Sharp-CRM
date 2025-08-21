import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  AlertTriangle,
  Info,
  Clock,
  MessageSquare,
  Calendar,
  User,
  Eye,
  Trash2,
} from "lucide-react";

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

interface NotificationTableProps {
  notifications: Notification[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationTable({
  notifications,
  onView,
  onDelete,
}: NotificationTableProps) {
  const getTypeColor = (type: string): string => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "reminder":
        return "bg-purple-100 text-purple-800";
      case "alert":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          System Notifications
        </CardTitle>
        <CardDescription>
          Manage and track all system notifications and announcements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notification Details</TableHead>
                <TableHead>Type & Priority</TableHead>
                <TableHead>Audience & Branch</TableHead>
                <TableHead>Schedule & Status</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        {getTypeIcon(notification.type)}
                        {notification.title}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {notification.id} • Category:{" "}
                        {notification.category}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type.charAt(0).toUpperCase() +
                          notification.type.slice(1)}
                      </Badge>
                      <Badge
                        className={getPriorityColor(notification.priority)}
                      >
                        {notification.priority.charAt(0).toUpperCase() +
                          notification.priority.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {notification.targetAudience
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {notification.branch}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getStatusColor(notification.status)}>
                        {notification.status.charAt(0).toUpperCase() +
                          notification.status.slice(1)}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {notification.scheduledFor}
                        </div>
                        {notification.expiresAt && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Expires: {notification.expiresAt}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {notification.readCount}/{notification.totalRecipients}{" "}
                        read
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (notification.readCount /
                                notification.totalRecipients) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(
                          (notification.readCount /
                            notification.totalRecipients) *
                          100
                        ).toFixed(0)}
                        % read
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {notification.createdBy}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(notification.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No notifications found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or create a new notification.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
