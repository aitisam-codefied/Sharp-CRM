import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QrCode, Search, Download, Clock, User, MapPin, Activity } from "lucide-react"

export default function ManagerQRScannerPage() {
  const scanActivity = [
    {
      id: 1,
      timestamp: "2024-03-15 11:30:25",
      staff: "Sarah Johnson",
      action: "Welfare Check",
      location: "Room 204",
      resident: "John Smith",
      status: "completed",
      duration: "5 minutes",
    },
    {
      id: 2,
      timestamp: "2024-03-15 11:25:10",
      staff: "Mike Chen",
      action: "Meal Collection",
      location: "Dining Hall",
      resident: "Mary Wilson",
      status: "completed",
      duration: "2 minutes",
    },
    {
      id: 3,
      timestamp: "2024-03-15 11:20:45",
      staff: "Emma Wilson",
      action: "Clock In",
      location: "Main Entrance",
      resident: "-",
      status: "completed",
      duration: "1 minute",
    },
    {
      id: 4,
      timestamp: "2024-03-15 11:15:30",
      staff: "David Brown",
      action: "Incident Report",
      location: "Common Area",
      resident: "Robert Davis",
      status: "pending",
      duration: "8 minutes",
    },
    {
      id: 5,
      timestamp: "2024-03-15 11:10:15",
      staff: "Lisa Parker",
      action: "Observation Check",
      location: "Room 301",
      resident: "Alice Johnson",
      status: "completed",
      duration: "4 minutes",
    },
  ]

  const scanStats = [
    { type: "Welfare Checks", count: 24, percentage: 35 },
    { type: "Meal Collection", count: 18, percentage: 26 },
    { type: "Clock In/Out", count: 12, percentage: 18 },
    { type: "Incident Reports", count: 8, percentage: 12 },
    { type: "Observations", count: 6, percentage: 9 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "welfare check":
        return <User className="h-4 w-4 text-purple-500" />
      case "meal collection":
        return <Clock className="h-4 w-4 text-green-500" />
      case "clock in":
      case "clock out":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "incident report":
        return <Activity className="h-4 w-4 text-red-500" />
      case "observation check":
        return <MapPin className="h-4 w-4 text-orange-500" />
      default:
        return <QrCode className="h-4 w-4 text-gray-500" />
    }
  }

  const totalScans = scanActivity.length
  const completedScans = scanActivity.filter((scan) => scan.status === "completed").length
  const successRate = Math.round((completedScans / totalScans) * 100)

  return (
    <DashboardLayout breadcrumbs={[{ label: "QR Scanner Activity" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QR Scanner Activity</h1>
            <p className="text-muted-foreground">Monitor QR code scanning activity and usage patterns</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Generate QR Codes
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans Today</p>
                  <p className="text-2xl font-bold">68</p>
                </div>
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{successRate}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Staff</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold">3.2s</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan Activity Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Scan Activity Breakdown</CardTitle>
              <CardDescription>Distribution of QR scan types today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-sm font-medium">{stat.type}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stat.percentage}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{stat.count}</div>
                      <div className="text-xs text-muted-foreground">{stat.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>QR code management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Room QR Codes
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Generate Staff QR Codes
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Generate Location QR Codes
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scan Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Scan Activity
                </CardTitle>
                <CardDescription>Latest QR code scans and actions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="welfare">Welfare Checks</SelectItem>
                    <SelectItem value="meals">Meal Collection</SelectItem>
                    <SelectItem value="clock">Clock In/Out</SelectItem>
                    <SelectItem value="incidents">Incidents</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search activity..." className="pl-10 w-64" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanActivity.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell>
                        <div className="text-sm font-mono">{scan.timestamp}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{scan.staff}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(scan.action)}
                          <span className="font-medium">{scan.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {scan.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{scan.resident}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{scan.duration}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(scan.status)}>{scan.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
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
