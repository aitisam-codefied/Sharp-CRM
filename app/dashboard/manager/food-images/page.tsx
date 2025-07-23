"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Camera,
  Upload,
  Search,
  Filter,
  Download,
  Star,
  ImageIcon,
  TrendingUp,
  Trash2,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FoodImagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all-branches");
  const [selectedMeal, setSelectedMeal] = useState("all-meals");
  const [selectedDate, setSelectedDate] = useState("07/11/2026");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();

  const stats = [
    {
      title: "Total Images",
      value: "24",
      change: "20%",
      icon: ImageIcon,
      color: "text-blue-600",
    },
    {
      title: "Today's Uploads",
      value: "1",
      icon: Upload,
      color: "text-green-600",
    },
    {
      title: "Ratings",
      value: "12",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "Storage Used",
      value: "12",
      icon: Camera,
      color: "text-purple-600",
    },
  ];

  const foodImages = [
    {
      id: 1,
      title: "Traditional English breakfast with halal options",
      rating: 4.5,
      tags: ["Vegetarian", "Halal", "Breakfast"],
      branch: "Manchester",
      staff: "Sarah Johnson",
      time: "2024-01-15 08:30 AM",
      image: "/placeholder.svg?height=200&width=300&text=English+Breakfast",
    },
    {
      id: 2,
      title: "Mediterranean lunch with fresh vegetables",
      rating: 4.5,
      tags: ["Mediterranean", "Fresh", "Lunch"],
      branch: "Birmingham",
      staff: "Ahmed Hassan",
      time: "2024-01-15 12:45 PM",
      image: "/placeholder.svg?height=200&width=300&text=Mediterranean+Lunch",
    },
    {
      id: 3,
      title: "Traditional English breakfast with halal options",
      rating: 4.5,
      tags: ["Vegetarian", "Halal", "Breakfast"],
      branch: "London",
      staff: "Emma Wilson",
      time: "2024-01-15 08:30 AM",
      image: "/placeholder.svg?height=200&width=300&text=English+Breakfast",
    },
    {
      id: 4,
      title: "Traditional English breakfast with halal options",
      rating: 4.5,
      tags: ["Vegetarian", "Halal", "Breakfast"],
      branch: "Liverpool",
      staff: "David Brown",
      time: "2024-01-15 08:30 AM",
      image: "/placeholder.svg?height=200&width=300&text=English+Breakfast",
    },
    {
      id: 5,
      title: "Mediterranean lunch with fresh vegetables",
      rating: 4.5,
      tags: ["Mediterranean", "Fresh", "Lunch"],
      branch: "Leeds",
      staff: "Sarah Johnson",
      time: "2024-01-15 12:45 PM",
      image: "/placeholder.svg?height=200&width=300&text=Mediterranean+Lunch",
    },
    {
      id: 6,
      title: "Traditional English breakfast with halal options",
      rating: 4.5,
      tags: ["Vegetarian", "Halal", "Breakfast"],
      branch: "Manchester",
      staff: "Ahmed Hassan",
      time: "2024-01-15 08:30 AM",
      image: "/placeholder.svg?height=200&width=300&text=English+Breakfast",
    },
  ];

  const handleUpload = () => {
    toast({
      title: "Image Uploaded",
      description: "Food image has been successfully uploaded and tagged.",
    });
    setIsUploadOpen(false);
  };

  const handleDelete = (imageId: number) => {
    toast({
      title: "Image Deleted",
      description: "Food image has been removed from the system.",
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Food Image Management</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Gallery
            </Button>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Food Image</DialogTitle>
                  <DialogDescription>
                    Upload and tag a new food image for quality monitoring
                  </DialogDescription>
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
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
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
                          <SelectItem value="manchester">Manchester</SelectItem>
                          <SelectItem value="birmingham">Birmingham</SelectItem>
                          <SelectItem value="london">London Central</SelectItem>
                          <SelectItem value="liverpool">Liverpool</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the meal and any special notes..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Enter tags separated by commas (e.g., Halal, Vegetarian, Spicy)"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpload}>Upload Image</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      {stat.change && (
                        <div className="flex items-center text-green-600 text-sm">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.change}
                        </div>
                      )}
                    </div>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Food Image Gallery */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Gallery Header */}
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Food Image Gallery</h2>
              </div>

              {/* Filters Row */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  type="text"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-32"
                />
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-branches">All Branches</SelectItem>
                    <SelectItem value="manchester">Manchester</SelectItem>
                    <SelectItem value="birmingham">Birmingham</SelectItem>
                    <SelectItem value="london">London Central</SelectItem>
                    <SelectItem value="liverpool">Liverpool</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Meals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-meals">All Meals</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Filter Tabs with Icons */}
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant={activeFilter === "All" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveFilter("All")}
                  className={
                    activeFilter === "All"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "Breakfast" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveFilter("Breakfast")}
                  className={
                    activeFilter === "Breakfast"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }
                >
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-400 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-white">🍳</span>
                    </div>
                    Breakfast
                  </div>
                </Button>
                <Button
                  variant={activeFilter === "Lunch" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveFilter("Lunch")}
                  className={
                    activeFilter === "Lunch"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }
                >
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-400 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-white">🍽️</span>
                    </div>
                    Lunch
                  </div>
                </Button>
                <Button
                  variant={activeFilter === "Dinner" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveFilter("Dinner")}
                  className={
                    activeFilter === "Dinner"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }
                >
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-white">🌙</span>
                    </div>
                    Dinner
                  </div>
                </Button>
                <Button
                  variant={activeFilter === "Supper" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveFilter("Supper")}
                  className={
                    activeFilter === "Supper"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }
                >
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-purple-400 rounded-sm flex items-center justify-center">
                      <Clock className="w-2 h-2 text-white" />
                    </div>
                    Supper
                  </div>
                </Button>
                <Button
                  variant={activeFilter === "Drinks" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveFilter("Drinks")}
                  className={
                    activeFilter === "Drinks"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }
                >
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-400 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-white">🥤</span>
                    </div>
                    Drinks
                  </div>
                </Button>
                <Button
                  variant={activeFilter === "Tea" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveFilter("Tea")}
                  className={
                    activeFilter === "Tea"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }
                >
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-teal-400 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-white">☕</span>
                    </div>
                    Tea
                  </div>
                </Button>
              </div>

              {/* Image Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {foodImages.map((image) => (
                  <Card
                    key={image.id}
                    className="overflow-hidden border shadow-sm"
                  >
                    <div className="relative">
                      <img
                        src={image.image || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{image.rating}</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h3 className="font-medium text-sm leading-tight line-clamp-2">
                          {image.title}
                        </h3>

                        <div className="flex flex-wrap gap-1">
                          {image.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{image.branch}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{image.staff}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{image.time}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                          size="sm"
                        >
                          View Details →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
