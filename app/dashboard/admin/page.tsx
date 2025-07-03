"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Building2,
  AlertTriangle,
  Heart,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Bell,
  ArrowRight,
  Activity,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Staff",
      value: "248",
      change: "+12",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Across 30 branches",
    },
    {
      title: "Occupied Rooms",
      value: "1,456/1,800",
      change: "81%",
      trend: "stable",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "System-wide occupancy",
    },
    {
      title: "Active Incidents",
      value: "7",
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Requiring attention",
    },
    {
      title: "Welfare Checks Today",
      value: "1,142",
      change: "+89",
      trend: "up",
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Completed today",
    },
  ]

  const branchPerformance = [
    { name: "Manchester", occupancy: 95, incidents: 1, staff: 12, status: "excellent" },
    { name: "Birmingham", occupancy: 87, incidents: 2, staff: 15, status: "good" },
    { name: "London Central", occupancy: 92, incidents: 0, staff: 18, status: "excellent" },
    { name: "Liverpool", occupancy: 78, incidents: 3, staff: 10, status: "attention" },
    { name: "Leeds", occupancy: 85, incidents: 1, staff: 14, status: "good" },
  ]

  const recentActivities = [
    {
      type: "critical",
      message: "Critical welfare check flagged - Manchester Branch",
      time: "2 minutes ago",
      branch: "Manchester",
      priority: "high",
    },
    {
      type: "incident",
      message: "New incident reported - Birmingham Branch",
      time: "15 minutes ago",
      branch: "Birmingham",
      priority: "medium",
    },
    {
      type: "staff",
      message: "Staff shortage alert - Liverpool Branch",
      time: "1 hour ago",
      branch: "Liverpool",
      priority: "high",
    },
    {
      type: "system",
      message: "Daily reports generated successfully",
      time: "2 hours ago",
      branch: "System",
      priority: "normal",
    },
  ]

  const quickActions = [
    {
      title: "Staff Management",
      description: "Manage staff across all branches",
      icon: Users,
      href: "/dashboard/admin/staff",
      color: "bg-blue-500",
    },
    {
      title: "Branch Overview",
      description: "Monitor all 30 branches",
      icon: Building2,
      href: "/dashboard/admin/branches",
      color: "bg-green-500",
    },
    {
      title: "Critical Alerts",
      description: "Review urgent incidents",
      icon: AlertTriangle,
      href: "/dashboard/admin/incidents",
      color: "bg-red-500",
    },
    {
      title: "System Reports",
      description: "Generate comprehensive reports",
      icon: Activity,
      href: "/dashboard/admin/reports",
      color: "bg-purple-500",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "attention":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard" }]}
      title="System Overview"
      description="Comprehensive view of all 30 branches and operations"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Live Monitor
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    {stat.trend === "up" && <TrendingUp className="mr-1 h-3 w-3 text-green-500" />}
                    {stat.trend === "down" && <TrendingDown className="mr-1 h-3 w-3 text-red-500" />}
                    <span>{stat.change} from last week</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{action.title}</h4>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Branch Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Branch Performance
              </CardTitle>
              <CardDescription>Performance metrics across key branches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branchPerformance.map((branch, index) => (
                  <div key={branch.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-muted-foreground">#{index + 1}</div>
                      <div>
                        <h4 className="font-medium">{branch.name}</h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{branch.occupancy}% occupancy</span>
                          <span>{branch.incidents} incidents</span>
                          <span>{branch.staff} staff</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={branch.occupancy} className="w-16 h-2" />
                      <Badge className={getStatusColor(branch.status)}>{branch.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Branches
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activities
              </CardTitle>
              <CardDescription>Latest updates from all branches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === "critical" && <Heart className="h-4 w-4 text-red-500" />}
                      {activity.type === "incident" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      {activity.type === "staff" && <Users className="h-4 w-4 text-blue-500" />}
                      {activity.type === "system" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.branch}
                        </Badge>
                        <Badge
                          variant={
                            activity.priority === "high"
                              ? "destructive"
                              : activity.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {activity.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
            <CardDescription>Real-time system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-green-50">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="font-medium text-green-800">System Status</div>
                <div className="text-sm text-green-600">All systems operational</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="font-medium text-blue-800">Active Users</div>
                <div className="text-sm text-blue-600">248 staff online</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50">
                <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="font-medium text-purple-800">Response Time</div>
                <div className="text-sm text-purple-600">&lt; 200ms average</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
