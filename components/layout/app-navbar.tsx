"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  Camera,
  FileText,
  Heart,
  MessageSquare,
  QrCode,
  Shield,
  Users,
  Utensils,
  AlertTriangle,
  Bell,
  Truck,
  LogOut,
  Settings,
  UserIcon,
  Clock,
  Eye,
  UserPlus,
  BedDouble,
  Menu,
  X,
  LogOutIcon,
  Building,
  User,
  ShoppingBasket,
  File,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/auth-provider";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import { RoleChecker } from "@/lib/RoleWrapper";
import { useNotifications, Notification } from "@/hooks/useNotifications";

function NotificationBox({
  closeMobileMenu,
}: {
  closeMobileMenu?: () => void;
}) {
  const router = useRouter();
  const { data: apiNotifications } = useNotifications(); // Use hook
  const notifications: Notification[] = apiNotifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full relative p-0 bg-gray-100"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute p-1 top-0 right-0 h-7 w-7 text-xs font-bold bg-red-500 text-white rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="px-4 py-2 font-semibold border-b">Notifications</div>
        {notifications.length === 0 ? (
          <DropdownMenuItem>
            <div className="flex flex-col">
              <span className="text-sm">No notifications</span>
            </div>
          </DropdownMenuItem>
        ) : (
          notifications.slice(0, 3).map((n: Notification) => (
            <DropdownMenuItem key={n.id}>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-sm">{n.message}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="justify-center"
          onClick={() => {
            if (closeMobileMenu) closeMobileMenu();
            router.push("/notifications");
          }}
        >
          <Link href="/notifications">View All</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(
    null
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const roleName = user?.roles?.[0]?.name || "";

  const currentSection = (() => {
    if (pathname.includes("/company")) return "company";
    if (
      pathname.includes("/staffs") ||
      pathname.includes("/clock-system") ||
      pathname.includes("/medical-staff") ||
      pathname.includes("/documents")
    )
      return "staffs";
    if (
      pathname.includes("/welfare") ||
      pathname.includes("/meals") ||
      pathname.includes("/feedback") ||
      pathname.includes("/food-images") ||
      pathname.includes("/qr-scanner") ||
      pathname.includes("/incidents")
    )
      return "operations";
    if (
      pathname.includes("/service-users") ||
      pathname.includes("/new-user") ||
      pathname.includes("/in-transit") ||
      pathname.includes("/other-removals") ||
      pathname.includes("/su-basket") ||
      pathname.includes("/occupancy")
    )
      return "users";
    if (pathname.includes("/reports")) return "reports";
    return "dashboard";
  })();

  const isSubNavActive = (href: string) => pathname === href;

  const mainNavItems = [
    { title: "Dashboard", href: "/dashboard", key: "dashboard" },
    {
      title: "Company Management",
      href: "/company",
      key: "company",
      hasAccess: RoleChecker(roleName, ["Admin"]),
    },
    {
      title: "Employee Management",
      href: "/staffs",
      key: "staffs",
    },
    {
      title: "Operations",
      href: "/welfare",
      key: "operations",
    },
    {
      title: "Service User Management",
      href: "/service-users",
      key: "users",
    },
    {
      title: "Reports",
      href: "/reports",
      key: "reports",
      hasAccess: RoleChecker(roleName, ["Admin"]),
    },
  ];

  const subNavItemsMap: Record<string, any[]> = {
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
        icon: Users,
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
        icon: Users,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
      {
        title: "SOP Documents",
        href: "/documents",
        icon: FileText,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
    ],
    users: [
      {
        title: "Users",
        href: "/service-users",
        icon: UserIcon,
        color: "bg-pink-100 text-pink-700 border-pink-200",
      },
      {
        title: "Registration",
        href: "/new-user",
        icon: UserPlus,
        color: "bg-green-100 text-green-700 border-green-200",
      },
      {
        title: "In-Transit",
        href: "/in-transit",
        icon: Truck,
        color: "bg-orange-100 text-orange-700 border-orange-200",
      },
      {
        title: "Other Removals",
        href: "/other-removals",
        icon: Truck,
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
      {
        title: "Item Baskets",
        href: "/su-basket",
        icon: ShoppingBasket,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      {
        title: "Occupancy Agreements",
        href: "/occupancy",
        icon: File,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
    ],
  };

  const subNavItems = subNavItemsMap[currentSection] || [];

  const getSubNavItemsForSection = (sectionKey: string) =>
    subNavItemsMap[sectionKey] || [];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"; // 🚫 disable scroll
    } else {
      document.body.style.overflow = "auto"; // ✅ enable scroll back
    }

    // cleanup just in case
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="border-b bg-white pt-6">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="" className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-pink-500">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-red-600">Sharp MS</span>
        </Link>

        <div className="flex items-center xl:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="hidden xl:flex items-center space-x-2 flex-1 justify-center">
          {mainNavItems.map((item) => {
            const isActive = currentSection === item.key;
            if (item.hasAccess === false) return null;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          <NotificationBox />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-medium p-0">
                    <Image
                      src="/placeholder-user.jpg"
                      alt="User Avatar"
                      fill
                      className="h-full w-full object-cover rounded-full"
                    />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="p-2">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.emailAddress}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile nav section */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* 🔥 Background overlay with blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* 🔥 Sidebar */}
          <div className="relative h-full w-72 bg-white py-10 shadow-2xl rounded-r-2xl p-5 flex flex-col overflow-y-auto animate-in slide-in-from-left">
            {/* Header with close button and notification */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href=""
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-pink-500">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg text-red-600">Sharp MS</span>
              </Link>
              <div className="flex items-center gap-2">
                <NotificationBox
                  closeMobileMenu={() => setMobileMenuOpen(false)}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* 🔥 User profile card */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push("/profile");
              }}
              className="flex items-center gap-3 p-3 mb-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-left"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-red-100 text-red-600 font-medium">
                  {user?.fullName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || "Guest User"}
                </p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
              <User className="h-4 w-4 text-gray-400" />
            </button>

            {/* Main nav items */}
            <div className="flex flex-col gap-2 flex-1 border-t">
              {mainNavItems.map((item) => {
                const isOpen = openMobileSection === item.key;
                const toggleOpen = () =>
                  setOpenMobileSection(isOpen ? null : item.key);
                const subItems = getSubNavItemsForSection(item.key);

                return (
                  <div key={item.key}>
                    <button
                      onClick={() => {
                        if (subItems.length) {
                          toggleOpen();
                        } else {
                          router.push(item.href);
                          setMobileMenuOpen(false);
                        }
                      }}
                      className="w-full flex justify-between items-center px-3 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                    >
                      <span className="text-gray-800">{item.title}</span>
                      {subItems.length > 0 && (
                        <span className="text-black text-xs">
                          {isOpen ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </button>

                    {isOpen && subItems.length > 0 && (
                      <div className="ml-4 mt-2 flex flex-col gap-1 border-l pl-3">
                        {subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="px-2 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setOpenMobileSection(null);
                            }}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer actions */}
            <div className="border-t pt-4 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOutIcon className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop subnav */}
      {subNavItems.length > 0 && (
        <div className="hidden xl:block border-t bg-gray-50 px-4 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {subNavItems.map((item) => {
              const isActive = isSubNavActive(item.href);
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isActive
                      ? `${item.color} shadow-sm`
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
