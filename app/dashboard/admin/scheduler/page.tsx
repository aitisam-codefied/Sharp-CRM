"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  CalendarIcon,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StaffSchedulerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedBranch, setSelectedBranch] = useState("manchester")
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false)
  const { toast } = useToast()

  const branches = [
    { id: "manchester", name: "Manchester" },
    { id: "birmingham", name: "Birmingham" },
    { id: "london", name: "London Central" },
    { id: "liverpool", name: "Liverpool" },
    { id: "leeds", name: "Leeds" },
  ]

  const shifts = [
    {
      id: "1",
      staffName: "Sarah Johnson",
      staffId: "STF001",
      role: "Manager",
      date: "2024-01-15",
      startTime: "08:00",
      endTime: "16:00",
      branch: "manchester",
      status: "confirmed",
      hours: 8,
    },
    {
      id: "2",
      staffName: "Ahmed Hassan",
      staffId: "STF002",
      role: "Staff",
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "17:00",
      branch: "manchester",
      status: "confirmed",
      hours: 8,
    },
    {
      id: "3",
      staffName: "Emma Wilson",
      staffId: "STF003",
      role: "Staff",
      date: "2024-01-15",
      startTime: "14:00",
      endTime: "22:00",
      branch: "manchester",
      status: "pending",
      hours: 8,
    },
    {
      id: "4",
      staffName: "David Brown",
      staffId: "STF004",
      role: "Security",
      date: "2024-01-15",
      startTime: "22:00",
      endTime: "06:00",
      branch: "manchester",
      status: "confirmed",
      hours: 8,
    },
  ]

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Manager":
        return "bg-blue-500"
      case "Staff":
        return "bg-green-500"
      case "Security":
        return "bg-purple-500"
      case "Cook":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleAddShift = () => {
    toast({
      title: "Shift Added",
      description: "New shift has been successfully scheduled.",
    })
    setIsAddShiftOpen(false)
  }

  const handleEditShift = (shiftId: string) => {
    toast({
      title: "Edit Shift",
      description: `Opening edit form for shift ID: ${shiftId}`,
    })
  }

  const handleDeleteShift = (shiftId: string) => {
    toast({
      title: "Shift Cancelled",
      description: "Shift has been cancelled and staff notified.",
      variant: "destructive",
    })
  }

  const getWeekStats = () => {
    const totalShifts = shifts.length
    const confirmedShifts = shifts.filter((s) => s.status === "confirmed").length
    const pendingShifts = shifts.filter((s) => s.status === "pending").length
    const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0)

    return { totalShifts, confirmedShifts, pendingShifts, totalHours }
  }

  const stats = getWeekStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "Staff Scheduler" }]}
      title="Staff Scheduler"
      description="Manage staff shifts and schedules across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>
          <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Shift</DialogTitle>
                <DialogDescription>Create a new shift assignment for staff</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff">Staff Member</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STF001">Sarah Johnson</SelectItem>
                        <SelectItem value="STF002">Ahmed Hassan</SelectItem>
                        <SelectItem value="STF003">Emma Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddShiftOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddShift}>Schedule Shift</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  <p className="text-sm text-muted-foreground">Total Shifts</p>
                  <p className="text-2xl font-bold">{stats.totalShifts}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">{stats.confirmedShifts}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingShifts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{stats.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Calendar Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Calendar</CardTitle>
              <CardDescription>Select date and branch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />

              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Week Navigation</Label>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => setSelectedWeek(selectedWeek - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {selectedWeek === 0
                      ? "This Week"
                      : selectedWeek > 0
                        ? `+${selectedWeek} Week${selectedWeek > 1 ? "s" : ""}`
                        : `${selectedWeek} Week${selectedWeek < -1 ? "s" : ""}`}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setSelectedWeek(selectedWeek + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Grid */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Weekly Schedule - {branches.find((b) => b.id === selectedBranch)?.name}
              </CardTitle>
              <CardDescription>Drag and drop to reschedule shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Time Header */}
                <div className="grid grid-cols-8 gap-2 text-sm font-medium">
                  <div className="p-2">Time</div>
                  {weekDays.map((day) => (
                    <div key={day} className="p-2 text-center border rounded">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Schedule Grid */}
                <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
                  {timeSlots.slice(0, 18).map((time) => (
                    <div key={time} className="grid grid-cols-8 gap-2 text-sm">
                      <div className="p-2 text-muted-foreground font-mono">{time}</div>
                      {weekDays.map((day, dayIndex) => {
                        const dayShifts = shifts.filter((shift) => {
                          const shiftTime = Number.parseInt(shift.startTime.split(":")[0])
                          const currentTime = Number.parseInt(time.split(":")[0])
                          return shiftTime <= currentTime && Number.parseInt(shift.endTime.split(":")[0]) > currentTime
                        })

                        return (
                          <div key={`${day}-${time}`} className="p-1 min-h-[40px] border rounded bg-gray-50">
                            {dayShifts.map((shift) => (
                              <div
                                key={shift.id}
                                className={`p-1 rounded text-xs text-white mb-1 cursor-pointer hover:opacity-80 ${getRoleColor(shift.role)}`}
                                onClick={() => handleEditShift(shift.id)}
                              >
                                <div className="font-medium truncate">{shift.staffName.split(" ")[0]}</div>
                                <div className="opacity-90">
                                  {shift.startTime}-{shift.endTime}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span className="text-sm">Manager</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span className="text-sm">Staff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-500"></div>
                    <span className="text-sm">Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500"></div>
                    <span className="text-sm">Cook</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shift List */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Shifts</CardTitle>
            <CardDescription>Detailed view of all scheduled shifts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getRoleColor(shift.role)}`}></div>
                    <div>
                      <div className="font-medium">{shift.staffName}</div>
                      <div className="text-sm text-muted-foreground">
                        {shift.role} • {shift.staffId}
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <div className="text-muted-foreground">{shift.hours} hours</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(shift.status)}>{shift.status}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEditShift(shift.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteShift(shift.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
