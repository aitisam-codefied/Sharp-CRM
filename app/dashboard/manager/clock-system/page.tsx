import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Search, Download, Calendar, Users, TrendingUp, AlertCircle } from "lucide-react"

export default function ManagerClockSystemPage() {
  const todayAttendance = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Care Worker",
      clockIn: "07:58 AM",
      clockOut: null,
      status: "working",
      hoursWorked: "3h 45m",
      location: "Main Building",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Welfare Officer",
      clockIn: "08:15 AM",
      clockOut: null,
      status: "working",
      hoursWorked: "3h 28m",
      location: "Support Office",
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Care Assistant",
      clockIn: "06:00 AM",
      clockOut: "02:15 PM",
      status: "completed",
      hoursWorked: "8h 15m",
      location: "Residential Block A",
    },
    {
      id: 4,
      name: "David Brown",
      role: "Night Security",
      clockIn: "10:00 PM",
      clockOut: "06:30 AM",
      status: "completed",
      hoursWorked: "8h 30m",
      location: "Security Office",
    },
    {
      id: 5,
      name: "Lisa Parker",
      role: "Care Worker",
      clockIn: null,
      clockOut: null,
      status: "absent",
      hoursWorked: "0h 0m",
      location: "-",
    },
  ]

  const weeklyStats = [
    { day: "Mon", hours: 42, staff: 8 },
    { day: "Tue", hours: 38, staff: 7 },
    { day: "Wed", hours: 45, staff: 9 },
    { day: "Thu", hours: 40, staff: 8 },
    { day: "Fri", hours: 44, staff: 9 },
    { day: "Sat", hours: 36, staff: 6 },
    { day: "Sun", hours: 32, staff: 5 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const currentlyWorking = todayAttendance.filter((staff) => staff.status === "working").length
  const totalScheduled = todayAttendance.length
  const attendanceRate = Math.round(
    ((totalScheduled - todayAttendance.filter((staff) => staff.status === "absent").length) / totalScheduled) * 100,
  )

  return (
    <DashboardLayout breadcrumbs={[{ label: "QR Clock In/Out System" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QR Clock In/Out System</h1>
            <p className="text-muted-foreground">Monitor staff attendance and working hours</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              View Schedule
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Currently Working</p>
                  <p className="text-2xl font-bold">{currentlyWorking}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold">{attendanceRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours Today</p>
                  <p className="text-2xl font-bold">32.5h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Late Arrivals</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Attendance
                </CardTitle>
                <CardDescription>Real-time staff clock in/out status</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="working">Currently Working</SelectItem>
                    <SelectItem value="completed">Shift Completed</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search staff..." className="pl-10 w-64" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {staff.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-sm text-muted-foreground">{staff.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{staff.clockIn || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{staff.clockOut || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{staff.hoursWorked}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{staff.location}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(staff.status)}>{staff.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {staff.status === "working" && (
                            <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                              Manual Clock Out
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Hours Overview</CardTitle>
              <CardDescription>Total hours worked per day this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyStats.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(day.hours / 50) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{day.hours}h</div>
                      <div className="text-xs text-muted-foreground">{day.staff} staff</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common attendance management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Manual Clock In/Out
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Timesheet
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Historical Data
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Generate Attendance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
