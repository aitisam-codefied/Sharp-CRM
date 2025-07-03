"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Eye, Search, Plus, Clock, User, MapPin, CheckCircle, AlertTriangle, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ObservationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedShift, setSelectedShift] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isNewObservationOpen, setIsNewObservationOpen] = useState(false)
  const { toast } = useToast()

  const observations = [
    {
      id: "OBS001",
      residentId: "SMS-USER-1001",
      residentName: "John Smith",
      room: "204A",
      branch: "Manchester",
      date: "2024-01-15",
      shift: "morning",
      time: "08:00",
      staffMember: "Sarah Johnson",
      observations: {
        physicalAppearance: "Good - well groomed, clean clothes",
        behavior: "Calm and cooperative",
        mood: "Positive, engaging in conversation",
        appetite: "Good - finished breakfast",
        sleep: "Reported good night's sleep",
        medication: "Taken as prescribed",
        socialInteraction: "Interacting well with other residents",
        concerns: "None noted",
      },
      flagged: false,
      followUpRequired: false,
      status: "completed",
    },
    {
      id: "OBS002",
      residentId: "SMS-USER-1002",
      residentName: "Ahmed Hassan",
      room: "205B",
      branch: "Manchester",
      date: "2024-01-15",
      shift: "afternoon",
      time: "14:30",
      staffMember: "Emma Wilson",
      observations: {
        physicalAppearance: "Tired appearance, disheveled",
        behavior: "Withdrawn, avoiding eye contact",
        mood: "Appears anxious and restless",
        appetite: "Poor - barely touched lunch",
        sleep: "Complained of insomnia",
        medication: "Refused afternoon medication",
        socialInteraction: "Isolating from others",
        concerns: "Mental health deterioration noted",
      },
      flagged: true,
      followUpRequired: true,
      status: "flagged",
    },
    {
      id: "OBS003",
      residentId: "SMS-USER-1003",
      residentName: "Maria Garcia",
      room: "206A",
      branch: "Birmingham",
      date: "2024-01-15",
      shift: "evening",
      time: "18:00",
      staffMember: "David Brown",
      observations: {
        physicalAppearance: "Well presented, good hygiene",
        behavior: "Active and engaged",
        mood: "Happy, laughing with others",
        appetite: "Excellent - enjoyed dinner",
        sleep: "No sleep issues reported",
        medication: "All medications taken",
        socialInteraction: "Very social, helping other residents",
        concerns: "None",
      },
      flagged: false,
      followUpRequired: false,
      status: "completed",
    },
    {
      id: "OBS004",
      residentId: "SMS-USER-1004",
      residentName: "David Wilson",
      room: "207B",
      branch: "Liverpool",
      date: "2024-01-15",
      shift: "night",
      time: "22:00",
      staffMember: "Lisa Chen",
      observations: {
        physicalAppearance: "Pale, appears unwell",
        behavior: "Lethargic, slow responses",
        mood: "Low mood, minimal communication",
        appetite: "Refused dinner",
        sleep: "Difficulty settling",
        medication: "Taken with assistance",
        socialInteraction: "Minimal interaction",
        concerns: "Possible illness, temperature slightly elevated",
      },
      flagged: true,
      followUpRequired: true,
      status: "medical_review",
    },
  ]

  const branches = ["Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const shifts = ["morning", "afternoon", "evening", "night"]

  const filteredObservations = observations.filter((obs) => {
    const matchesSearch =
      obs.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.residentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.room.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = selectedBranch === "all" || obs.branch === selectedBranch
    const matchesShift = selectedShift === "all" || obs.shift === selectedShift

    return matchesSearch && matchesBranch && matchesShift
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "flagged":
        return "bg-yellow-100 text-yellow-800"
      case "medical_review":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "morning":
        return "bg-orange-100 text-orange-800"
      case "afternoon":
        return "bg-blue-100 text-blue-800"
      case "evening":
        return "bg-purple-100 text-purple-800"
      case "night":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleNewObservation = () => {
    toast({
      title: "Observation Recorded",
      description: "New observation has been logged successfully.",
    })
    setIsNewObservationOpen(false)
  }

  const handleViewObservation = (obsId: string) => {
    toast({
      title: "View Observation",
      description: `Opening detailed view for observation ${obsId}`,
    })
  }

  const getStats = () => {
    const totalObservations = filteredObservations.length
    const flaggedObservations = filteredObservations.filter((obs) => obs.flagged).length
    const completedToday = filteredObservations.filter(
      (obs) => obs.date === new Date().toISOString().split("T")[0],
    ).length
    const followUpRequired = filteredObservations.filter((obs) => obs.followUpRequired).length

    return { totalObservations, flaggedObservations, completedToday, followUpRequired }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "Observation Checks" }]}
      title="Daily Observation System"
      description="Monitor and record daily resident observations across all shifts"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isNewObservationOpen} onOpenChange={setIsNewObservationOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Observation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Record Daily Observation</DialogTitle>
                <DialogDescription>Complete daily observation check for resident</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resident">Resident</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resident" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SMS-USER-1001">John Smith - 204A</SelectItem>
                        <SelectItem value="SMS-USER-1002">Ahmed Hassan - 205B</SelectItem>
                        <SelectItem value="SMS-USER-1003">Maria Garcia - 206A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.map((shift) => (
                          <SelectItem key={shift} value={shift}>
                            {shift.charAt(0).toUpperCase() + shift.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appearance">Physical Appearance</Label>
                    <Textarea id="appearance" placeholder="Describe physical appearance, hygiene, clothing..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="behavior">Behavior</Label>
                    <Textarea id="behavior" placeholder="Describe behavior, activity level, cooperation..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mood">Mood & Mental State</Label>
                    <Textarea id="mood" placeholder="Describe mood, emotional state, communication..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appetite">Appetite & Eating</Label>
                    <Textarea id="appetite" placeholder="Describe appetite, meal consumption..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sleep">Sleep Pattern</Label>
                    <Textarea id="sleep" placeholder="Describe sleep quality, any issues..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication Compliance</Label>
                    <Textarea id="medication" placeholder="Medication taken, any refusals or issues..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social">Social Interaction</Label>
                    <Textarea id="social" placeholder="Interaction with staff and other residents..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concerns">Concerns & Notes</Label>
                    <Textarea id="concerns" placeholder="Any concerns, unusual observations..." />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="flagged" />
                    <Label htmlFor="flagged">Flag for attention</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="followup" />
                    <Label htmlFor="followup">Requires follow-up</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewObservationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewObservation}>Record Observation</Button>
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
                  <p className="text-sm text-muted-foreground">Total Observations</p>
                  <p className="text-2xl font-bold">{stats.totalObservations}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Flagged for Attention</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.flaggedObservations}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{stats.completedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Follow-up Required</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.followUpRequired}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Observations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Daily Observation Records
            </CardTitle>
            <CardDescription>Monitor resident wellbeing through regular observations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or room..."
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
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  {shifts.map((shift) => (
                    <SelectItem key={shift} value={shift}>
                      {shift.charAt(0).toUpperCase() + shift.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Branch & Room</TableHead>
                    <TableHead>Shift & Time</TableHead>
                    <TableHead>Key Observations</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObservations.map((obs) => (
                    <TableRow key={obs.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{obs.residentName}</div>
                          <div className="text-sm text-muted-foreground">{obs.residentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {obs.branch}
                          </div>
                          <div className="text-sm text-muted-foreground">Room {obs.room}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getShiftColor(obs.shift)}>{obs.shift}</Badge>
                          <div className="text-sm text-muted-foreground">
                            {obs.date} at {obs.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm max-w-xs">
                          <div>
                            <strong>Mood:</strong> {obs.observations.mood.substring(0, 30)}...
                          </div>
                          <div>
                            <strong>Behavior:</strong> {obs.observations.behavior.substring(0, 30)}...
                          </div>
                          {obs.observations.concerns !== "None" && obs.observations.concerns !== "None noted" && (
                            <div className="text-red-600">
                              <strong>Concerns:</strong> {obs.observations.concerns.substring(0, 30)}...
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {obs.flagged && (
                            <Badge variant="destructive" className="text-xs">
                              Flagged
                            </Badge>
                          )}
                          {obs.followUpRequired && (
                            <Badge variant="secondary" className="text-xs">
                              Follow-up
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <User className="h-3 w-3 mr-1" />
                          {obs.staffMember}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(obs.status)}>{obs.status.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewObservation(obs.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Flagged Observations Alert */}
        {stats.flaggedObservations > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Flagged Observations Requiring Attention
              </CardTitle>
              <CardDescription className="text-yellow-600">
                {stats.flaggedObservations} observations have been flagged for immediate review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredObservations
                  .filter((obs) => obs.flagged)
                  .map((obs) => (
                    <div key={obs.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-900">
                          {obs.residentName} - Room {obs.room}
                        </p>
                        <p className="text-sm text-yellow-600">{obs.observations.concerns}</p>
                        <p className="text-xs text-yellow-500">
                          {obs.branch} • {obs.shift} shift • Observed by {obs.staffMember}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleViewObservation(obs.id)}>
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
