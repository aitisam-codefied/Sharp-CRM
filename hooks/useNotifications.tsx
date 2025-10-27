import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  priority: string;
  status: string;
  icon: string;
  image: string | null;
  actionUrl: string;
  metadata: Record<string, any>;
  channels: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
  inAppData: {
    showInFeed: boolean;
    autoHide: boolean;
    hideAfter: number;
    position: string;
  };
  pushData: {
    badge: number;
    sound: string;
    ttl: number;
  };
  emailData: {
    attachments: any[];
  };
  isRead: boolean;
  deliveryStatus: string;
  accessContext: Record<string, any>;
  sender: {
    id: string;
    name: string;
    email: string | null;
    role: string;
  };
  scope: {
    tenant: string | null;
    branch: string | null;
    locations: string[];
  };
  analytics: {
    totalRecipients: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
    openRate: number;
    clickRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/notification/my-notifications?limit=100");
  return response.data.data;
};

export const useNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 2000, // Poll every 2 seconds
  });
};
