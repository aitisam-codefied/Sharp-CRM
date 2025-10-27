"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationStats } from "@/components/notifications/NotificationStats";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationTable } from "@/components/notifications/NotificationTable";
import { NewNotificationDialog } from "@/components/notifications/NewNotificationDialog";
import { useToast } from "@/hooks/use-toast";
import { useBranches } from "@/hooks/useGetBranches";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { CustomPagination } from "@/components/CustomPagination"; // ✅ import pagination

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
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { toast } = useToast();
  const { data: branchData, isLoading: branchesLoading } = useBranches();
  const { data: apiNotifications, isLoading: notificationsLoading } =
    useNotifications();

  useEffect(() => {
    console.log("notifications", apiNotifications);
  });

  const ITEMS_PER_PAGE = 10;

  // Dynamic options from API for filters
  const notificationTypes = [
    ...new Set(apiNotifications?.map((n: Notification) => n.type) || []),
  ];
  const statusOptions = [
    ...new Set(apiNotifications?.map((n: Notification) => n.status) || []),
  ];

  const branches = branchData ?? [];

  // ✅ Filtering logic
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

      return matchesSearch && matchesType && matchesStatus;
    }
  );

  // ✅ Calculate total pages
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);

  // ✅ Paginated slice
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ✅ Reset to page 1 when filters/search change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // ✅ Stats calculation
  const getStats = (): Stats => {
    const totalNotifications = filteredNotifications.length;
    const activeNotifications = filteredNotifications.filter(
      (n) => n.status === "SENT"
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
          <p className="mt-2">Loading Notifications...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <NotificationStats stats={stats} />

          {/* ✅ Filters */}
          <NotificationFilters
            searchTerm={searchTerm}
            setSearchTerm={(val) => {
              setSearchTerm(val);
              handleFilterChange();
            }}
            selectedType={selectedType}
            setSelectedType={(val) => {
              setSelectedType(val);
              handleFilterChange();
            }}
            selectedStatus={selectedStatus}
            setSelectedStatus={(val) => {
              setSelectedStatus(val);
              handleFilterChange();
            }}
            selectedBranch={selectedBranch}
            setSelectedBranch={(val) => {
              setSelectedBranch(val);
              handleFilterChange();
            }}
            notificationTypes={notificationTypes}
            statusOptions={statusOptions}
            branches={branches}
          />

          {/* ✅ Table */}
          <NotificationTable
            notifications={paginatedNotifications}
            branches={branches}
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

          {/* ✅ Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
