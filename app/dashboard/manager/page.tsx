import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, Building2, AlertTriangle, Heart, Calendar, Clock, CheckCircle, TrendingUp } from "lucide-react"

export default function ManagerDashboard() {
  const branchStats = [
    {
      title: "Branch Staff",
      value: "12",
      total: "15",
      percentage: 80,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Room Occupancy",
      value: "28/32",
      percentage: 87.5,
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Today's Welfare Checks",
      value: "24/28",
      percentage: 85.7,
      icon: Heart,
      color: "text-purple-600",
    },
    {
      title: "Pending Incidents",
      value: "2",
      status: "urgent",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  const todaySchedule = [
    {
      time: "08:00",
      staff: "Sarah Johnson",
      role: "Morning Shift Lead",
      status: "checked-in",
    },
    {
      time: "09:00",
      staff: "Mike Chen",
      role: "Welfare Officer",
      status: "checked-in",
    },
    {
      time: "14:00",
      staff: "Emma Wilson",
      role: "Afternoon Shift",
      status: "scheduled",
    },
    {
      time: "22:00",
      staff: "David Brown",
      role: "Night Security",
      status: "scheduled",
    },
  ]

  const criticalAlerts = [
    {
      type: "welfare",
      message: "Critical welfare check flagged - Room 204",
      time: "10 minutes ago",
      action: "Review Required",
    },
    {
      type: "incident",
      message: "Incident report pending approval",
      time: "1 hour ago",
      action: "Approve/Reject",
    },
  ]

  return (
    <DashboardLayout breadcrumbs={[{ label: "Manager Dashboard" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
            <p className="text-muted-foreground">Manchester Branch - Daily Operations Overview</p>
          </div>
          <Badge variant="outline" className="text-sm">
            Branch: Manchester
          </Badge>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">{alert.message}</p>
                      <p className="text-sm text-red-600">{alert.time}</p>
                    </div>
                    <Button size="sm" variant="destructive">
                      {alert.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {branchStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.percentage && (
                  <div className="mt-2">
                    <Progress value={stat.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{stat.percentage}% completion</p>
                  </div>
                )}
                {stat.status === "urgent" && (
                  <Badge variant="destructive" className="mt-2">
                    Requires Attention
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Staff shifts and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((shift, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-mono font-medium">{shift.time}</div>
                      <div>
                        <p className="font-medium">{shift.staff}</p>
                        <p className="text-sm text-muted-foreground">{shift.role}</p>
                      </div>
                    </div>
                    <Badge
                      variant={shift.status === "checked-in" ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {shift.status === "checked-in" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {shift.status === "checked-in" ? "Active" : "Scheduled"}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Branch Performance
              </CardTitle>
              <CardDescription>This week vs last week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Welfare Checks Completed</span>
                  <div className="text-right">
                    <div className="font-medium">94%</div>
                    <div className="text-xs text-green-600">+3% from last week</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Incident Response Time</span>
                  <div className="text-right">
                    <div className="font-medium">12 min</div>
                    <div className="text-xs text-green-600">-2 min from last week</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Staff Attendance</span>
                  <div className="text-right">
                    <div className="font-medium">96%</div>
                    <div className="text-xs text-green-600">+1% from last week</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Room Occupancy</span>
                  <div className="text-right">
                    <div className="font-medium">87%</div>
                    <div className="text-xs text-muted-foreground">Same as last week</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <Button className="h-16 flex-col space-y-1">
                <Users className="h-5 w-5" />
                <span className="text-xs">Assign Shifts</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-1 bg-transparent">
                <Building2 className="h-5 w-5" />
                <span className="text-xs">Room Status</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-1 bg-transparent">
                <Heart className="h-5 w-5" />
                <span className="text-xs">Welfare Review</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-1 bg-transparent">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs">Incidents</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-1 bg-transparent">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Schedule</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-1 bg-transparent">
                <CheckCircle className="h-5 w-5" />
                <span className="text-xs">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
