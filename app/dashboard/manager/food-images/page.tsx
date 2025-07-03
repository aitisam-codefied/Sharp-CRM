"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Camera,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  MapPin,
  User,
  Clock,
  Star,
  ImageIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FoodImagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedMeal, setSelectedMeal] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const { toast } = useToast()

  const foodImages = [
    {
      id: "IMG001",
      filename: "breakfast_manchester_20240115.jpg",
      mealType: "Breakfast",
      branch: "Manchester",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2024-01-15",
      uploadTime: "08:30",
      description: "Traditional English breakfast with halal options",
      tags: ["Halal", "Vegetarian Options"],
      quality: 4.5,
      size: "2.3 MB",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "IMG002",
      filename: "lunch_birmingham_20240115.jpg",
      mealType: "Lunch",
      branch: "Birmingham",
      uploadedBy: "Ahmed Hassan",
      uploadDate: "2024-01-15",
      uploadTime: "12:45",
      description: "Mediterranean lunch with fresh vegetables",
      tags: ["Mediterranean", "Fresh", "Healthy"],
      quality: 4.2,
      size: "1.8 MB",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "IMG003",
      filename: "dinner_london_20240114.jpg",
      mealType: "Dinner",
      branch: "London Central",
      uploadedBy: "Emma Wilson",
      uploadDate: "2024-01-14",
      uploadTime: "18:30",
      description: "Curry night with rice and naan bread",
      tags: ["Spicy", "Traditional", "Popular"],
      quality: 4.8,
      size: "3.1 MB",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "IMG004",
      filename: "breakfast_liverpool_20240114.jpg",
      mealType: "Breakfast",
      branch: "Liverpool",
      uploadedBy: "David Brown",
      uploadDate: "2024-01-14",
      uploadTime: "09:00",
      description: "Continental breakfast with fresh fruits",
      tags: ["Continental", "Fresh Fruits", "Light"],
      quality: 4.0,
      size: "2.7 MB",
      url: "/placeholder.svg?height=200&width=300",
    },
  ]

  const branches = ["Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"]

  const filteredImages = foodImages.filter((image) => {
    const matchesSearch =
      image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      image.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = selectedBranch === "all" || image.branch === selectedBranch
    const matchesMeal = selectedMeal === "all" || image.mealType === selectedMeal

    return matchesSearch && matchesBranch && matchesMeal
  })

  const handleUpload = () => {
    toast({
      title: "Image Uploaded",
      description: "Food image has been successfully uploaded and tagged.",
    })
    setIsUploadOpen(false)
  }

  const handleDelete = (imageId: string) => {
    toast({
      title: "Image Deleted",
      description: "Food image has been removed from the system.",
      variant: "destructive",
    })
  }

  const handleView = (imageId: string) => {
    toast({
      title: "View Image",
      description: `Opening full view for image ${imageId}`,
    })
  }

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case "Breakfast":
        return "bg-orange-100 text-orange-800"
      case "Lunch":
        return "bg-green-100 text-green-800"
      case "Dinner":
        return "bg-blue-100 text-blue-800"
      case "Snack":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 4.5) return "text-green-600"
    if (quality >= 4.0) return "text-blue-600"
    if (quality >= 3.5) return "text-orange-600"
    return "text-red-600"
  }

  const getStats = () => {
    const totalImages = filteredImages.length
    const todayImages = filteredImages.filter((img) => img.uploadDate === new Date().toISOString().split("T")[0]).length
    const avgQuality = filteredImages.reduce((sum, img) => sum + img.quality, 0) / totalImages || 0
    const totalSize = filteredImages.reduce((sum, img) => sum + Number.parseFloat(img.size), 0)

    return { totalImages, todayImages, avgQuality, totalSize }
  }

  const stats = getStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "Food Images" }]}
      title="Food Image Management"
      description="Upload, manage and monitor meal quality through images"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Gallery
          </Button>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Food Image</DialogTitle>
                <DialogDescription>Upload and tag a new food image for quality monitoring</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Image File</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop an image here, or click to select
                    </p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mealType">Meal Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypes.map((meal) => (
                          <SelectItem key={meal} value={meal.toLowerCase()}>
                            {meal}
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the meal and any special notes..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Enter tags separated by commas (e.g., Halal, Vegetarian, Spicy)" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>Upload Image</Button>
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
                  <p className="text-sm text-muted-foreground">Total Images</p>
                  <p className="text-2xl font-bold">{stats.totalImages}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Uploads</p>
                  <p className="text-2xl font-bold">{stats.todayImages}</p>
                </div>
                <Upload className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Quality</p>
                  <p className="text-2xl font-bold">{stats.avgQuality.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold">{stats.totalSize.toFixed(1)} MB</p>
                </div>
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Food Image Gallery
            </CardTitle>
            <CardDescription>Browse and manage uploaded food images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by description, tags, or staff..."
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
              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Meals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Meals</SelectItem>
                  {mealTypes.map((meal) => (
                    <SelectItem key={meal} value={meal}>
                      {meal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Image Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.description}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getMealTypeColor(image.mealType)}>{image.mealType}</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        <Star className="h-3 w-3" />
                        <span className={getQualityColor(image.quality)}>{image.quality}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium line-clamp-2">{image.description}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{image.branch}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{image.uploadedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {image.uploadDate} at {image.uploadTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          <span>{image.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(image.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(image.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">{image.filename}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No images found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria or upload new images.</p>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
