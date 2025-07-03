"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  QrCode,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  MapPin,
  Timer,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ClockSystemPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const { toast } = useToast()

  const clockRecords = [
    {
      id: "CLK001",
      staffId: "STF001",
      staffName: "Sarah Johnson",
      branch: "Manchester",
      clockIn: "08:00:15",
      clockOut: "16:05:22",
      totalHours: "8h 5m",
      status: "completed",
      date: "2024-01-15",
      location: "Main Entrance",
      overtime: false,
    },
    {
      id: "CLK002",
      staffId: "STF002",
      staffName: "Ahmed Hassan",
      branch: "Manchester",
      clockIn: "09:02:33",
      clockOut: null,
      totalHours: "6h 30m",
      status: "active",
      date: "2024-01-15",
      location: "Staff Room",
      overtime: false,
    },
    {
      id: "CLK003",
      staffId: "STF003",
      staffName: "Emma Wilson",
      branch: "Birmingham",
      clockIn: "14:00:00",
      clockOut: "22:15:45",
      totalHours: "8h 15m",
      status: "completed",
      date: "2024-01-15",
      location: "Reception",
      overtime: true,
    },
    {
      id: "CLK004",
      staffId: "STF004",
      staffName: "David Brown",
      branch: "London Central",
      clockIn: "22:00:12",
      clockOut: null,
      totalHours: "5h 45m",
      status: "active",
      date: "2024-01-15",
      location: "Security Desk",
      overtime: false,
    },
  ]

  const branches = ["Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]

  const filteredRecords = clockRecords.filter((record) => {
    const matchesSearch =
      record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.staffId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = selectedBranch === "all" || record.branch === selectedBranch
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus

    return matchesSearch && matchesBranch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "late":
        return "bg-red-100 text-red-800"
      case "early":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Timer className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "late":
        return <XCircle className="h-4 w-4" />
      case "early":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleManualClockIn = () => {
    toast({
      title: "Manual Clock In",
      description: "Staff member has been manually clocked in.",
    })
  }

  const handleManualClockOut = () => {
    toast({
      title: "Manual Clock Out",
      description: "Staff member has been manually clocked out.",
    })
  }

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayRecords = clockRecords.filter((r) => r.date === today)

    return {
      totalStaff: todayRecords.length,
      activeNow: todayRecords.filter((r) => r.status === "active").length,
      completed: todayRecords.filter((r) => r.status === "completed").length,
      overtime: todayRecords.filter((r) => r.overtime).length,
    }
  }

  const stats = getTodayStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "Clock System" }]}
      title="QR Clock In/Out System"
      description="Monitor staff attendance and working hours across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff Today</p>
                  <p className="text-2xl font-bold">{stats.totalStaff}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Currently Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeNow}</p>
                </div>
                <Timer className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Shifts</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overtime Hours</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.overtime}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clock Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance Records
            </CardTitle>
            <CardDescription>Real-time staff clock in/out monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or staff ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full md:w-48"
              />
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Branch & Location</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {record.staffName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{record.staffName}</div>
                            <div className="text-sm text-muted-foreground">{record.staffId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {record.branch}
                          </div>
                          <div className="text-xs text-muted-foreground">{record.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-mono text-sm">{record.clockIn}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.clockOut ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            <span className="font-mono text-sm">{record.clockOut}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-muted-foreground">Active</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{record.totalHours}</span>
                          {record.overtime && (
                            <Badge variant="secondary" className="text-xs">
                              OT
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {record.status === "active" ? (
                            <Button variant="outline" size="sm" onClick={handleManualClockOut}>
                              Clock Out
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={handleManualClockIn}>
                              Manual Entry
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

        {/* QR Code Generator */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Generator
              </CardTitle>
              <CardDescription>Generate QR codes for staff clock in/out</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">QR Code will appear here</p>
                  <Button>Generate QR Code</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-entrance">Main Entrance</SelectItem>
                    <SelectItem value="staff-room">Staff Room</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                    <SelectItem value="security-desk">Security Desk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
              <CardDescription>Real-time clock in/out activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Johnson clocked in</p>
                    <p className="text-xs text-muted-foreground">Manchester - Main Entrance • 2 min ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
                  <Timer className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ahmed Hassan clocked out</p>
                    <p className="text-xs text-muted-foreground">Manchester - Staff Room • 15 min ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Late clock in detected</p>
                    <p className="text-xs text-muted-foreground">Emma Wilson - Birmingham • 1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
