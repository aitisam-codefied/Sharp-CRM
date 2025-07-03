"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  BedDouble,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  MapPin,
  Users,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedFloor, setSelectedFloor] = useState("all")
  const [isNewRoomOpen, setIsNewRoomOpen] = useState(false)
  const { toast } = useToast()

  const rooms = [
    {
      id: "RM001",
      roomNumber: "204A",
      floor: "2",
      block: "A",
      branch: "Manchester",
      capacity: 1,
      currentOccupancy: 1,
      status: "occupied",
      roomType: "single",
      resident: "John Smith (SMS-USER-1001)",
      checkInDate: "2024-01-10",
      facilities: ["Private Bathroom", "WiFi", "Heating", "Desk"],
      condition: "good",
      lastInspection: "2024-01-01",
      maintenanceIssues: [],
      notes: "Room in good condition, resident settled well",
      rent: 250,
      keyHolder: "Sarah Johnson",
    },
    {
      id: "RM002",
      roomNumber: "205B",
      floor: "2",
      block: "B",
      branch: "Manchester",
      capacity: 1,
      currentOccupancy: 1,
      status: "occupied",
      roomType: "single",
      resident: "Ahmed Hassan (SMS-USER-1002)",
      checkInDate: "2024-01-08",
      facilities: ["Private Bathroom", "WiFi", "Heating"],
      condition: "fair",
      lastInspection: "2023-12-28",
      maintenanceIssues: ["Leaky faucet"],
      notes: "Minor plumbing issue reported",
      rent: 250,
      keyHolder: "Emma Wilson",
    },
    {
      id: "RM003",
      roomNumber: "206A",
      floor: "2",
      block: "A",
      branch: "Birmingham",
      capacity: 2,
      currentOccupancy: 1,
      status: "partially_occupied",
      roomType: "shared",
      resident: "Maria Garcia (SMS-USER-1003)",
      checkInDate: "2024-01-05",
      facilities: ["Shared Bathroom", "WiFi", "Heating", "2 Beds"],
      condition: "excellent",
      lastInspection: "2024-01-05",
      maintenanceIssues: [],
      notes: "Excellent condition, space for one more resident",
      rent: 200,
      keyHolder: "David Brown",
    },
    {
      id: "RM004",
      roomNumber: "301C",
      floor: "3",
      block: "C",
      branch: "Liverpool",
      capacity: 1,
      currentOccupancy: 0,
      status: "available",
      roomType: "single",
      resident: null,
      checkInDate: null,
      facilities: ["Private Bathroom", "WiFi", "Heating", "Kitchenette"],
      condition: "good",
      lastInspection: "2024-01-10",
      maintenanceIssues: [],
      notes: "Ready for new resident",
      rent: 275,
      keyHolder: "Lisa Chen",
    },
    {
      id: "RM005",
      roomNumber: "102D",
      floor: "1",
      block: "D",
      branch: "London Central",
      capacity: 1,
      currentOccupancy: 0,
      status: "maintenance",
      roomType: "single",
      resident: null,
      checkInDate: null,
      facilities: ["Private Bathroom", "WiFi", "Heating"],
      condition: "poor",
      lastInspection: "2024-01-12",
      maintenanceIssues: ["Broken heating", "Damaged flooring", "Window repair needed"],
      notes: "Undergoing major repairs, estimated completion: 2024-01-25",
      rent: 250,
      keyHolder: "Maintenance Team",
    },
  ]

  const branches = ["Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const statusOptions = ["available", "occupied", "partially_occupied", "maintenance", "reserved"]
  const floors = ["1", "2", "3", "4", "5"]
  const roomTypes = ["single", "shared", "family", "accessible"]

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.resident?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.block.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = selectedBranch === "all" || room.branch === selectedBranch
    const matchesStatus = selectedStatus === "all" || room.status === selectedStatus
    const matchesFloor = selectedFloor === "all" || room.floor === selectedFloor

    return matchesSearch && matchesBranch && matchesStatus && matchesFloor
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-blue-100 text-blue-800"
      case "partially_occupied":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "reserved":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "fair":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleNewRoom = () => {
    toast({
      title: "Room Added",
      description: "New room has been successfully added to the system.",
    })
    setIsNewRoomOpen(false)
  }

  const handleViewRoom = (roomId: string) => {
    toast({
      title: "View Room",
      description: `Opening detailed view for room ${roomId}`,
    })
  }

  const handleEditRoom = (roomId: string) => {
    toast({
      title: "Edit Room",
      description: `Opening edit form for room ${roomId}`,
    })
  }

  const getStats = () => {
    const totalRooms = filteredRooms.length
    const availableRooms = filteredRooms.filter((r) => r.status === "available").length
    const occupiedRooms = filteredRooms.filter((r) => r.status === "occupied").length
    const maintenanceRooms = filteredRooms.filter((r) => r.status === "maintenance").length
    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0

    return { totalRooms, availableRooms, occupiedRooms, maintenanceRooms, occupancyRate }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "Room Management" }]}
      title="Room Management System"
      description="Manage room allocation, availability and maintenance across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isNewRoomOpen} onOpenChange={setIsNewRoomOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>Register a new room in the system</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input id="roomNumber" placeholder="e.g., 204A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select floor" />
                      </SelectTrigger>
                      <SelectContent>
                        {floors.map((floor) => (
                          <SelectItem key={floor} value={floor}>
                            Floor {floor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block">Block</Label>
                    <Input id="block" placeholder="e.g., A, B, C" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" placeholder="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rent">Monthly Rent (£)</Label>
                    <Input id="rent" type="number" placeholder="250" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyHolder">Key Holder</Label>
                    <Input id="keyHolder" placeholder="Staff member name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilities">Facilities</Label>
                  <Input id="facilities" placeholder="e.g., Private Bathroom, WiFi, Heating" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes about the room..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewRoomOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewRoom}>Add Room</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold">{stats.totalRooms}</p>
                </div>
                <BedDouble className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableRooms}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Occupied</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.occupiedRooms}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold text-red-600">{stats.maintenanceRooms}</p>
                </div>
                <Wrench className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.occupancyRate}%</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Room Directory
            </CardTitle>
            <CardDescription>Comprehensive room management and allocation system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by room number, resident, or block..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
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
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Floors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map((floor) => (
                    <SelectItem key={floor} value={floor}>
                      Floor {floor}
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
                    <TableHead>Room Details</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Current Resident</TableHead>
                    <TableHead>Condition & Maintenance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-lg">{room.roomNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            {room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)} Room
                          </div>
                          <div className="text-sm text-muted-foreground">£{room.rent}/month</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {room.branch}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Floor {room.floor}, Block {room.block}
                          </div>
                          <div className="text-sm text-muted-foreground">Key: {room.keyHolder}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {room.currentOccupancy}/{room.capacity}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {((room.currentOccupancy / room.capacity) * 100).toFixed(0)}% occupied
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {room.resident ? (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{room.resident.split(" (")[0]}</div>
                            <div className="text-xs text-muted-foreground">Check-in: {room.checkInDate}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Vacant</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className={`text-sm font-medium ${getConditionColor(room.condition)}`}>
                            {room.condition.charAt(0).toUpperCase() + room.condition.slice(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">Last inspection: {room.lastInspection}</div>
                          {room.maintenanceIssues.length > 0 && (
                            <div className="space-y-1">
                              {room.maintenanceIssues.map((issue, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(room.status)}>
                          {room.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewRoom(room.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditRoom(room.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {room.maintenanceIssues.length > 0 && (
                            <Button variant="ghost" size="sm">
                              <Wrench className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-8">
                <BedDouble className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or add a new room.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        {stats.maintenanceRooms > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Rooms Requiring Maintenance
              </CardTitle>
              <CardDescription className="text-red-600">
                {stats.maintenanceRooms} rooms currently under maintenance or requiring repairs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRooms
                  .filter((room) => room.status === "maintenance" || room.maintenanceIssues.length > 0)
                  .map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-red-900">
                          Room {room.roomNumber} - {room.branch}
                        </p>
                        <p className="text-sm text-red-600">
                          Issues: {room.maintenanceIssues.join(", ") || "General maintenance"}
                        </p>
                        <p className="text-xs text-red-500">Last inspection: {room.lastInspection}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleViewRoom(room.id)}>
                        <Wrench className="h-4 w-4 mr-2" />
                        Manage
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
