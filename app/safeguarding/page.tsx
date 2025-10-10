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
import { Shield, Search, Plus, Eye, AlertTriangle, Clock, User, MapPin, Download, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SafeguardingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isNewReferralOpen, setIsNewReferralOpen] = useState(false)
  const { toast } = useToast()

  const safeguardingCases = [
    {
      id: "SG001",
      referenceNumber: "SG-2024-001",
      residentId: "SMS-USER-1001",
      residentName: "John Smith",
      room: "204A",
      branch: "Manchester",
      type: "physical_abuse",
      severity: "high",
      status: "investigating",
      reportedBy: "Sarah Johnson",
      reportedDate: "2024-01-15",
      reportedTime: "09:30",
      assignedTo: "Safeguarding Team",
      description: "Resident reported physical altercation with another resident",
      actionsTaken: "Residents separated, statements taken, police notified",
      externalAgencies: ["Police", "Social Services"],
      followUpDate: "2024-01-18",
      riskLevel: "high",
      confidential: true,
    },
    {
      id: "SG002",
      referenceNumber: "SG-2024-002",
      residentId: "SMS-USER-1002",
      residentName: "Ahmed Hassan",
      room: "205B",
      branch: "Manchester",
      type: "neglect",
      severity: "medium",
      status: "open",
      reportedBy: "Emma Wilson",
      reportedDate: "2024-01-14",
      reportedTime: "14:20",
      assignedTo: "Branch Manager",
      description: "Concerns about resident's personal hygiene and self-care",
      actionsTaken: "Support plan reviewed, additional care arranged",
      externalAgencies: ["Social Services"],
      followUpDate: "2024-01-21",
      riskLevel: "medium",
      confidential: false,
    },
    {
      id: "SG003",
      referenceNumber: "SG-2024-003",
      residentId: "SMS-USER-1003",
      residentName: "Maria Garcia",
      room: "206A",
      branch: "Birmingham",
      type: "financial_abuse",
      severity: "high",
      status: "resolved",
      reportedBy: "David Brown",
      reportedDate: "2024-01-10",
      reportedTime: "11:00",
      assignedTo: "Safeguarding Officer",
      description: "Suspected financial exploitation by external party",
      actionsTaken: "Bank notified, accounts secured, legal advice sought",
      externalAgencies: ["Police", "Bank", "Legal Services"],
      followUpDate: null,
      riskLevel: "low",
      confidential: true,
    },
    {
      id: "SG004",
      referenceNumber: "SG-2024-004",
      residentId: "SMS-USER-1004",
      residentName: "David Wilson",
      room: "207B",
      branch: "Liverpool",
      type: "emotional_abuse",
      severity: "medium",
      status: "monitoring",
      reportedBy: "Lisa Chen",
      reportedDate: "2024-01-12",
      reportedTime: "16:45",
      assignedTo: "Mental Health Team",
      description: "Verbal abuse and intimidation from family member during visit",
      actionsTaken: "Visit restrictions implemented, counseling arranged",
      externalAgencies: ["Mental Health Services"],
      followUpDate: "2024-01-19",
      riskLevel: "medium",
      confidential: true,
    },
  ]

  const branches = ["Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const safeguardingTypes = [
    "physical_abuse",
    "emotional_abuse",
    "sexual_abuse",
    "financial_abuse",
    "neglect",
    "discrimination",
    "other",
  ]
  const statusOptions = ["open", "investigating", "monitoring", "resolved", "closed"]
  const severityLevels = ["low", "medium", "high", "critical"]

  const filteredCases = safeguardingCases.filter((case_) => {
    const matchesSearch =
      case_.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = selectedBranch === "all" || case_.branch === selectedBranch
    const matchesType = selectedType === "all" || case_.type === selectedType
    const matchesStatus = selectedStatus === "all" || case_.status === selectedStatus

    return matchesSearch && matchesBranch && matchesType && matchesStatus
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
        return "bg-orange-100 text-orange-800"
      case "monitoring":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "physical_abuse":
        return "bg-red-100 text-red-800"
      case "emotional_abuse":
        return "bg-orange-100 text-orange-800"
      case "sexual_abuse":
        return "bg-purple-100 text-purple-800"
      case "financial_abuse":
        return "bg-blue-100 text-blue-800"
      case "neglect":
        return "bg-yellow-100 text-yellow-800"
      case "discrimination":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleNewReferral = () => {
    toast({
      title: "Safeguarding Referral Created",
      description: "New safeguarding case has been logged and assigned for investigation.",
    })
    setIsNewReferralOpen(false)
  }

  const handleViewCase = (caseId: string) => {
    toast({
      title: "View Safeguarding Case",
      description: `Opening detailed view for case ${caseId}`,
    })
  }

  const getStats = () => {
    const totalCases = filteredCases.length
    const openCases = filteredCases.filter((c) => c.status === "open" || c.status === "investigating").length
    const highRiskCases = filteredCases.filter((c) => c.riskLevel === "high").length
    const overdueFollowUps = filteredCases.filter((c) => c.followUpDate && new Date(c.followUpDate) < new Date()).length

    return { totalCases, openCases, highRiskCases, overdueFollowUps }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "" }, { label: "Safeguarding" }]}
      title="Safeguarding Management"
      description="Manage safeguarding concerns and referrals across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Emergency Contacts
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isNewReferralOpen} onOpenChange={setIsNewReferralOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Referral
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Safeguarding Referral</DialogTitle>
                <DialogDescription>Report a new safeguarding concern for investigation</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resident">Resident Involved</Label>
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
                    <Label htmlFor="type">Type of Concern</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {safeguardingTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description of the safeguarding concern..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actions">Immediate Actions Taken</Label>
                  <Textarea id="actions" placeholder="Describe any immediate actions taken..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agencies">External Agencies Involved</Label>
                    <Input id="agencies" placeholder="e.g., Police, Social Services, NHS" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followup">Follow-up Date</Label>
                    <Input id="followup" type="date" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="confidential" />
                  <Label htmlFor="confidential">Mark as confidential (restricted access)</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewReferralOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewReferral}>Create Referral</Button>
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
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold">{stats.totalCases}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Cases</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.openCases}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk Cases</p>
                  <p className="text-2xl font-bold text-red-600">{stats.highRiskCases}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue Follow-ups</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.overdueFollowUps}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Safeguarding Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safeguarding Cases
            </CardTitle>
            <CardDescription>Monitor and manage all safeguarding concerns and referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cases..."
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {safeguardingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Details</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Type & Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Follow-up</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {case_.referenceNumber}
                            {case_.confidential && (
                              <Badge variant="outline" className="text-xs">
                                Confidential
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{case_.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{case_.residentName}</div>
                          <div className="text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {case_.branch} - Room {case_.room}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getTypeColor(case_.type)}>
                            {case_.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                          <Badge className={getSeverityColor(case_.severity)}>{case_.severity}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(case_.status)}>{case_.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{case_.reportedDate}</div>
                          <div className="text-sm text-muted-foreground">{case_.reportedTime}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            {case_.reportedBy}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {case_.followUpDate ? (
                          <div className="text-sm">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {case_.followUpDate}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">None scheduled</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewCase(case_.id)}>
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

        {/* High Risk Cases Alert */}
        {stats.highRiskCases > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                High Risk Safeguarding Cases
              </CardTitle>
              <CardDescription className="text-red-600">
                {stats.highRiskCases} cases require immediate attention and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredCases
                  .filter((case_) => case_.riskLevel === "high")
                  .map((case_) => (
                    <div key={case_.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-red-900">
                          {case_.residentName} - {case_.referenceNumber}
                        </p>
                        <p className="text-sm text-red-600">{case_.description}</p>
                        <p className="text-xs text-red-500">
                          {case_.branch} • Assigned to {case_.assignedTo}
                        </p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => handleViewCase(case_.id)}>
                        Review
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Safeguarding Contacts
            </CardTitle>
            <CardDescription>Important contact numbers for safeguarding emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Emergency Services</h4>
                <p className="text-2xl font-bold text-red-600">999</p>
                <p className="text-sm text-muted-foreground">Police, Fire, Ambulance</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Adult Social Services</h4>
                <p className="text-lg font-bold">0161 234 5678</p>
                <p className="text-sm text-muted-foreground">24/7 Safeguarding Hotline</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Safeguarding Officer</h4>
                <p className="text-lg font-bold">0161 234 5679</p>
                <p className="text-sm text-muted-foreground">Internal Safeguarding Team</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Mental Health Crisis</h4>
                <p className="text-lg font-bold">0800 123 4567</p>
                <p className="text-sm text-muted-foreground">24/7 Mental Health Support</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Domestic Violence</h4>
                <p className="text-lg font-bold">0808 2000 247</p>
                <p className="text-sm text-muted-foreground">National Domestic Violence Helpline</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Care Quality Commission</h4>
                <p className="text-lg font-bold">03000 616161</p>
                <p className="text-sm text-muted-foreground">CQC Safeguarding Team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
