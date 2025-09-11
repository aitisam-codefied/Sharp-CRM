"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock } from "lucide-react";
import Link from "next/link";
import { useActivityLogsByModule } from "@/hooks/useGetActivityLogsByModule";
import { Button } from "@/components/ui/button";

interface ModuleLogsProps {
  moduleType: string;
  title?: string;
}

function timeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return "1 year ago";

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return "1 month ago";

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return "1 day ago";

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return "1 hour ago";

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return "1 minute ago";

  return "just now";
}

export default function ModuleLogs({ moduleType, title }: ModuleLogsProps) {
  const { data, isLoading, error } = useActivityLogsByModule(moduleType);
  const [visibleCount, setVisibleCount] = useState(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {title || `${moduleType} Logs`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading logs...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {title || `${moduleType} Logs`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading logs</p>
        </CardContent>
      </Card>
    );
  }

  // Sorted activities
  const activities =
    data?.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) ?? [];

  const visibleActivities = activities.slice(0, visibleCount);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {title || `${moduleType} Logs`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleActivities.map((log, index) => {
            const time = timeAgo(log.timestamp);
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">
                    <Link
                      href={`/dashboard/admin/staffs?highlight=${log.username}`}
                      className="hover:underline cursor-pointer"
                    >
                      {log.notes}
                    </Link>
                  </p>
                  <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="flex items-start sm:items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {time}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 rounded-md bg-green-100 text-green-700 border-green-300"
                      >
                        {log.moduleType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 border-yellow-300"
                      >
                        {log.severity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 border border-blue-300 w-fit">
                    <span className="text-black text-xs">Action:</span>{" "}
                    {log.actionType}
                  </p>
                </div>
              </div>
            );
          })}

          {activities.length === 0 && <p>No recent activities found.</p>}

          {/* Load More Button */}
          {visibleCount < activities.length && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 10)}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
