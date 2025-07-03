import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Plus, Users, Clock, AlertTriangle } from "lucide-react"

export default function ManagerSchedulerPage() {
  const currentWeek = "March 4 - March 10, 2024"

  const shifts = [
    {
      id: 1,
      day: "Monday",
      date: "Mar 4",
      shifts: [
        { time: "06:00-14:00", staff: "Sarah Johnson", role: "Care Worker", status: "confirmed" },
        { time: "14:00-22:00", staff: "Mike Chen", role: "Welfare Officer", status: "confirmed" },
        { time: "22:00-06:00", staff: "David Brown", role: "Security", status: "confirmed" },
      ],
    },
    {
      id: 2,
      day: "Tuesday",
      date: "Mar 5",
      shifts: [
        { time: "06:00-14:00", staff: "Emma Wilson", role: "Care Worker", status: "pending" },
        { time: "14:00-22:00", staff: "John Smith", role: "Care Worker", status: "confirmed" },
        { time: "22:00-06:00", staff: "David Brown", role: "Security", status: "confirmed" },
      ],
    },
    {
      id: 3,
      day: "Wednesday",
      date: "Mar 6",
      shifts: [
        { time: "06:00-14:00", staff: "Sarah Johnson", role: "Care Worker", status: "confirmed" },
        { time: "14:00-22:00", staff: "", role: "", status: "vacant" },
        { time: "22:00-06:00", staff: "Lisa Parker", role: "Security", status: "confirmed" },
      ],
    },
    {
      id: 4,
      day: "Thursday",
      date: "Mar 7",
      shifts: [
        { time: "06:00-14:00", staff: "Mike Chen", role: "Welfare Officer", status: "confirmed" },
        { time: "14:00-22:00", staff: "Emma Wilson", role: "Care Worker", status: "confirmed" },
        { time: "22:00-06:00", staff: "David Brown", role: "Security", status: "confirmed" },
      ],
    },
    {
      id: 5,
      day: "Friday",
      date: "Mar 8",
      shifts: [
        { time: "06:00-14:00", staff: "Sarah Johnson", role: "Care Worker", status: "confirmed" },
        { time: "14:00-22:00", staff: "John Smith", role: "Care Worker", status: "confirmed" },
        { time: "22:00-06:00", staff: "", role: "", status: "vacant" },
      ],
    },
    {
      id: 6,
      day: "Saturday",
      date: "Mar 9",
      shifts: [
        { time: "06:00-14:00", staff: "Emma Wilson", role: "Care Worker", status: "confirmed" },
        { time: "14:00-22:00", staff: "Mike Chen", role: "Welfare Officer", status: "confirmed" },
        { time: "22:00-06:00", staff: "Lisa Parker", role: "Security", status: "confirmed" },
      ],
    },
    {
      id: 7,
      day: "Sunday",
      date: "Mar 10",
      shifts: [
        { time: "06:00-14:00", staff: "John Smith", role: "Care Worker", status: "confirmed" },
        { time: "14:00-22:00", staff: "Sarah Johnson", role: "Care Worker", status: "confirmed" },
        { time: "22:00-06:00", staff: "David Brown", role: "Security", status: "confirmed" },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "vacant":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const vacantShifts = shifts.reduce((count, day) => {
    return count + day.shifts.filter((shift) => shift.status === "vacant").length
  }, 0)

  const pendingShifts = shifts.reduce((count, day) => {
    return count + day.shifts.filter((shift) => shift.status === "pending").length
  }, 0)

  return (
    <DashboardLayout breadcrumbs={[{ label: "Staff Scheduler" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Scheduler</h1>
            <p className="text-muted-foreground">Manage staff shifts and assignments</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Shift
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Shifts</p>
                  <p className="text-2xl font-bold">21</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">{21 - vacantShifts - pendingShifts}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingShifts}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vacant</p>
                  <p className="text-2xl font-bold">{vacantShifts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week Navigation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Schedule
                </CardTitle>
                <CardDescription>{currentWeek}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {shifts.map((day) => (
                <div key={day.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{day.day}</h3>
                      <p className="text-sm text-muted-foreground">{day.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Day
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {day.shifts.map((shift, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{shift.time}</span>
                          <Badge className={getStatusColor(shift.status)}>{shift.status}</Badge>
                        </div>
                        {shift.staff ? (
                          <div>
                            <p className="font-medium">{shift.staff}</p>
                            <p className="text-sm text-muted-foreground">{shift.role}</p>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <p className="text-sm text-red-600 font-medium">VACANT</p>
                            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                              Assign Staff
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common scheduling tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Shift Pattern
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Assign Shifts
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Copy Previous Week
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Fill Vacant Shifts
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Availability</CardTitle>
              <CardDescription>Available staff for assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Care Worker</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">Mike Chen</p>
                    <p className="text-sm text-muted-foreground">Welfare Officer</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">Emma Wilson</p>
                    <p className="text-sm text-muted-foreground">Care Worker</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Limited
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
