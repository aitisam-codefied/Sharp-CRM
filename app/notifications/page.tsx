"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationStats } from "@/components/notifications/NotificationStats";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationTable } from "@/components/notifications/NotificationTable";
import { HighPriorityAlerts } from "@/components/notifications/HighPriorityAlerts";
import { NewNotificationDialog } from "@/components/notifications/NewNotificationDialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBranches } from "@/hooks/useGetBranches";

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

interface Stats {
  totalNotifications: number;
  activeNotifications: number;
  highPriorityNotifications: number;
  scheduledNotifications: number;
}

const notifications: Notification[] = [
  {
    id: "NOT001",
    title: "Emergency Drill Scheduled",
    message:
      "Fire evacuation drill scheduled for tomorrow at 2:00 PM. All staff must participate.",
    type: "emergency",
    priority: "high",
    status: "active",
    createdBy: "Sarah Johnson",
    createdAt: "2024-01-15 09:30",
    scheduledFor: "2024-01-16 14:00",
    targetAudience: "all_staff",
    branch: "All Branches",
    readCount: 45,
    totalRecipients: 67,
    expiresAt: "2024-01-16 16:00",
    category: "safety",
  },
  {
    id: "NOT002",
    title: "New Service User Arrival",
    message:
      "Ahmed Al-Rashid will be arriving today at 2:30 PM. Room 208A has been prepared.",
    type: "info",
    priority: "medium",
    status: "active",
    createdBy: "Emma Wilson",
    createdAt: "2024-01-15 11:15",
    scheduledFor: "2024-01-15 11:15",
    targetAudience: "manchester_staff",
    branch: "Manchester",
    readCount: 12,
    totalRecipients: 15,
    expiresAt: "2024-01-15 18:00",
    category: "arrivals",
  },
  {
    id: "NOT003",
    title: "System Maintenance Tonight",
    message:
      "The SMS system will be offline for maintenance from 11 PM to 1 AM. Please complete all entries before 10:30 PM.",
    type: "warning",
    priority: "high",
    status: "scheduled",
    createdBy: "David Brown",
    createdAt: "2024-01-15 16:45",
    scheduledFor: "2024-01-15 20:00",
    targetAudience: "all_staff",
    branch: "All Branches",
    readCount: 0,
    totalRecipients: 67,
    expiresAt: "2024-01-16 02:00",
    category: "system",
  },
  {
    id: "NOT004",
    title: "Welfare Check Reminder",
    message:
      "Evening welfare checks for Block A are due. Please ensure all residents are accounted for.",
    type: "reminder",
    priority: "medium",
    status: "active",
    createdBy: "Lisa Chen",
    createdAt: "2024-01-15 18:00",
    scheduledFor: "2024-01-15 18:00",
    targetAudience: "evening_shift",
    branch: "Liverpool",
    readCount: 8,
    totalRecipients: 10,
    expiresAt: "2024-01-15 22:00",
    category: "welfare",
  },
  {
    id: "NOT005",
    title: "Training Session Tomorrow",
    message:
      "Mandatory safeguarding training session at 10 AM in Conference Room B. Attendance is required.",
    type: "info",
    priority: "medium",
    status: "expired",
    createdBy: "Ahmed Hassan",
    createdAt: "2024-01-14 15:30",
    scheduledFor: "2024-01-14 15:30",
    targetAudience: "managers_only",
    branch: "Birmingham",
    readCount: 5,
    totalRecipients: 8,
    expiresAt: "2024-01-15 10:00",
    category: "training",
  },
  {
    id: "NOT006",
    title: "Incident Report Follow-up",
    message:
      "Follow-up required for incident INC002. Please review and provide additional information.",
    type: "alert",
    priority: "high",
    status: "active",
    createdBy: "Maria Garcia",
    createdAt: "2024-01-15 14:20",
    scheduledFor: "2024-01-15 14:20",
    targetAudience: "specific_users",
    branch: "Manchester",
    readCount: 2,
    totalRecipients: 3,
    expiresAt: "2024-01-17 14:20",
    category: "incidents",
  },
];

const notificationTypes: string[] = [
  "emergency",
  "info",
  "warning",
  "reminder",
  "alert",
];

const priorities: string[] = ["low", "medium", "high", "urgent"];

const statusOptions: string[] = ["active", "scheduled", "expired", "draft"];

const targetAudiences: string[] = [
  "all_staff",
  "managers_only",
  "admin_only",
  "morning_shift",
  "afternoon_shift",
  "evening_shift",
  "night_shift",
  "specific_users",
];

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [isNewNotificationOpen, setIsNewNotificationOpen] =
    useState<boolean>(false);
  const { toast } = useToast();
  const { data: branchData, isLoading } = useBranches();
  const branches = branchData?.map((branch: any) => branch.name) ?? [];
  const allBranches = [...branches];

  const filteredNotifications: Notification[] = notifications.filter(
    (notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || notification.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || notification.status === selectedStatus;
      const matchesBranch =
        selectedBranch === "all" || notification.branch === selectedBranch;

      return matchesSearch && matchesType && matchesStatus && matchesBranch;
    }
  );

  const getStats = (): Stats => {
    const totalNotifications = filteredNotifications.length;
    const activeNotifications = filteredNotifications.filter(
      (n) => n.status === "active"
    ).length;
    const highPriorityNotifications = filteredNotifications.filter(
      (n) => n.priority === "high" || n.priority === "urgent"
    ).length;
    const scheduledNotifications = filteredNotifications.filter(
      (n) => n.status === "scheduled"
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
      actions={
        <div className="flex gap-2">
          <NewNotificationDialog
            open={isNewNotificationOpen}
            onOpenChange={setIsNewNotificationOpen}
            notificationTypes={notificationTypes}
            priorities={priorities}
            branches={allBranches}
            targetAudiences={targetAudiences}
            onCreate={() => {
              toast({
                title: "Notification Created",
                description:
                  "New notification has been created and will be sent to selected recipients.",
              });
              setIsNewNotificationOpen(false);
            }}
          />
        </div>
      }
    >
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
          notificationTypes={notificationTypes}
          statusOptions={statusOptions}
          branches={allBranches}
        />
        <NotificationTable
          notifications={filteredNotifications}
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

        {stats.highPriorityNotifications > 0 && (
          <HighPriorityAlerts
            notifications={filteredNotifications.filter(
              (notification) =>
                notification.priority === "high" ||
                notification.priority === "urgent"
            )}
            onView={(id: string) =>
              toast({
                title: "View Notification",
                description: `Opening detailed view for notification ${id}`,
              })
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
}
