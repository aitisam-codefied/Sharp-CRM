"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BarChart3,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  AlertTriangle,
  FileText,
  Clock,
  PieChart,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [isNewReportOpen, setIsNewReportOpen] = useState(false)
  const { toast } = useToast()

  const reports = [
    {
      id: "RPT001",
      title: "Monthly Occupancy Report",
      category: "occupancy",
      description: "Detailed occupancy statistics across all branches",
      branch: "All Branches",
      period: "January 2024",
      generatedBy: "Sarah Johnson",
      generatedAt: "2024-01-31 23:59",
      status: "completed",
      fileSize: "2.4 MB",
      downloadCount: 15,
      metrics: {
        totalRooms: 150,
        occupiedRooms: 132,
        occupancyRate: 88,
        trend: "up",
        change: 5.2,
      },
      charts: ["occupancy_trend", "branch_comparison"],
      scheduled: true,
      nextGeneration: "2024-02-29",
    },
    {
      id: "RPT002",
      title: "Incident Analysis Report",
      category: "incidents",
      description: "Comprehensive analysis of incidents and safety metrics",
      branch: "All Branches",
      period: "Q4 2023",
      generatedBy: "Emma Wilson",
      generatedAt: "2024-01-15 16:30",
      status: "completed",
      fileSize: "5.8 MB",
      downloadCount: 28,
      metrics: {
        totalIncidents: 45,
        resolvedIncidents: 42,
        resolutionRate: 93.3,
        trend: "down",
        change: -12.5,
      },
      charts: ["incident_types", "resolution_times", "severity_breakdown"],
      scheduled: false,
      nextGeneration: null,
    },
    {
      id: "RPT003",
      title: "Staff Performance Dashboard",
      category: "staff",
      description: "Staff attendance, performance, and training metrics",
      branch: "Manchester",
      period: "January 2024",
      generatedBy: "David Brown",
      generatedAt: "2024-01-30 14:20",
      status: "completed",
      fileSize: "3.2 MB",
      downloadCount: 8,
      metrics: {
        totalStaff: 25,
        attendanceRate: 96.5,
        trainingCompliance: 88,
        trend: "up",
        change: 2.1,
      },
      charts: ["attendance_trends", "training_progress", "shift_coverage"],
      scheduled: true,
      nextGeneration: "2024-02-28",
    },
    {
      id: "RPT004",
      title: "Welfare Check Compliance",
      category: "welfare",
      description: "Welfare check completion rates and resident wellbeing metrics",
      branch: "All Branches",
      period: "Week 3, January 2024",
      generatedBy: "Lisa Chen",
      generatedAt: "2024-01-21 09:00",
      status: "generating",
      fileSize: null,
      downloadCount: 0,
      metrics: {
        totalChecks: 420,
        completedChecks: 398,
        completionRate: 94.8,
        trend: "up",
        change: 1.8,
      },
      charts: ["completion_rates", "branch_performance", "time_analysis"],
      scheduled: true,
      nextGeneration: "2024-01-28",
    },
    {
      id: "RPT005",
      title: "Financial Summary Report",
      category: "financial",
      description: "Revenue, expenses, and budget analysis",
      branch: "All Branches",
      period: "Q4 2023",
      generatedBy: "Ahmed Hassan",
      generatedAt: "2024-01-10 11:45",
      status: "completed",
      fileSize: "4.1 MB",
      downloadCount: 22,
      metrics: {
        totalRevenue: 125000,
        totalExpenses: 98000,
        profitMargin: 21.6,
        trend: "up",
        change: 8.3,
      },
      charts: ["revenue_trends", "expense_breakdown", "budget_variance"],
      scheduled: true,
      nextGeneration: "2024-04-10",
    },
    {
      id: "RPT006",
      title: "Service User Demographics",
      category: "demographics",
      description: "Demographic analysis and service user statistics",
      branch: "All Branches",
      period: "January 2024",
      generatedBy: "Maria Garcia",
      generatedAt: "2024-01-25 16:15",
      status: "draft",
      fileSize: null,
      downloadCount: 0,
      metrics: {
        totalServiceUsers: 132,
        newArrivals: 8,
        departures: 3,
        trend: "up",
        change: 3.8,
      },
      charts: ["nationality_breakdown", "age_distribution", "length_of_stay"],
      scheduled: false,
      nextGeneration: null,
    },
  ]

  const categories = ["occupancy", "incidents", "staff", "welfare", "financial", "demographics", "compliance"]
  const branches = ["All Branches", "Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const periods = ["daily", "weekly", "monthly", "quarterly", "yearly"]
  const statusOptions = ["completed", "generating", "draft", "scheduled", "failed"]

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || report.category === selectedCategory
    const matchesBranch = selectedBranch === "all" || report.branch === selectedBranch

    return matchesSearch && matchesCategory && matchesBranch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "generating":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "occupancy":
        return "bg-blue-100 text-blue-800"
      case "incidents":
        return "bg-red-100 text-red-800"
      case "staff":
        return "bg-green-100 text-green-800"
      case "welfare":
        return "bg-purple-100 text-purple-800"
      case "financial":
        return "bg-yellow-100 text-yellow-800"
      case "demographics":
        return "bg-pink-100 text-pink-800"
      case "compliance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const handleNewReport = () => {
    toast({
      title: "Report Scheduled",
      description: "New report has been scheduled for generation.",
    })
    setIsNewReportOpen(false)
  }

  const handleViewReport = (reportId: string) => {
    toast({
      title: "View Report",
      description: `Opening report ${reportId}`,
    })
  }

  const handleDownloadReport = (reportId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading report ${reportId}`,
    })
  }

  const getStats = () => {
    const totalReports = filteredReports.length
    const completedReports = filteredReports.filter((r) => r.status === "completed").length
    const scheduledReports = filteredReports.filter((r) => r.scheduled).length
    const totalDownloads = filteredReports.reduce((sum, report) => sum + report.downloadCount, 0)

    return { totalReports, completedReports, scheduledReports, totalDownloads }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "Reports & Analytics" }]}
      title="Reports & Analytics Dashboard"
      description="Generate, manage and analyze comprehensive reports across all operations"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
          <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>Create a custom report with specific parameters</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportTitle">Report Title</Label>
                    <Input id="reportTitle" placeholder="Enter report title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="period">Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period} value={period}>
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Include Metrics</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Occupancy Rates",
                      "Incident Statistics",
                      "Staff Performance",
                      "Welfare Compliance",
                      "Financial Data",
                      "Demographics",
                      "Maintenance Records",
                      "Training Compliance",
                    ].map((metric) => (
                      <div key={metric} className="flex items-center space-x-2">
                        <Checkbox id={metric} />
                        <Label htmlFor={metric} className="text-sm">
                          {metric}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Chart Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Bar Charts",
                      "Line Graphs",
                      "Pie Charts",
                      "Trend Analysis",
                      "Comparison Tables",
                      "Heat Maps",
                      "Time Series",
                      "Distribution Charts",
                    ].map((chart) => (
                      <div key={chart} className="flex items-center space-x-2">
                        <Checkbox id={chart} />
                        <Label htmlFor={chart} className="text-sm">
                          {chart}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="schedule" />
                  <Label htmlFor="schedule">Schedule for automatic generation</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewReportOpen(false)}>
                  Save as Template
                </Button>
                <Button onClick={handleNewReport}>Generate Report</Button>
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
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{stats.totalReports}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedReports}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.scheduledReports}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalDownloads}</p>
                </div>
                <Download className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Current Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Overall Rate</span>
                  <span className="font-bold">88%</span>
                </div>
                <Progress value={88} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +5.2% from last month
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Attendance Rate</span>
                  <span className="font-bold">96.5%</span>
                </div>
                <Progress value={96.5} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +2.1% from last month
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Incident Resolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resolution Rate</span>
                  <span className="font-bold">93.3%</span>
                </div>
                <Progress value={93.3} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  -12.5% incidents this quarter
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Generated Reports
            </CardTitle>
            <CardDescription>Comprehensive reports and analytics across all operational areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
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
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Periods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period.charAt(0).toUpperCase() + period.slice(1)}
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
                    <TableHead>Report Details</TableHead>
                    <TableHead>Category & Branch</TableHead>
                    <TableHead>Key Metrics</TableHead>
                    <TableHead>Generation Info</TableHead>
                    <TableHead>Status & Usage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{report.description}</div>
                          <div className="text-xs text-muted-foreground">Period: {report.period}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getCategoryColor(report.category)}>
                            {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                          </Badge>
                          <div className="text-sm text-muted-foreground">{report.branch}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {report.category === "occupancy" && (
                            <>
                              <div className="text-sm font-medium">{report.metrics.occupancyRate}% Occupancy</div>
                              <div className="text-xs text-muted-foreground">
                                {report.metrics.occupiedRooms}/{report.metrics.totalRooms} rooms
                              </div>
                            </>
                          )}
                          {report.category === "incidents" && (
                            <>
                              <div className="text-sm font-medium">{report.metrics.resolutionRate}% Resolved</div>
                              <div className="text-xs text-muted-foreground">
                                {report.metrics.resolvedIncidents}/{report.metrics.totalIncidents} incidents
                              </div>
                            </>
                          )}
                          {report.category === "staff" && (
                            <>
                              <div className="text-sm font-medium">{report.metrics.attendanceRate}% Attendance</div>
                              <div className="text-xs text-muted-foreground">
                                {report.metrics.totalStaff} staff members
                              </div>
                            </>
                          )}
                          {report.category === "welfare" && (
                            <>
                              <div className="text-sm font-medium">{report.metrics.completionRate}% Complete</div>
                              <div className="text-xs text-muted-foreground">
                                {report.metrics.completedChecks}/{report.metrics.totalChecks} checks
                              </div>
                            </>
                          )}
                          {report.category === "financial" && (
                            <>
                              <div className="text-sm font-medium">{report.metrics.profitMargin}% Margin</div>
                              <div className="text-xs text-muted-foreground">
                                £{(report.metrics.totalRevenue / 1000).toFixed(0)}k revenue
                              </div>
                            </>
                          )}
                          {report.category === "demographics" && (
                            <>
                              <div className="text-sm font-medium">{report.metrics.totalServiceUsers} Users</div>
                              <div className="text-xs text-muted-foreground">
                                +{report.metrics.newArrivals} new arrivals
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-1">
                            {getTrendIcon(report.metrics.trend)}
                            <span
                              className={`text-xs ${report.metrics.trend === "up" ? "text-green-600" : "text-red-600"}`}
                            >
                              {report.metrics.change > 0 ? "+" : ""}
                              {report.metrics.change}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.generatedAt}
                          </div>
                          <div className="text-sm text-muted-foreground">By: {report.generatedBy}</div>
                          {report.scheduled && report.nextGeneration && (
                            <div className="text-xs text-blue-600">Next: {report.nextGeneration}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                          {report.status === "generating" && <Progress value={65} className="h-1" />}
                          <div className="text-sm text-muted-foreground">
                            {report.fileSize && `${report.fileSize} • `}
                            {report.downloadCount} downloads
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {report.charts.map((chart) => (
                              <Badge key={chart} variant="outline" className="text-xs">
                                <PieChart className="h-3 w-3 mr-1" />
                                {chart.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewReport(report.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.status === "completed" && (
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No reports found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or generate a new report.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
