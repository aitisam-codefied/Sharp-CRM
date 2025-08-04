import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";

const recentActivities = [
  {
    type: "critical",
    message: "Critical welfare check flagged - Manchester Branch",
    time: "2 minutes ago",
    branch: "Manchester",
    priority: "high",
  },
  {
    type: "incident",
    message: "New incident reported - Birmingham Branch",
    time: "15 minutes ago",
    branch: "Birmingham",
    priority: "medium",
  },
  {
    type: "staff",
    message: "Staff shortage alert - Liverpool Branch",
    time: "1 hour ago",
    branch: "Liverpool",
    priority: "high",
  },
  {
    type: "system",
    message: "Daily reports generated successfully",
    time: "2 hours ago",
    branch: "System",
    priority: "normal",
  },
];

export default function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Activities
        </CardTitle>
        <CardDescription>Latest updates from all branches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {activity.type === "critical" && (
                  <Heart className="h-4 w-4 text-red-500" />
                )}
                {activity.type === "incident" && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                {activity.type === "staff" && (
                  <Users className="h-4 w-4 text-blue-500" />
                )}
                {activity.type === "system" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {activity.branch}
                  </Badge>
                  <Badge
                    variant={
                      activity.priority === "high"
                        ? "destructive"
                        : activity.priority === "medium"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {activity.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View All Activities
        </Button>
      </CardContent>
    </Card>
  );
}
