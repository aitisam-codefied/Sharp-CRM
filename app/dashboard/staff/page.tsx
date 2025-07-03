import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Clock, Utensils, Heart, AlertTriangle, CheckCircle, Calendar, User } from "lucide-react"

export default function StaffDashboard() {
  const todayTasks = [
    {
      id: 1,
      type: "welfare",
      title: "Morning Welfare Checks",
      description: "Complete welfare checks for residents in Block A",
      priority: "high",
      completed: 8,
      total: 12,
      dueTime: "11:00 AM",
    },
    {
      id: 2,
      type: "meal",
      title: "Lunch Meal Marking",
      description: "Mark lunch attendance for all residents",
      priority: "medium",
      completed: 0,
      total: 28,
      dueTime: "1:00 PM",
    },
    {
      id: 3,
      type: "observation",
      title: "Evening Observations",
      description: "Conduct evening observation rounds",
      priority: "medium",
      completed: 0,
      total: 15,
      dueTime: "6:00 PM",
    },
  ]

  const recentActivities = [
    {
      type: "clock-in",
      message: "Clocked in for morning shift",
      time: "8:00 AM",
      status: "completed",
    },
    {
      type: "welfare",
      message: "Completed welfare check - Room 204",
      time: "9:15 AM",
      status: "completed",
    },
    {
      type: "meal",
      message: "Marked breakfast attendance (24/28)",
      time: "9:45 AM",
      status: "completed",
    },
  ]

  const quickStats = [
    {
      label: "Hours Today",
      value: "3.5",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Tasks Completed",
      value: "8/12",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Welfare Checks",
      value: "8",
      icon: Heart,
      color: "text-purple-600",
    },
    {
      label: "Incidents Today",
      value: "0",
      icon: AlertTriangle,
      color: "text-gray-600",
    },
  ]

  return (
    <DashboardLayout breadcrumbs={[{ label: "Staff Dashboard" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here are your tasks for today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Shift: 08:00 - 16:00
            </Badge>
            <Badge variant="default" className="text-sm bg-green-600">
              On Duty
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col space-y-2" size="lg">
                <QrCode className="h-6 w-6" />
                <span>QR Scanner</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" size="lg">
                <Utensils className="h-6 w-6" />
                <span>Mark Meals</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" size="lg">
                <Heart className="h-6 w-6" />
                <span>Welfare Check</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" size="lg">
                <AlertTriangle className="h-6 w-6" />
                <span>Report Incident</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Tasks
              </CardTitle>
              <CardDescription>Your assigned tasks and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {task.type === "welfare" && <Heart className="h-4 w-4 text-purple-500" />}
                        {task.type === "meal" && <Utensils className="h-4 w-4 text-green-500" />}
                        {task.type === "observation" && <User className="h-4 w-4 text-blue-500" />}
                        <h4 className="font-medium">{task.title}</h4>
                      </div>
                      <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">
                          {task.completed}/{task.total} completed
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(task.completed / task.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">Due: {task.dueTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your recent actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === "clock-in" && <Clock className="h-4 w-4 text-blue-500" />}
                      {activity.type === "welfare" && <Heart className="h-4 w-4 text-purple-500" />}
                      {activity.type === "meal" && <Utensils className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
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

        {/* Shift Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shift Information</CardTitle>
            <CardDescription>Current shift details and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">Shift Start</div>
                <div className="text-sm text-muted-foreground">08:00 AM</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Current Time</div>
                <div className="text-sm text-muted-foreground">11:30 AM</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="font-medium">Shift End</div>
                <div className="text-sm text-muted-foreground">04:00 PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
