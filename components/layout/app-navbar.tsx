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

export function AppNavbar() {
  // const platform = Capacitor.getPlatform();
  // if (platform === "ios" || platform === "android") return null;

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

  const currentSection = (() => {
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
    if (
      pathname.includes("/incidents")
      // pathname.includes("/observations") ||
      // pathname.includes("/safeguarding")
    )
      return "incidents";
    if (pathname.includes("/notifications") || pathname.includes("/documents"))
      return "system";
    if (
      pathname.includes("/service-users") ||
      // pathname.includes("/rooms") ||
      pathname.includes("/new-user") ||
      pathname.includes("/in-transit") ||
      pathname.includes("/su-basket") ||
      pathname.includes("/occupancy")
    )
      return "users";
    if (pathname.includes("/reports")) return "reports";
    return "dashboard";
  })();

  const isSubNavActive = (href: string) => pathname === href;

  const mainNavItems = [
    { title: "Dashboard", href: "/dashboard/admin", key: "dashboard" },

    {
      title: "Staff Management",
      href: "/dashboard/admin/staffs",
      key: "staffs",
    },
    {
      title: "Operations",
      href: "/dashboard/admin/welfare",
      key: "operations",
    },
    {
      title: "Incidents & Safety",
      href: "/dashboard/admin/incidents",
      key: "incidents",
    },
    {
      title: "System Settings",
      href: "/dashboard/admin/documents",
      key: "system",
    },
    {
      title: "Service User Management",
      href: "/dashboard/admin/service-users",
      key: "users",
    },
    { title: "Reports", href: "/dashboard/admin/reports", key: "reports" },
  ];

  const subNavItemsMap: Record<string, any[]> = {
    operations: [
      {
        title: "Welfare Checks",
        href: "/dashboard/admin/welfare",
        icon: Heart,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      {
        title: "Meal Marker",
        href: "/dashboard/admin/meals",
        icon: Utensils,
        color: "bg-green-100 text-green-700 border-green-200",
      },
      {
        title: "Food Images",
        href: "/dashboard/admin/food-images",
        icon: Camera,
        color: "bg-pink-100 text-pink-700 border-pink-200",
      },
      {
        title: "Food Feedbacks",
        href: "/dashboard/admin/feedback",
        icon: MessageSquare,
        color: "bg-orange-100 text-orange-700 border-orange-200",
      },
      {
        title: "QR Scanner",
        href: "/dashboard/admin/qr-scanner",
        icon: QrCode,
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
    ],
    incidents: [
      {
        title: "Incident Reports",
        href: "/dashboard/admin/incidents",
        icon: AlertTriangle,
        color: "bg-red-100 text-red-700 border-red-200",
      },
      // {
      //   title: "Observation Checks",
      //   href: "/dashboard/admin/observations",
      //   icon: Eye,
      //   color: "bg-blue-100 text-blue-700 border-blue-200",
      // },
      // {
      //   title: "Safeguarding",
      //   href: "/dashboard/admin/safeguarding",
      //   icon: Shield,
      //   color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      // },
    ],
    staffs: [
      {
        title: "Staff Management",
        href: "/dashboard/admin/staffs",
        icon: Users,
        color: "bg-pink-100 text-pink-700 border-pink-200",
      },
      // {
      //   title: "Staff Scheduler",
      //   href: "/dashboard/admin/scheduler",
      //   icon: Calendar,
      //   color: "bg-blue-100 text-blue-700 border-blue-200",
      // },
      {
        title: "QR Clock In/Out",
        href: "/dashboard/admin/clock-system",
        icon: Clock,
        color: "bg-green-100 text-green-700 border-green-200",
      },
      {
        title: "Medical Staff",
        href: "/dashboard/admin/medical-staff",
        icon: Users,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
    ],
    system: [
      // {
      //   title: "Notifications",
      //   href: "/dashboard/admin/notifications",
      //   icon: Bell,
      //   color: "bg-red-100 text-red-700 border-red-200",
      // },
      {
        title: "SOP Documents",
        href: "/dashboard/admin/documents",
        icon: FileText,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
    ],
    users: [
      {
        title: "Service Users",
        href: "/dashboard/admin/service-users",
        icon: UserIcon,
        color: "bg-pink-100 text-pink-700 border-pink-200",
      },
      // {
      //   title: "Room Management",
      //   href: "/dashboard/admin/rooms",
      //   icon: BedDouble,
      //   color: "bg-blue-100 text-blue-700 border-blue-200",
      // },
      {
        title: "Service User Registration",
        href: "/dashboard/admin/new-user",
        icon: UserPlus,
        color: "bg-green-100 text-green-700 border-green-200",
      },
      {
        title: "In-Transit User",
        href: "/dashboard/admin/in-transit",
        icon: Truck,
        color: "bg-orange-100 text-orange-700 border-orange-200",
      },
      {
        title: "Service User Baskets",
        href: "/dashboard/admin/su-basket",
        icon: ShoppingBasket,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      {
        title: "Ocuupancy Agreements",
        href: "/dashboard/admin/occupancy",
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
    <div className="border-b bg-white">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/dashboard/admin" className="flex items-center gap-2">
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
                <Link href="/dashboard/admin/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin/company">
                  <Building className="mr-2 h-4 w-4" />
                  <span>Companies</span>
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
        <div className="fixed inset-0 z-50 flex flex-col items-start gap-2 px-4 py-3 xl:hidden bg-white overflow-y-auto">
          {mainNavItems.map((item) => {
            const isOpen = openMobileSection === item.key;
            const toggleOpen = () =>
              setOpenMobileSection(isOpen ? null : item.key);
            const subItems = getSubNavItemsForSection(item.key);

            return (
              <div key={item.key} className="w-full">
                <button
                  onClick={() => {
                    if (subItems.length) {
                      toggleOpen();
                    } else {
                      router.push(item.href);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="w-full text-left text-sm py-2 text-gray-700 hover:bg-gray-100 rounded-md px-2 flex justify-between items-center"
                >
                  <span>{item.title}</span>
                  {subItems.length > 0 && <span>{isOpen ? "▲" : "▼"}</span>}
                </button>
                {isOpen && subItems.length > 0 && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {subItems.map((subItem) => (
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
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* ✅ Mobile logout & settings */}
          <div className="w-full border-t pt-3 mt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push("/dashboard/admin/company");
              }}
              className="text-sm w-full text-left text-gray-700 hover:bg-gray-100 rounded-md px-2 py-2 flex items-center"
            >
              <Building className="mr-2 h-4 w-4" /> Companies
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push("/dashboard/admin/profile");
              }}
              className="text-sm w-full text-left text-gray-700 hover:bg-gray-100 rounded-md px-2 py-2 flex items-center"
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="text-sm w-full text-left text-red-600 hover:bg-red-50 rounded-md px-2 py-2 flex items-center"
            >
              <LogOutIcon className="mr-2 h-4 w-4" /> Sign Out
            </button>
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
