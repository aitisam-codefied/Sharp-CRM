"use client";

import {
  Building2,
  Users,
  Heart,
  AlertTriangle,
  FileText,
  UserIcon,
  BarChart3,
  Utensils,
  Camera,
  MessageSquare,
  QrCode,
  Clock,
  Users as UsersIcon,
  UserPlus,
  Truck,
  ShoppingBasket,
} from "lucide-react";

export type MainNavItem = {
  title: string;
  href: string;
  key: string;
  icon: any; // lucide-react Icon type
};

export type SubNavItem = {
  title: string;
  href: string;
  icon: any;
  color: string; // tailwind classes you already use
};

export const mainNavItems: MainNavItem[] = [
  {
    title: "Dashboard",
    href: "",
    key: "dashboard",
    icon: Building2,
  },
  {
    title: "Staff Management",
    href: "/staffs",
    key: "staffs",
    icon: Users,
  },
  {
    title: "Operations",
    href: "/welfare",
    key: "operations",
    icon: Heart,
  },
  {
    title: "Incidents & Safety",
    href: "/incidents",
    key: "incidents",
    icon: AlertTriangle,
  },
  {
    title: "System Settings",
    href: "/documents",
    key: "system",
    icon: FileText,
  },
  {
    title: "Service User Management",
    href: "/service-users",
    key: "users",
    icon: UserIcon,
  },
  {
    title: "Reports",
    href: "/reports",
    key: "reports",
    icon: BarChart3,
  },
];

export const subNavItemsMap: Record<string, SubNavItem[]> = {
  operations: [
    {
      title: "Welfare Checks",
      href: "/welfare",
      icon: Heart,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      title: "Meal Marker",
      href: "/meals",
      icon: Utensils,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      title: "Food Images",
      href: "/food-images",
      icon: Camera,
      color: "bg-pink-100 text-pink-700 border-pink-200",
    },
    {
      title: "Food Feedbacks",
      href: "/feedback",
      icon: MessageSquare,
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      title: "QR Scanner",
      href: "/qr-scanner",
      icon: QrCode,
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  ],
  incidents: [
    {
      title: "Incident Reports",
      href: "/incidents",
      icon: AlertTriangle,
      color: "bg-red-100 text-red-700 border-red-200",
    },
  ],
  staffs: [
    {
      title: "Staff Management",
      href: "/staffs",
      icon: UsersIcon,
      color: "bg-pink-100 text-pink-700 border-pink-200",
    },
    {
      title: "QR Clock In/Out",
      href: "/clock-system",
      icon: Clock,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      title: "Medical Staff",
      href: "/medical-staff",
      icon: UsersIcon,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
  ],
  system: [
    {
      title: "SOP Documents",
      href: "/documents",
      icon: FileText,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
  ],
  users: [
    {
      title: "Service Users",
      href: "/service-users",
      icon: UserIcon,
      color: "bg-pink-100 text-pink-700 border-pink-200",
    },
    {
      title: "Service User Registration",
      href: "/new-user",
      icon: UserPlus,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      title: "In-Transit User",
      href: "/in-transit",
      icon: Truck,
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      title: "Service User Baskets",
      href: "/su-basket",
      icon: ShoppingBasket,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
  ],
};

export const getCurrentSection = (pathname: string) => {
  if (pathname.includes("/company")) return "company";
  if (
    pathname.includes("/staffs") ||
    pathname.includes("/scheduler") ||
    pathname.includes("/clock-system") ||
    pathname.includes("/medical-staff")
  )
    return "staffs";
  if (
    pathname.includes("/welfare") ||
    pathname.includes("/meals") ||
    pathname.includes("/feedback") ||
    pathname.includes("/food-images") ||
    pathname.includes("/qr-scanner")
  )
    return "operations";
  if (pathname.includes("/incidents")) return "incidents";
  if (pathname.includes("/notifications") || pathname.includes("/documents"))
    return "system";
  if (
    pathname.includes("/service-users") ||
    pathname.includes("/new-user") ||
    pathname.includes("/in-transit") ||
    pathname.includes("/su-basket")
  )
    return "users";
  if (pathname.includes("/reports")) return "reports";
  return "dashboard";
};
