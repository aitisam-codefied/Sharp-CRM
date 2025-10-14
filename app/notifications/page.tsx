"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationStats } from "@/components/notifications/NotificationStats";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationTable } from "@/components/notifications/NotificationTable";
import { NewNotificationDialog } from "@/components/notifications/NewNotificationDialog";
import { useToast } from "@/hooks/use-toast";
import { useBranches } from "@/hooks/useGetBranches";
import { useNotifications, Notification } from "@/hooks/useNotifications"; // New import

interface Stats {
  totalNotifications: number;
  activeNotifications: number;
  highPriorityNotifications: number;
  scheduledNotifications: number;
}

const staticNotificationTypes: string[] = [
  "emergency",
  "info",
  "warning",
  "reminder",
  "alert",
];

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [isNewNotificationOpen, setIsNewNotificationOpen] =
    useState<boolean>(false);
  const { toast } = useToast();
  const { data: branchData, isLoading: branchesLoading } = useBranches();

  const { data: apiNotifications, isLoading: notificationsLoading } =
    useNotifications();

  // Dynamic options from API for filters
  const notificationTypes = [
    ...new Set(apiNotifications?.map((n: Notification) => n.type) || []),
  ];
  const statusOptions = [
    ...new Set(apiNotifications?.map((n: Notification) => n.status) || []),
  ];

  // Branches are objects with id and name
  const branches = branchData ?? [];

  const filteredNotifications: Notification[] = (apiNotifications || []).filter(
    (notification: Notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || notification.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || notification.status === selectedStatus;
      const matchesBranch =
        selectedBranch === "all" ||
        notification.metadata.branchId === selectedBranch;

      return matchesSearch && matchesType && matchesStatus && matchesBranch;
    }
  );

  const getStats = (): Stats => {
    const totalNotifications = filteredNotifications.length;
    const activeNotifications = filteredNotifications.filter(
      (n) => n.status === "SENT" // Adapt to API value
    ).length;
    const highPriorityNotifications = filteredNotifications.filter(
      (n) => n.priority === "HIGH" || n.priority === "URGENT"
    ).length;
    const scheduledNotifications = filteredNotifications.filter(
      (n) => n.status === "SCHEDULED"
    ).length;

    return {
      totalNotifications,
      activeNotifications,
      highPriorityNotifications,
      scheduledNotifications,
    };
  };

  const stats = getStats();

  return (
    <DashboardLayout
      title="Notification Management"
      description="Create, manage and track system notifications across all branches"
    >
      {notificationsLoading || branchesLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
          <p className="mt-2"> Loading Notifications...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <NotificationStats stats={stats} />
          <NotificationFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            notificationTypes={notificationTypes} // Dynamic from API
            statusOptions={statusOptions} // Dynamic from API
            branches={branches} // Pass full objects
          />
          <NotificationTable
            notifications={filteredNotifications}
            branches={branches} // New prop for lookup
            onView={(id: string) =>
              toast({
                title: "View Notification",
                description: `Opening detailed view for notification ${id}`,
              })
            }
            onDelete={(id: string) =>
              toast({
                title: "Notification Deleted",
                description: "Notification has been permanently deleted.",
                variant: "destructive",
              })
            }
          />
        </div>
      )}
    </DashboardLayout>
  );
}
