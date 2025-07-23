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
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  if (!user) return null;

  const currentSection = (() => {
    if (
      pathname.includes("/staffs") ||
      pathname.includes("/scheduler") ||
      pathname.includes("/clock-system")
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
    if (
      pathname.includes("/incidents") ||
      pathname.includes("/observations") ||
      pathname.includes("/safeguarding")
    )
      return "incidents";
    if (pathname.includes("/notifications") || pathname.includes("/documents"))
      return "system";
    if (
      pathname.includes("/service-users") ||
      pathname.includes("/rooms") ||
      pathname.includes("/new-user") ||
      pathname.includes("/in-transit")
    )
      return "users";
    if (pathname.includes("/reports")) return "reports";
    return "dashboard";
  })();

  const isSubNavActive = (href: string) => pathname === href;

  const mainNavItems = [
    {
      title: "Dashboard",
      href: `/dashboard/${user.role}`,
      key: "dashboard",
    },
    {
      title: "Staff Management",
      href: `/dashboard/${user.role}/staffs`,
      key: "staffs",
      roles: ["admin", "manager"],
    },
    {
      title: "Operations",
      href: `/dashboard/${user.role}/welfare`,
      key: "operations",
      roles: ["admin", "manager", "staff"],
    },
    {
      title: "Incidents & Safety",
      href: `/dashboard/${user.role}/incidents`,
      key: "incidents",
      roles: ["admin", "manager", "staff"],
    },
    {
      title: "System Settings",
      href: `/dashboard/${user.role}/notifications`,
      key: "system",
      roles: ["admin", "manager", "staff"],
    },

    {
      title: "User Management",
      href: `/dashboard/${user.role}/service-users`,
      key: "users",
      roles: ["admin", "manager"],
    },
    {
      title: "Reports",
      href: `/dashboard/${user.role}/reports`,
      key: "reports",
      roles: ["admin", "manager"],
    },
  ].filter((item) => !item.roles || item.roles.includes(user.role));

  const subNavItems = (() => {
    switch (currentSection) {
      case "operations":
        return [
          {
            title: "Welfare Checks",
            href: `/dashboard/${user.role}/welfare`,
            icon: Heart,
            color: "bg-blue-100 text-blue-700 border-blue-200",
          },
          {
            title: "Meal Marker",
            href: `/dashboard/${user.role}/meals`,
            icon: Utensils,
            color: "bg-green-100 text-green-700 border-green-200",
          },
          {
            title: "Food Images",
            href: `/dashboard/${user.role}/food-images`,
            icon: Camera,
            color: "bg-pink-100 text-pink-700 border-pink-200",
          },
          {
            title: "Food Feedbacks",
            href: `/dashboard/${user.role}/feedback`,
            icon: MessageSquare,
            color: "bg-orange-100 text-orange-700 border-orange-200",
          },
          {
            title: "QR Scanner",
            href: `/dashboard/${user.role}/qr-scanner`,
            icon: QrCode,
            color: "bg-purple-100 text-purple-700 border-purple-200",
          },
        ];
      case "incidents":
        return [
          {
            title: "Incident Reports",
            href: `/dashboard/${user.role}/incidents`,
            icon: AlertTriangle,
            color: "bg-red-100 text-red-700 border-red-200",
          },
          {
            title: "Observation Checks",
            href: `/dashboard/${user.role}/observations`,
            icon: Eye,
            color: "bg-blue-100 text-blue-700 border-blue-200",
          },
          {
            title: "Safeguarding",
            href: `/dashboard/${user.role}/safeguarding`,
            icon: Shield,
            color: "bg-indigo-100 text-indigo-700 border-indigo-200",
          },
        ];
      case "staffs":
        if (user.role === "admin" || user.role === "manager") {
          return [
            {
              title: "Staff Management",
              href: `/dashboard/${user.role}/staffs`,
              icon: Users,
              color: "bg-pink-100 text-pink-700 border-pink-200",
            },
            {
              title: "Staff Scheduler",
              href: `/dashboard/${user.role}/scheduler`,
              icon: Calendar,
              color: "bg-blue-100 text-blue-700 border-blue-200",
            },
            {
              title: "QR Clock In/Out",
              href: `/dashboard/${user.role}/clock-system`,
              icon: Clock,
              color: "bg-green-100 text-green-700 border-green-200",
            },
          ];
        }
        return [];
      case "system":
        return [
          {
            title: "Notifications",
            href: `/dashboard/${user.role}/notifications`,
            icon: Bell,
            color: "bg-red-100 text-red-700 border-red-200",
          },
          {
            title: "SOP Documents",
            href: `/dashboard/${user.role}/documents`,
            icon: FileText,
            color: "bg-blue-100 text-blue-700 border-blue-200",
          },
        ];
      case "users":
        if (user.role === "admin" || user.role === "manager") {
          return [
            {
              title: "Service Users",
              href: `/dashboard/${user.role}/service-users`,
              icon: UserIcon,
              color: "bg-pink-100 text-pink-700 border-pink-200",
            },
            {
              title: "Room Management",
              href: `/dashboard/${user.role}/rooms`,
              icon: BedDouble,
              color: "bg-blue-100 text-blue-700 border-blue-200",
            },
            {
              title: "User Registration",
              href: `/dashboard/${user.role}/new-user`,
              icon: UserPlus,
              color: "bg-green-100 text-green-700 border-green-200",
            },
            {
              title: "In-Transit User",
              href: `/dashboard/${user.role}/in-transit`,
              icon: Truck,
              color: "bg-orange-100 text-orange-700 border-orange-200",
            },
          ];
        }
        return [];
      default:
        return [];
    }
  })();

  const getSubNavItemsForSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "operations":
        return [
          {
            title: "Welfare Checks",
            href: `/dashboard/${user.role}/welfare`,
            icon: Heart,
            color: "bg-blue-100 text-blue-700 border-blue-200",
          },
          {
            title: "Meal Marker",
            href: `/dashboard/${user.role}/meals`,
            icon: Utensils,
            color: "bg-green-100 text-green-700 border-green-200",
          },
          {
            title: "Food Images",
            href: `/dashboard/${user.role}/food-images`,
            icon: Camera,
            color: "bg-pink-100 text-pink-700 border-pink-200",
          },
          {
            title: "Food Feedbacks",
            href: `/dashboard/${user.role}/feedback`,
            icon: MessageSquare,
            color: "bg-orange-100 text-orange-700 border-orange-200",
          },
          {
            title: "QR Scanner",
            href: `/dashboard/${user.role}/qr-scanner`,
            icon: QrCode,
            color: "bg-purple-100 text-purple-700 border-purple-200",
          },
        ];
      case "incidents":
        return [
          {
            title: "Incident Reports",
            href: `/dashboard/${user.role}/incidents`,
            icon: AlertTriangle,
            color: "bg-red-100 text-red-700 border-red-200",
          },
          {
            title: "Observation Checks",
            href: `/dashboard/${user.role}/observations`,
            icon: Eye,
            color: "bg-blue-100 text-blue-700 border-blue-200",
          },
          {
            title: "Safeguarding",
            href: `/dashboard/${user.role}/safeguarding`,
            icon: Shield,
            color: "bg-indigo-100 text-indigo-700 border-indigo-200",
          },
        ];
      case "staffs":
        if (user.role === "admin" || user.role === "manager") {
          return [
            {
              title: "Staff Management",
              href: `/dashboard/${user.role}/staffs`,
              icon: Users,
              color: "bg-pink-100 text-pink-700 border-pink-200",
            },
            {
              title: "Staff Scheduler",
              href: `/dashboard/${user.role}/scheduler`,
              icon: Calendar,
              color: "bg-blue-100 text-blue-700 border-blue-200",
            },
            {
              title: "QR Clock In/Out",
              href: `/dashboard/${user.role}/clock-system`,
              icon: Clock,
              color: "bg-green-100 text-green-700 border-green-200",
            },
          ];
        }
        return [];
      case "system":
        return [
          {
            title: "Notifications",
            href: `/dashboard/${user.role}/notifications`,
            icon: Bell,
            color: "bg-red-100 text-red-700 border-red-200",
          },
          {
            title: "SOP Documents",
            href: `/dashboard/${user.role}/documents`,
            icon: FileText,
            color: "bg-blue-100 text-blue-700 border-blue-200",
          },
        ];
      case "users":
        if (user.role === "admin" || user.role === "manager") {
          return [
            {
              title: "Service Users",
              href: `/dashboard/${user.role}/service-users`,
              icon: UserIcon,
              color: "bg-pink-100 text-pink-700 border-pink-200",
            },
            {
              title: "Room Management",
              href: `/dashboard/${user.role}/rooms`,
              icon: BedDouble,
              color: "bg-blue-100 text-blue-700 border-blue-200",
            },
            {
              title: "User Registration",
              href: `/dashboard/${user.role}/new-user`,
              icon: UserPlus,
              color: "bg-green-100 text-green-700 border-green-200",
            },
            {
              title: "In-Transit User",
              href: `/dashboard/${user.role}/in-transit`,
              icon: Truck,
              color: "bg-orange-100 text-orange-700 border-orange-200",
            },
          ];
        }
        return [];
      default:
        return [];
    }
  };

  return (
    <div className="border-b bg-white">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link
          href={`/dashboard/${user.role}`}
          className="flex items-center gap-2"
        >
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-pink-500">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-red-600">Sharp MS</span>
        </Link>

        {/* Mobile menu toggle */}
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

        {/* Desktop menu */}
        <nav className="hidden xl:flex items-center space-x-2 flex-1 justify-center">
          {mainNavItems.map((item) => {
            const isActive = currentSection === item.key;
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
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-medium">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="p-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${user.role}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
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

      {/* Mobile nav links */}
      {mobileMenuOpen && (
        <div className="flex flex-col items-start gap-2 px-4 py-3 xl:hidden border-t">
          {mainNavItems.map((item) => {
            const hasSubItems =
              item.key === "operations" ||
              item.key === "incidents" ||
              item.key === "staffs" ||
              item.key === "system" ||
              item.key === "users";

            const isOpen = openMobileSection === item.key;

            const toggleOpen = () => {
              if (openMobileSection === item.key) {
                setOpenMobileSection(null);
              } else {
                setOpenMobileSection(item.key);
              }
            };

            if (hasSubItems) {
              return (
                <div key={item.key} className="w-full">
                  <button
                    onClick={toggleOpen}
                    className="w-full text-left text-sm py-2 text-gray-700 hover:bg-gray-100 rounded-md px-2 flex justify-between items-center"
                  >
                    <span>{item.title}</span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {getSubNavItemsForSection(item.key).map(
                        (subItem: any) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="text-sm text-gray-600 hover:text-black"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setOpenMobileSection(null);
                            }}
                          >
                            {subItem.title}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className="w-full text-sm py-2 text-gray-700 hover:bg-gray-100 rounded-md px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      )}

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
