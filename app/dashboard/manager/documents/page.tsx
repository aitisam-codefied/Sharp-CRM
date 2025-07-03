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
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Upload,
  Star,
  Clock,
  User,
  Building2,
  Shield,
  AlertTriangle,
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
      expiryDate: "2024-12-31",
      approvedBy: "David Brown",
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
      downloadCount: 30,
      tags: ["safeguarding", "policy", "procedures"],
      mandatory: true,
      expiryDate: "2024-06-30",
      approvedBy: "Sarah Johnson",
    },
    {
      id: "DOC003",
      title: "Staff Training Manual",
      category: "training",
      description: "Complete training manual for new staff members",
      version: "v1.5",
      lastUpdated: "2024-01-05",
      updatedBy: "Lisa Chen",
      branch: "All Branches",
      status: "active",
      accessLevel: "all_staff",
      fileSize: "8.7 MB",
      fileType: "PDF",
      downloadCount: 67,
      tags: ["training", "manual", "staff"],
      mandatory: true,
      expiryDate: "2024-12-31",
      approvedBy: "Emma Wilson",
    },
    {
      id: "DOC004",
      title: "Incident Reporting Forms",
      category: "forms",
      description: "Standard forms for incident reporting and documentation",
      version: "v2.0",
      lastUpdated: "2024-01-12",
      updatedBy: "Ahmed Hassan",
      branch: "All Branches",
      status: "active",
      accessLevel: "all_staff",
      fileSize: "1.2 MB",
      fileType: "PDF",
      downloadCount: 23,
      tags: ["forms", "incidents", "reporting"],
      mandatory: false,
      expiryDate: null,
      approvedBy: "David Brown",
    },
    {
      id: "DOC005",
      title: "Manchester Branch Specific Guidelines",
      category: "branch_specific",
      description: "Local guidelines and procedures specific to Manchester branch",
      version: "v1.3",
      lastUpdated: "2024-01-15",
      updatedBy: "Maria Garcia",
      branch: "Manchester",
      status: "active",
      accessLevel: "manchester_staff",
      fileSize: "3.1 MB",
      fileType: "PDF",
      downloadCount: 15,
      tags: ["manchester", "guidelines", "local"],
      mandatory: true,
      expiryDate: "2024-12-31",
      approvedBy: "Sarah Johnson",
    },
    {
      id: "DOC006",
      title: "Health and Safety Risk Assessment",
      category: "health_safety",
      description: "Annual health and safety risk assessment documentation",
      version: "v1.0",
      lastUpdated: "2024-01-01",
      updatedBy: "David Brown",
      branch: "All Branches",
      status: "draft",
      accessLevel: "managers_only",
      fileSize: "4.5 MB",
      fileType: "PDF",
      downloadCount: 8,
      tags: ["health", "safety", "risk", "assessment"],
      mandatory: true,
      expiryDate: "2024-12-31",
      approvedBy: null,
    },
  ]

  const categories = ["emergency", "safeguarding", "training", "forms", "branch_specific", "health_safety", "policy"]
  const branches = ["All Branches", "Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const statusOptions = ["active", "draft", "archived", "expired", "under_review"]
  const accessLevels = ["all_staff", "managers_only", "admin_only", "branch_specific"]

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
      case "expired":
        return "bg-red-100 text-red-800"
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
      case "training":
        return "bg-blue-100 text-blue-800"
      case "forms":
        return "bg-green-100 text-green-800"
      case "branch_specific":
        return "bg-orange-100 text-orange-800"
      case "health_safety":
        return "bg-yellow-100 text-yellow-800"
      case "policy":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleNewDocument = () => {
    toast({
      title: "Document Uploaded",
      description: "New document has been uploaded and is pending approval.",
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

  const handleEditDocument = (docId: string) => {
    toast({
      title: "Edit Document",
      description: `Opening editor for document ${docId}`,
    })
  }

  const getStats = () => {
    const totalDocuments = filteredDocuments.length
    const activeDocuments = filteredDocuments.filter((d) => d.status === "active").length
    const mandatoryDocuments = filteredDocuments.filter((d) => d.mandatory).length
    const expiringDocuments = filteredDocuments.filter((d) => {
      if (!d.expiryDate) return false
      const expiryDate = new Date(d.expiryDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return expiryDate <= thirtyDaysFromNow
    }).length

    return { totalDocuments, activeDocuments, mandatoryDocuments, expiringDocuments }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Manager Dashboard", href: "/dashboard/manager" }, { label: "Document Management" }]}
      title="Document Management System"
      description="Manage, organize and distribute documents across all branches"
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
                <DialogDescription>Add a new document to the system</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input id="title" placeholder="Enter document title" />
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
                            {category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter document description..." rows={3} />
                </div>
                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                    <Input id="expiryDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="e.g., safety, emergency, training" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                    <Input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Document Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mandatory" />
                      <Label htmlFor="mandatory">Mandatory reading for staff</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notification" />
                      <Label htmlFor="notification">Send notification to relevant staff</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tracking" />
                      <Label htmlFor="tracking">Enable read tracking</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewDocumentOpen(false)}>
                  Save as Draft
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
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeDocuments}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mandatory</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.mandatoryDocuments}</p>
                </div>
                <Star className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expiringDocuments}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
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
            <CardDescription>Manage and organize all system documents and resources</CardDescription>
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
                      {category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                    <TableHead>Status & Expiry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {doc.title}
                            {doc.mandatory && <Star className="h-3 w-3 text-orange-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{doc.description}</div>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getCategoryColor(doc.category)}>
                            {doc.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                          <div className="flex items-center text-sm">
                            <Building2 className="h-3 w-3 mr-1" />
                            {doc.branch}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Version {doc.version}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {doc.lastUpdated}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            {doc.updatedBy}
                          </div>
                          {doc.approvedBy && (
                            <div className="text-xs text-green-600">Approved by: {doc.approvedBy}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {doc.accessLevel.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {doc.fileSize} • {doc.fileType}
                          </div>
                          <div className="text-sm text-muted-foreground">{doc.downloadCount} downloads</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                          {doc.expiryDate && (
                            <div className="text-xs text-muted-foreground">
                              Expires: {doc.expiryDate}
                              {new Date(doc.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                                <span className="text-red-600 ml-1">(Soon)</span>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditDocument(doc.id)}>
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

        {/* Expiring Documents Alert */}
        {stats.expiringDocuments > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Documents Expiring Soon
              </CardTitle>
              <CardDescription className="text-red-600">
                {stats.expiringDocuments} documents are expiring within the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredDocuments
                  .filter((doc) => {
                    if (!doc.expiryDate) return false
                    const expiryDate = new Date(doc.expiryDate)
                    const thirtyDaysFromNow = new Date()
                    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                    return expiryDate <= thirtyDaysFromNow
                  })
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-red-900">{doc.title}</p>
                        <p className="text-sm text-red-600">
                          Expires: {doc.expiryDate} • {doc.branch}
                        </p>
                        <p className="text-xs text-red-500">Version {doc.version}</p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => handleEditDocument(doc.id)}>
                        Update
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
