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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Search, Plus, Eye, Edit, Clock, User, MapPin, FileText, Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false)
  const { toast } = useToast()

  const incidents = [
    {
      id: "INC001",
      title: "Medical Emergency - Room 204A",
      description: "Resident experienced chest pain, ambulance called",
      severity: "critical",
      status: "resolved",
      reportedBy: "Sarah Johnson",
      assignedTo: "Dr. Smith",
      branch: "Manchester",
      location: "Room 204A",
      residentInvolved: "John Smith",
      dateReported: "2024-01-15",
      timeReported: "14:30",
      dateResolved: "2024-01-15",
      timeResolved: "16:45",
      category: "medical",
      actionsTaken: "Ambulance called, resident taken to hospital, family notified",
    },
    {
      id: "INC002",
      title: "Aggressive Behavior - Common Area",
      description: "Verbal altercation between two residents",
      severity: "medium",
      status: "investigating",
      reportedBy: "Ahmed Hassan",
      assignedTo: "Emma Wilson",
      branch: "Manchester",
      location: "Common Area",
      residentInvolved: "Multiple",
      dateReported: "2024-01-15",
      timeReported: "10:15",
      dateResolved: null,
      timeResolved: null,
      category: "behavioral",
      actionsTaken: "Residents separated, statements taken, counseling scheduled",
    },
    {
      id: "INC003",
      title: "Fire Alarm Malfunction",
      description: "False fire alarm triggered in Block B",
      severity: "low",
      status: "resolved",
      reportedBy: "David Brown",
      assignedTo: "Maintenance Team",
      branch: "Birmingham",
      location: "Block B",
      residentInvolved: "N/A",
      dateReported: "2024-01-14",
      timeReported: "22:00",
      dateResolved: "2024-01-15",
      timeResolved: "09:00",
      category: "facility",
      actionsTaken: "Alarm system reset, maintenance scheduled for full inspection",
    },
    {
      id: "INC004",
      title: "Missing Person Alert",
      description: "Resident not found during evening check",
      severity: "high",
      status: "open",
      reportedBy: "Lisa Chen",
      assignedTo: "Security Team",
      branch: "Liverpool",
      location: "Room 301B",
      residentInvolved: "Maria Santos",
      dateReported: "2024-01-15",
      timeReported: "20:00",
      dateResolved: null,
      timeResolved: null,
      category: "security",
      actionsTaken: "Search initiated, police notified, CCTV reviewed",
    },
  ]

  const branches = ["Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const severityLevels = ["low", "medium", "high", "critical"]
  const statusOptions = ["open", "investigating", "resolved", "closed"]
  const categories = ["medical", "behavioral", "facility", "security", "other"]

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.residentInvolved.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = selectedBranch === "all" || incident.branch === selectedBranch
    const matchesSeverity = selectedSeverity === "all" || incident.severity === selectedSeverity
    const matchesStatus = selectedStatus === "all" || incident.status === selectedStatus

    return matchesSearch && matchesBranch && matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
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
      case "open":
        return "bg-red-100 text-red-800"
      case "investigating":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical":
        return "bg-red-100 text-red-800"
      case "behavioral":
        return "bg-orange-100 text-orange-800"
      case "facility":
        return "bg-blue-100 text-blue-800"
      case "security":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleNewIncident = () => {
    toast({
      title: "Incident Reported",
      description: "New incident has been logged and assigned for investigation.",
    })
    setIsNewIncidentOpen(false)
  }

  const handleViewIncident = (incidentId: string) => {
    toast({
      title: "View Incident",
      description: `Opening detailed view for incident ${incidentId}`,
    })
  }

  const getStats = () => {
    const totalIncidents = filteredIncidents.length
    const openIncidents = filteredIncidents.filter((i) => i.status === "open" || i.status === "investigating").length
    const criticalIncidents = filteredIncidents.filter((i) => i.severity === "critical").length
    const resolvedToday = filteredIncidents.filter(
      (i) => i.dateResolved === new Date().toISOString().split("T")[0],
    ).length

    return { totalIncidents, openIncidents, criticalIncidents, resolvedToday }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      title="Incident Management System"
      description="Report, track and manage incidents across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report New Incident</DialogTitle>
                <DialogDescription>Log a new incident for investigation and tracking</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Incident Title</Label>
                    <Input id="title" placeholder="Brief description of incident" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Specific location within branch" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resident">Resident Involved</Label>
                    <Input id="resident" placeholder="Resident name or ID (if applicable)" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea id="description" placeholder="Provide detailed description of the incident..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actions">Immediate Actions Taken</Label>
                  <Textarea id="actions" placeholder="Describe any immediate actions taken..." rows={3} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewIncidentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewIncident}>Report Incident</Button>
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
                  <p className="text-sm text-muted-foreground">Total Incidents</p>
                  <p className="text-2xl font-bold">{stats.totalIncidents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open/Investigating</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.openIncidents}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Incidents</p>
                  <p className="text-2xl font-bold text-red-600">{stats.criticalIncidents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incidents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incident Reports
            </CardTitle>
            <CardDescription>Track and manage all reported incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
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
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {severityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead>Incident Details</TableHead>
                    <TableHead>Location & Resident</TableHead>
                    <TableHead>Severity & Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                 
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{incident.description}</div>
                        
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {incident.branch}
                          </div>
                          <div className="text-sm text-muted-foreground">{incident.location}</div>
                          <div className="flex items-center text-sm">
                            <User className="h-3 w-3 mr-1" />
                            {incident.residentInvolved}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                          <Badge className={getCategoryColor(incident.category)}>{incident.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{incident.dateReported}</div>
                          <div className="text-sm text-muted-foreground">{incident.timeReported}</div>
                          <div className="text-xs text-muted-foreground">by {incident.reportedBy}</div>
                        </div>
                      </TableCell>
                    
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewIncident(incident.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
