"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2,
  Calendar,
  Camera,
  FileText,
  Heart,
  Home,
  MessageSquare,
  QrCode,
  Shield,
  Users,
  Utensils,
  AlertTriangle,
  BarChart3,
  Bell,
  Truck,
  LogOut,
  Settings,
  UserIcon,
  Clock,
  Eye,
  UserPlus,
  BedDouble,
  ChevronDown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [openSections, setOpenSections] = useState<string[]>(["main", "operations"])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  if (!user) return null

  // Navigation items based on user role
  const getNavigationItems = (role: string) => {
    const mainItems = [
      {
        title: "Dashboard",
        url: `/dashboard/${role}`,
        icon: Home,
        description: "Overview and statistics",
      },
    ]

    const staffManagementItems =
      role === "admin" || role === "manager"
        ? [
            {
              title: "Staff Management",
              url: `/dashboard/${role}/staff`,
              icon: Users,
              description: "Manage staff profiles",
            },
            {
              title: "Staff Scheduler",
              url: `/dashboard/${role}/scheduler`,
              icon: Calendar,
              description: "Schedule and assign shifts",
            },
            {
              title: "QR Clock In/Out",
              url: `/dashboard/${role}/clock-system`,
              icon: Clock,
              description: "Staff attendance system",
            },
          ]
        : []

    const operationsItems = [
      {
        title: "QR Scanner",
        url: `/dashboard/${role}/qr-scanner`,
        icon: QrCode,
        description: "Multi-purpose QR scanner",
      },
      {
        title: "Meal Marking",
        url: `/dashboard/${role}/meals`,
        icon: Utensils,
        description: "Track meal attendance",
      },
      {
        title: "Food Images",
        url: `/dashboard/${role}/food-images`,
        icon: Camera,
        description: "Upload meal photos",
      },
      {
        title: "Welfare Checks",
        url: `/dashboard/${role}/welfare`,
        icon: Heart,
        description: "Resident welfare monitoring",
      },
      {
        title: "Food Feedback",
        url: `/dashboard/${role}/feedback`,
        icon: MessageSquare,
        description: "Meal satisfaction surveys",
      },
    ]

    const incidentItems = [
      {
        title: "Incident Reports",
        url: `/dashboard/${role}/incidents`,
        icon: AlertTriangle,
        description: "Report and track incidents",
      },
      {
        title: "Observation Checks",
        url: `/dashboard/${role}/observations`,
        icon: Eye,
        description: "Daily resident observations",
      },
      {
        title: "Safeguarding",
        url: `/dashboard/${role}/safeguarding`,
        icon: Shield,
        description: "Safeguarding referrals",
      },
    ]

    const managementItems =
      role === "admin" || role === "manager"
        ? [
            {
              title: "Service Users",
              url: `/dashboard/${role}/service-users`,
              icon: UserIcon,
              description: "Resident management",
            },
            {
              title: "Room Management",
              url: `/dashboard/${role}/rooms`,
              icon: BedDouble,
              description: "Room allocation and status",
            },
            {
              title: "New User Registration",
              url: `/dashboard/${role}/new-user`,
              icon: UserPlus,
              description: "Register new residents",
            },
            {
              title: "In-Transit Users",
              url: `/dashboard/${role}/in-transit`,
              icon: Truck,
              description: "Incoming resident alerts",
            },
          ]
        : []

    const systemItems = [
      {
        title: "SOP Documents",
        url: `/dashboard/${role}/documents`,
        icon: FileText,
        description: "Standard operating procedures",
      },
      {
        title: "Notifications",
        url: `/dashboard/${role}/notifications`,
        icon: Bell,
        description: "System notifications",
      },
    ]

    const reportItems =
      role === "admin" || role === "manager"
        ? [
            {
              title: "Reports & Analytics",
              url: `/dashboard/${role}/reports`,
              icon: BarChart3,
              description: "Data insights and reports",
            },
          ]
        : []

    return {
      main: mainItems,
      staffManagement: staffManagementItems,
      operations: operationsItems,
      incidents: incidentItems,
      management: managementItems,
      system: systemItems,
      reports: reportItems,
    }
  }

  const navigationItems = getNavigationItems(user.role)

  const NavSection = ({ title, items, sectionKey }: { title: string; items: any[]; sectionKey: string }) => {
    if (items.length === 0) return null

    const isOpen = openSections.includes(sectionKey)

    return (
      <Collapsible open={isOpen} onOpenChange={() => toggleSection(sectionKey)}>
        <SidebarGroup>
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent rounded-md p-2 flex items-center justify-between">
              <span>{title}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="group">
                      <Link href={item.url} className="flex items-center gap-3 p-3 rounded-lg">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-muted-foreground truncate group-hover:text-sidebar-accent-foreground">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    )
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Sharp MS</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs capitalize">
                {user.role}
              </Badge>
              {user.branch && (
                <Badge variant="secondary" className="text-xs">
                  {user.branch}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar">
        <NavSection title="Main" items={navigationItems.main} sectionKey="main" />

        {navigationItems.staffManagement.length > 0 && (
          <NavSection title="Staff Management" items={navigationItems.staffManagement} sectionKey="staffManagement" />
        )}

        <NavSection title="Operations" items={navigationItems.operations} sectionKey="operations" />
        <NavSection title="Incidents & Safety" items={navigationItems.incidents} sectionKey="incidents" />

        {navigationItems.management.length > 0 && (
          <NavSection title="User Management" items={navigationItems.management} sectionKey="management" />
        )}

        <NavSection title="System" items={navigationItems.system} sectionKey="system" />

        {navigationItems.reports.length > 0 && (
          <NavSection title="Reports" items={navigationItems.reports} sectionKey="reports" />
        )}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-medium">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/${user.role}/settings`} className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-10 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
