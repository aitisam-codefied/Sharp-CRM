"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StaffSchedulerPage() {
  const [selectedDate, setSelectedDate] = useState("24 October");
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const { toast } = useToast();

  const stats = [
    {
      title: "Total Shifts",
      value: "4",
      icon: CalendarIcon,
      color: "text-red-600",
    },
    {
      title: "Confirmed",
      value: "3",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: "1",
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      title: "Total Hours",
      value: "32",
      icon: Clock,
      color: "text-purple-600",
    },
  ];

  const timeSlots = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Timeline shifts organized by rows to avoid overlap
  const timelineRows = [
    // Row 1
    [
      {
        id: 1,
        name: "Sarah Johnson",
        time: "8:00 - 12:00",
        startHour: 8,
        duration: 4,
        color: "bg-orange-400",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        time: "13:00 - 17:00",
        startHour: 13,
        duration: 4,
        color: "bg-green-400",
      },
    ],
    // Row 2
    [
      {
        id: 3,
        name: "Walter White",
        time: "9:00 - 12:00",
        startHour: 9,
        duration: 3,
        color: "bg-red-400",
      },
      {
        id: 4,
        name: "Franklin Saint",
        time: "10:00 - 13:00",
        startHour: 10,
        duration: 3,
        color: "bg-blue-400",
      },
    ],
    // Row 3
    [
      {
        id: 5,
        name: "Hank",
        time: "14:00 - 16:00",
        startHour: 14,
        duration: 2,
        color: "bg-blue-400",
      },
    ],
    // Row 4
    [
      {
        id: 6,
        name: "Gus Fring",
        time: "8:00 - 11:00",
        startHour: 8,
        duration: 3,
        color: "bg-orange-400",
      },
      {
        id: 7,
        name: "Robert",
        time: "11:00 - 15:00",
        startHour: 11,
        duration: 4,
        color: "bg-green-400",
      },
      {
        id: 8,
        name: "Chris Evans",
        time: "13:00 - 17:00",
        startHour: 13,
        duration: 4,
        color: "bg-blue-400",
      },
    ],
    // Row 5
    [
      {
        id: 9,
        name: "Walter White",
        time: "12:00 - 14:00",
        startHour: 12,
        duration: 2,
        color: "bg-red-400",
      },
      {
        id: 10,
        name: "Sarah Johnson",
        time: "13:00 - 16:00",
        startHour: 13,
        duration: 3,
        color: "bg-green-400",
      },
    ],
    // Row 6
    [
      {
        id: 11,
        name: "Sarah Johnson",
        time: "16:00 - 17:00",
        startHour: 16,
        duration: 1,
        color: "bg-green-400",
      },
    ],
  ];

  const handleAddShift = () => {
    toast({
      title: "Shift Added",
      description: "New shift has been successfully scheduled.",
    });
    setIsAddShiftOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Staff Scheduler</h1>
            <p className="text-muted-foreground">
              Drag and drop to reschedule shifts
            </p>
          </div>
          <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Shift</DialogTitle>
                <DialogDescription>
                  Create a new shift assignment for staff
                </DialogDescription>
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
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="walter">Walter White</SelectItem>
                        <SelectItem value="hank">Hank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="cook">Cook</SelectItem>
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
                <Button
                  variant="outline"
                  onClick={() => setIsAddShiftOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddShift}>Schedule Shift</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-10 w-64" />
            </div>
            <Select defaultValue="all-branches">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-branches">All Branches</SelectItem>
                <SelectItem value="manchester">Manchester</SelectItem>
                <SelectItem value="birmingham">Birmingham</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-roles">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="cook">Cook</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{selectedDate}</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>8:00 - 17:00</span>
              <Badge variant="outline" className="text-xs">
                Now
              </Badge>
            </div>
          </div>
        </div>

        {/* Schedule Timeline */}
        <Card>
          <CardContent className="p-6">
            {/* Time Header */}
            <div className="grid grid-cols-10 gap-0 mb-4">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="text-xs text-center text-muted-foreground font-medium py-2 border-r border-gray-200 last:border-r-0"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Timeline Rows */}
            <div className="space-y-2">
              {timelineRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="relative h-12 bg-gray-50 rounded-lg"
                >
                  {/* Grid background */}
                  <div className="absolute inset-0 grid grid-cols-10 gap-0">
                    {timeSlots.map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="border-r border-gray-200 last:border-r-0"
                      ></div>
                    ))}
                  </div>

                  {/* Shift blocks in this row */}
                  {row.map((shift) => {
                    const leftPercentage = ((shift.startHour - 8) / 9) * 100;
                    const widthPercentage = (shift.duration / 9) * 100;

                    return (
                      <div
                        key={shift.id}
                        className={`absolute top-1 bottom-1 rounded-md px-3 flex items-center justify-between text-white text-sm font-medium cursor-pointer hover:opacity-90 shadow-sm ${shift.color}`}
                        style={{
                          left: `${leftPercentage}%`,
                          width: `${widthPercentage}%`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate text-xs">
                            {shift.name}
                          </div>
                          <div className="text-xs opacity-90">{shift.time}</div>
                        </div>
                        <MoreHorizontal className="h-3 w-3 ml-2 flex-shrink-0 opacity-70" />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-400"></div>
                <span className="text-sm">Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-400"></div>
                <span className="text-sm">Staff</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-400"></div>
                <span className="text-sm">Security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-400"></div>
                <span className="text-sm">Cook</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
