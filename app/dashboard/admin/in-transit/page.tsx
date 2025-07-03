"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Truck,
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  MapPin,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function InTransitPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [isNewTransitOpen, setIsNewTransitOpen] = useState(false)
  const { toast } = useToast()

  const inTransitUsers = [
    {
      id: "IT001",
      name: "Ahmed Al-Rashid",
      age: 28,
      nationality: "Syrian",
      gender: "Male",
      expectedArrival: "2024-01-16",
      expectedTime: "14:30",
      destinationBranch: "Manchester",
      assignedRoom: "208A",
      transportMethod: "Coach",
      referringAgency: "Home Office",
      caseWorker: "Sarah Johnson",
      contactNumber: "+44 7700 900150",
      emergencyContact: "Brother - Omar Al-Rashid (+44 7700 900151)",
      specialRequirements: ["Wheelchair Access", "Halal Meals"],
      medicalNotes: "Diabetes - requires insulin",
      status: "confirmed",
      estimatedDuration: "2 hours",
      lastUpdate: "2024-01-15 16:30",
      documents: ["Passport", "Medical Records", "Referral Letter"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "IT002",
      name: "Fatima Hassan",
      age: 34,
      nationality: "Afghan",
      gender: "Female",
      expectedArrival: "2024-01-16",
      expectedTime: "18:00",
      destinationBranch: "Birmingham",
      assignedRoom: "105B",
      transportMethod: "Private Car",
      referringAgency: "Local Authority",
      caseWorker: "Emma Wilson",
      contactNumber: "+44 7700 900152",
      emergencyContact: "Husband - Ali Hassan (+44 7700 900153)",
      specialRequirements: ["Female Staff Only", "Prayer Room Access"],
      medicalNotes: "Pregnant - 6 months",
      status: "in_transit",
      estimatedDuration: "45 minutes",
      lastUpdate: "2024-01-16 17:15",
      documents: ["ID Card", "Medical Records", "Pregnancy Notes"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "IT003",
      name: "Carlos Rodriguez",
      age: 42,
      nationality: "Venezuelan",
      gender: "Male",
      expectedArrival: "2024-01-17",
      expectedTime: "10:00",
      destinationBranch: "London Central",
      assignedRoom: "302C",
      transportMethod: "Train",
      referringAgency: "Charity Organization",
      caseWorker: "David Brown",
      contactNumber: "+44 7700 900154",
      emergencyContact: "Sister - Maria Rodriguez (+44 7700 900155)",
      specialRequirements: ["Spanish Interpreter", "Vegetarian Meals"],
      medicalNotes: "High blood pressure medication",
      status: "delayed",
      estimatedDuration: "3 hours",
      lastUpdate: "2024-01-16 09:30",
      documents: ["Passport", "Medical Records", "Educational Certificates"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "IT004",
      name: "Amara Okafor",
      age: 25,
      nationality: "Nigerian",
      gender: "Female",
      expectedArrival: "2024-01-17",
      expectedTime: "16:45",
      destinationBranch: "Liverpool",
      assignedRoom: "201A",
      transportMethod: "Bus",
      referringAgency: "Red Cross",
      caseWorker: "Lisa Chen",
      contactNumber: "+44 7700 900156",
      emergencyContact: "Friend - Grace Okafor (+44 7700 900157)",
      specialRequirements: ["English Classes", "Job Training"],
      medicalNotes: "No known medical conditions",
      status: "confirmed",
      estimatedDuration: "4 hours",
      lastUpdate: "2024-01-16 14:20",
      documents: ["Passport", "Educational Certificates", "Work Experience"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const branches = ["Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const statusOptions = ["confirmed", "in_transit", "delayed", "arrived", "cancelled"]
  const transportMethods = ["Coach", "Train", "Bus", "Private Car", "Taxi", "Other"]

  const filteredUsers = inTransitUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.assignedRoom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = selectedBranch === "all" || user.destinationBranch === selectedBranch
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    const matchesDate = !selectedDate || user.expectedArrival === selectedDate

    return matchesSearch && matchesBranch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in_transit":
        return "bg-yellow-100 text-yellow-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      case "arrived":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />
      case "arrived":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleNewTransit = () => {
    toast({
      title: "Transit Alert Created",
      description: "New in-transit user has been added to the system.",
    })
    setIsNewTransitOpen(false)
  }

  const handleViewUser = (userId: string) => {
    toast({
      title: "View Transit Details",
      description: `Opening detailed view for ${userId}`,
    })
  }

  const handleMarkArrived = (userId: string) => {
    toast({
      title: "Arrival Confirmed",
      description: "User has been marked as arrived and room assignment activated.",
    })
  }

  const getStats = () => {
    const totalInTransit = filteredUsers.length
    const arrivingToday = filteredUsers.filter(
      (u) => u.expectedArrival === new Date().toISOString().split("T")[0],
    ).length
    const delayed = filteredUsers.filter((u) => u.status === "delayed").length
    const inTransit = filteredUsers.filter((u) => u.status === "in_transit").length

    return { totalInTransit, arrivingToday, delayed, inTransit }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "In-Transit Users" }]}
      title="In-Transit User Management"
      description="Track and manage incoming service users across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Dialog open={isNewTransitOpen} onOpenChange={setIsNewTransitOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transit Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add In-Transit User</DialogTitle>
                <DialogDescription>Create alert for incoming service user</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" placeholder="Enter nationality" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="arrivalDate">Expected Arrival Date</Label>
                    <Input id="arrivalDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Expected Time</Label>
                    <Input id="arrivalTime" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transport">Transport Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport" />
                      </SelectTrigger>
                      <SelectContent>
                        {transportMethods.map((method) => (
                          <SelectItem key={method} value={method.toLowerCase()}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Destination Branch</Label>
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
                    <Label htmlFor="room">Assigned Room</Label>
                    <Input id="room" placeholder="e.g., 204A" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agency">Referring Agency</Label>
                    <Input id="agency" placeholder="e.g., Home Office, Local Authority" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseworker">Assigned Case Worker</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select case worker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="emma">Emma Wilson</SelectItem>
                        <SelectItem value="david">David Brown</SelectItem>
                        <SelectItem value="lisa">Lisa Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Special Requirements</Label>
                  <Textarea id="requirements" placeholder="List any special requirements or needs..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical">Medical Notes</Label>
                  <Textarea id="medical" placeholder="Any medical conditions or requirements..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewTransitOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewTransit}>Create Alert</Button>
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
                  <p className="text-sm text-muted-foreground">Total In-Transit</p>
                  <p className="text-2xl font-bold">{stats.totalInTransit}</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Arriving Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.arrivingToday}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Currently In-Transit</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.inTransit}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delayed</p>
                  <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* In-Transit Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              In-Transit Service Users
            </CardTitle>
            <CardDescription>Monitor incoming service users and prepare for arrivals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, nationality, or room..."
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
                placeholder="Filter by date"
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
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                    <TableHead>Service User</TableHead>
                    <TableHead>Arrival Details</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Transport & Agency</TableHead>
                    <TableHead>Special Requirements</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.nationality} • {user.gender} • Age {user.age}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {user.expectedArrival}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {user.expectedTime}
                          </div>
                          <div className="text-xs text-muted-foreground">Duration: {user.estimatedDuration}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.destinationBranch}
                          </div>
                          <div className="text-sm text-muted-foreground">Room {user.assignedRoom}</div>
                          <div className="flex items-center text-sm">
                            <User className="h-3 w-3 mr-1" />
                            {user.caseWorker}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{user.transportMethod}</div>
                          <div className="text-sm text-muted-foreground">{user.referringAgency}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.contactNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {user.specialRequirements.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {user.specialRequirements.map((req) => (
                                <Badge key={req} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {user.medicalNotes && (
                            <div className="text-xs text-red-600">
                              <strong>Medical:</strong> {user.medicalNotes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(user.status)}
                            {user.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">Updated: {user.lastUpdate}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewUser(user.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.status !== "arrived" && (
                            <Button variant="outline" size="sm" onClick={() => handleMarkArrived(user.id)}>
                              Mark Arrived
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No in-transit users found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or add a new transit alert.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Urgent Arrivals Alert */}
        {stats.arrivingToday > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Arrivals Expected Today
              </CardTitle>
              <CardDescription className="text-blue-600">
                {stats.arrivingToday} service users are expected to arrive today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers
                  .filter((user) => user.expectedArrival === new Date().toISOString().split("T")[0])
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">
                          {user.name} - Expected at {user.expectedTime}
                        </p>
                        <p className="text-sm text-blue-600">
                          {user.destinationBranch} - Room {user.assignedRoom}
                        </p>
                        <p className="text-xs text-blue-500">
                          Transport: {user.transportMethod} • Case Worker: {user.caseWorker}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleViewUser(user.id)}>
                        Prepare
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
