"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  Send,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Info,
  MessageSquare,
  Calendar,
  Settings,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [isNewNotificationOpen, setIsNewNotificationOpen] = useState(false)
  const { toast } = useToast()

  const notifications = [
    {
      id: "NOT001",
      title: "Emergency Drill Scheduled",
      message: "Fire evacuation drill scheduled for tomorrow at 2:00 PM. All staff must participate.",
      type: "emergency",
      priority: "high",
      status: "active",
      createdBy: "Sarah Johnson",
      createdAt: "2024-01-15 09:30",
      scheduledFor: "2024-01-16 14:00",
      targetAudience: "all_staff",
      branch: "All Branches",
      readCount: 45,
      totalRecipients: 67,
      expiresAt: "2024-01-16 16:00",
      category: "safety",
    },
    {
      id: "NOT002",
      title: "New Service User Arrival",
      message: "Ahmed Al-Rashid will be arriving today at 2:30 PM. Room 208A has been prepared.",
      type: "info",
      priority: "medium",
      status: "active",
      createdBy: "Emma Wilson",
      createdAt: "2024-01-15 11:15",
      scheduledFor: "2024-01-15 11:15",
      targetAudience: "manchester_staff",
      branch: "Manchester",
      readCount: 12,
      totalRecipients: 15,
      expiresAt: "2024-01-15 18:00",
      category: "arrivals",
    },
    {
      id: "NOT003",
      title: "System Maintenance Tonight",
      message:
        "The SMS system will be offline for maintenance from 11 PM to 1 AM. Please complete all entries before 10:30 PM.",
      type: "warning",
      priority: "high",
      status: "scheduled",
      createdBy: "David Brown",
      createdAt: "2024-01-15 16:45",
      scheduledFor: "2024-01-15 20:00",
      targetAudience: "all_staff",
      branch: "All Branches",
      readCount: 0,
      totalRecipients: 67,
      expiresAt: "2024-01-16 02:00",
      category: "system",
    },
    {
      id: "NOT004",
      title: "Welfare Check Reminder",
      message: "Evening welfare checks for Block A are due. Please ensure all residents are accounted for.",
      type: "reminder",
      priority: "medium",
      status: "active",
      createdBy: "Lisa Chen",
      createdAt: "2024-01-15 18:00",
      scheduledFor: "2024-01-15 18:00",
      targetAudience: "evening_shift",
      branch: "Liverpool",
      readCount: 8,
      totalRecipients: 10,
      expiresAt: "2024-01-15 22:00",
      category: "welfare",
    },
    {
      id: "NOT005",
      title: "Training Session Tomorrow",
      message: "Mandatory safeguarding training session at 10 AM in Conference Room B. Attendance is required.",
      type: "info",
      priority: "medium",
      status: "expired",
      createdBy: "Ahmed Hassan",
      createdAt: "2024-01-14 15:30",
      scheduledFor: "2024-01-14 15:30",
      targetAudience: "managers_only",
      branch: "Birmingham",
      readCount: 5,
      totalRecipients: 8,
      expiresAt: "2024-01-15 10:00",
      category: "training",
    },
    {
      id: "NOT006",
      title: "Incident Report Follow-up",
      message: "Follow-up required for incident INC002. Please review and provide additional information.",
      type: "alert",
      priority: "high",
      status: "active",
      createdBy: "Maria Garcia",
      createdAt: "2024-01-15 14:20",
      scheduledFor: "2024-01-15 14:20",
      targetAudience: "specific_users",
      branch: "Manchester",
      readCount: 2,
      totalRecipients: 3,
      expiresAt: "2024-01-17 14:20",
      category: "incidents",
    },
  ]

  const notificationTypes = ["emergency", "info", "warning", "reminder", "alert"]
  const priorities = ["low", "medium", "high", "urgent"]
  const statusOptions = ["active", "scheduled", "expired", "draft"]
  const branches = ["All Branches", "Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const targetAudiences = [
    "all_staff",
    "managers_only",
    "admin_only",
    "morning_shift",
    "afternoon_shift",
    "evening_shift",
    "night_shift",
    "specific_users",
  ]

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || notification.type === selectedType
    const matchesStatus = selectedStatus === "all" || notification.status === selectedStatus
    const matchesBranch = selectedBranch === "all" || notification.branch === selectedBranch

    return matchesSearch && matchesType && matchesStatus && matchesBranch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      case "reminder":
        return "bg-purple-100 text-purple-800"
      case "alert":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "reminder":
        return <Clock className="h-4 w-4" />
      case "alert":
        return <Bell className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const handleNewNotification = () => {
    toast({
      title: "Notification Created",
      description: "New notification has been created and will be sent to selected recipients.",
    })
    setIsNewNotificationOpen(false)
  }

  const handleViewNotification = (notificationId: string) => {
    toast({
      title: "View Notification",
      description: `Opening detailed view for notification ${notificationId}`,
    })
  }

  const handleDeleteNotification = (notificationId: string) => {
    toast({
      title: "Notification Deleted",
      description: "Notification has been permanently deleted.",
      variant: "destructive",
    })
  }

  const getStats = () => {
    const totalNotifications = filteredNotifications.length
    const activeNotifications = filteredNotifications.filter((n) => n.status === "active").length
    const highPriorityNotifications = filteredNotifications.filter(
      (n) => n.priority === "high" || n.priority === "urgent",
    ).length
    const scheduledNotifications = filteredNotifications.filter((n) => n.status === "scheduled").length

    return { totalNotifications, activeNotifications, highPriorityNotifications, scheduledNotifications }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      title="Notification Management"
      description="Create, manage and track system notifications across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Dialog open={isNewNotificationOpen} onOpenChange={setIsNewNotificationOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>Send notification to staff members across branches</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Notification Title</Label>
                    <Input id="title" placeholder="Enter notification title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter notification message..." rows={4} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </SelectItem>
                        ))}
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
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map((audience) => (
                          <SelectItem key={audience} value={audience}>
                            {audience.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                    <Input id="scheduledFor" type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                    <Input id="expiresAt" type="datetime-local" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Notification Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email" />
                      <Label htmlFor="email">Send email notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sms" />
                      <Label htmlFor="sms">Send SMS notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="push" />
                      <Label htmlFor="push">Send push notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="persistent" />
                      <Label htmlFor="persistent">Make persistent (requires acknowledgment)</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewNotificationOpen(false)}>
                  Save as Draft
                </Button>
                <Button onClick={handleNewNotification}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
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
                  <p className="text-sm text-muted-foreground">Total Notifications</p>
                  <p className="text-2xl font-bold">{stats.totalNotifications}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeNotifications}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">{stats.highPriorityNotifications}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.scheduledNotifications}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              System Notifications
            </CardTitle>
            <CardDescription>Manage and track all system notifications and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notification Details</TableHead>
                    <TableHead>Type & Priority</TableHead>
                    <TableHead>Audience & Branch</TableHead>
                    <TableHead>Schedule & Status</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            {notification.title}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{notification.message}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {notification.id} • Category: {notification.category}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </Badge>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {notification.targetAudience.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                          <div className="text-sm text-muted-foreground">{notification.branch}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusColor(notification.status)}>
                            {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {notification.scheduledFor}
                            </div>
                            {notification.expiresAt && (
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Expires: {notification.expiresAt}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {notification.readCount}/{notification.totalRecipients} read
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(notification.readCount / notification.totalRecipients) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {((notification.readCount / notification.totalRecipients) * 100).toFixed(0)}% read
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            {notification.createdBy}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewNotification(notification.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or create a new notification.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* High Priority Notifications Alert */}
        {stats.highPriorityNotifications > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                High Priority Notifications
              </CardTitle>
              <CardDescription className="text-red-600">
                {stats.highPriorityNotifications} high priority notifications require immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredNotifications
                  .filter((notification) => notification.priority === "high" || notification.priority === "urgent")
                  .map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-red-900 flex items-center gap-2">
                          {getTypeIcon(notification.type)}
                          {notification.title}
                        </p>
                        <p className="text-sm text-red-600">{notification.message}</p>
                        <p className="text-xs text-red-500">
                          {notification.branch} • {notification.readCount}/{notification.totalRecipients} read
                        </p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => handleViewNotification(notification.id)}>
                        Review
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
