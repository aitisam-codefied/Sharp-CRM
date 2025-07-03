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
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Upload,
  Folder,
  Calendar,
  User,
  Lock,
  Unlock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false)
  const { toast } = useToast()

  const documents = [
    {
      id: "DOC001",
      title: "Emergency Evacuation Procedures",
      category: "emergency",
      description: "Step-by-step emergency evacuation procedures for all branches",
      version: "v2.1",
      lastUpdated: "2024-01-10",
      updatedBy: "Sarah Johnson",
      branch: "All Branches",
      status: "active",
      accessLevel: "all_staff",
      fileSize: "2.4 MB",
      fileType: "PDF",
      downloadCount: 45,
      tags: ["emergency", "safety", "evacuation"],
      mandatory: true,
    },
    {
      id: "DOC002",
      title: "Safeguarding Policy and Procedures",
      category: "safeguarding",
      description: "Comprehensive safeguarding policy including reporting procedures",
      version: "v3.0",
      lastUpdated: "2024-01-08",
      updatedBy: "Emma Wilson",
      branch: "All Branches",
      status: "active",
      accessLevel: "managers_only",
      fileSize: "5.2 MB",
      fileType: "PDF",
      downloadCount: 28,
      tags: ["safeguarding", "policy", "protection"],
      mandatory: true,
    },
    {
      id: "DOC003",
      title: "Meal Service Guidelines",
      category: "operations",
      description: "Guidelines for meal preparation, service, and dietary requirements",
      version: "v1.5",
      lastUpdated: "2024-01-05",
      updatedBy: "David Brown",
      branch: "Manchester",
      status: "active",
      accessLevel: "all_staff",
      fileSize: "1.8 MB",
      fileType: "PDF",
      downloadCount: 67,
      tags: ["meals", "dietary", "service"],
      mandatory: false,
    },
    {
      id: "DOC004",
      title: "Incident Reporting Form Template",
      category: "forms",
      description: "Standard template for incident reporting across all branches",
      version: "v2.0",
      lastUpdated: "2024-01-12",
      updatedBy: "Lisa Chen",
      branch: "All Branches",
      status: "active",
      accessLevel: "all_staff",
      fileSize: "0.5 MB",
      fileType: "DOCX",
      downloadCount: 89,
      tags: ["incident", "reporting", "template"],
      mandatory: true,
    },
    {
      id: "DOC005",
      title: "Staff Training Manual - Welfare Checks",
      category: "training",
      description: "Comprehensive training manual for conducting welfare checks",
      version: "v1.2",
      lastUpdated: "2023-12-20",
      updatedBy: "Ahmed Hassan",
      branch: "All Branches",
      status: "draft",
      accessLevel: "trainers_only",
      fileSize: "8.7 MB",
      fileType: "PDF",
      downloadCount: 12,
      tags: ["training", "welfare", "manual"],
      mandatory: false,
    },
    {
      id: "DOC006",
      title: "Room Inspection Checklist",
      category: "maintenance",
      description: "Monthly room inspection checklist and maintenance procedures",
      version: "v1.0",
      lastUpdated: "2024-01-15",
      updatedBy: "Maria Garcia",
      branch: "Birmingham",
      status: "active",
      accessLevel: "maintenance_staff",
      fileSize: "0.8 MB",
      fileType: "PDF",
      downloadCount: 23,
      tags: ["maintenance", "inspection", "rooms"],
      mandatory: true,
    },
  ]

  const categories = ["emergency", "safeguarding", "operations", "forms", "training", "maintenance", "policies"]
  const branches = ["All Branches", "Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const statusOptions = ["active", "draft", "archived", "under_review"]
  const accessLevels = ["all_staff", "managers_only", "trainers_only", "maintenance_staff", "admin_only"]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesBranch = selectedBranch === "all" || doc.branch === selectedBranch
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus

    return matchesSearch && matchesCategory && matchesBranch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "safeguarding":
        return "bg-purple-100 text-purple-800"
      case "operations":
        return "bg-blue-100 text-blue-800"
      case "forms":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-orange-100 text-orange-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "policies":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccessLevelIcon = (accessLevel: string) => {
    return accessLevel === "all_staff" ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />
  }

  const handleNewDocument = () => {
    toast({
      title: "Document Uploaded",
      description: "New document has been successfully uploaded and categorized.",
    })
    setIsNewDocumentOpen(false)
  }

  const handleViewDocument = (docId: string) => {
    toast({
      title: "View Document",
      description: `Opening document ${docId}`,
    })
  }

  const handleDownloadDocument = (docId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading document ${docId}`,
    })
  }

  const getStats = () => {
    const totalDocuments = filteredDocuments.length
    const activeDocuments = filteredDocuments.filter((d) => d.status === "active").length
    const mandatoryDocuments = filteredDocuments.filter((d) => d.mandatory).length
    const draftDocuments = filteredDocuments.filter((d) => d.status === "draft").length

    return { totalDocuments, activeDocuments, mandatoryDocuments, draftDocuments }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "SOP Documents" }]}
      title="Standard Operating Procedures"
      description="Manage organizational documents, policies, and procedures"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
          <Dialog open={isNewDocumentOpen} onOpenChange={setIsNewDocumentOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>Add a new SOP document to the system</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Document File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                    <Input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input id="title" placeholder="Enter document title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" placeholder="e.g., v1.0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of the document..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch.toLowerCase()}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessLevel">Access Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        {accessLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Enter tags separated by commas" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="mandatory" className="rounded" />
                  <Label htmlFor="mandatory">Mark as mandatory reading</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewDocumentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewDocument}>Upload Document</Button>
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
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                  <p className="text-2xl font-bold">{stats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Documents</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeDocuments}</p>
                </div>
                <Folder className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mandatory Reading</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.mandatoryDocuments}</p>
                </div>
                <Lock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Draft Documents</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.draftDocuments}</p>
                </div>
                <Edit className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Library
            </CardTitle>
            <CardDescription>Centralized repository of all organizational documents and procedures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
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
                    <TableHead>Document Details</TableHead>
                    <TableHead>Category & Branch</TableHead>
                    <TableHead>Version & Updates</TableHead>
                    <TableHead>Access & Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {doc.title}
                            {doc.mandatory && (
                              <Badge variant="destructive" className="text-xs">
                                Mandatory
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{doc.description}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doc.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getCategoryColor(doc.category)}>
                            {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                          </Badge>
                          <div className="text-sm text-muted-foreground">{doc.branch}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{doc.version}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {doc.lastUpdated}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            {doc.updatedBy}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            {getAccessLevelIcon(doc.accessLevel)}
                            <span className="ml-1">
                              {doc.accessLevel.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">{doc.downloadCount} downloads</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.fileSize} • {doc.fileType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc.id)}>
                            <Download className="h-4 w-4" />
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

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or upload a new document.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mandatory Documents Alert */}
        {stats.mandatoryDocuments > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Mandatory Reading Documents
              </CardTitle>
              <CardDescription className="text-orange-600">
                {stats.mandatoryDocuments} documents require mandatory reading by all staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredDocuments
                  .filter((doc) => doc.mandatory)
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-orange-900">{doc.title}</p>
                        <p className="text-sm text-orange-600">{doc.description}</p>
                        <p className="text-xs text-orange-500">
                          {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)} • {doc.version} • Updated{" "}
                          {doc.lastUpdated}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleViewDocument(doc.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Read Now
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
