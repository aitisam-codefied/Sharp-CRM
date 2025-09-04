"use client";
import { useState, useRef, useMemo } from "react";
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
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useGetFoods, Food } from "@/hooks/useGetFoods";
import { useCreateFood, CreateFoodData } from "@/hooks/useCreateFood";
import {
  useGetFoodCategories,
  FoodCategory,
} from "@/hooks/useGetFoodCategories";
import { useCreateFoodCategory } from "@/hooks/useCreateFoodCategory";
import { useBranches } from "@/hooks/useGetBranches";

const fallbackImages = [
  "/food1.jpg",
  "/food2.jpg",
  "/food3.jpg",
  "/food4.jpg",
  "/food5.jpg",
];

export default function FoodImagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all-branches");
  const [selectedMeal, setSelectedMeal] = useState("all-meals");
  const [selectedDate, setSelectedDate] = useState("07/11/2026");
  const [activeFilter, setActiveFilter] = useState("All");

  // State for upload dialog
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Form state for food creation
  const [formData, setFormData] = useState<CreateFoodData>({
    categoryId: "",
    name: "",
    description: "",
    mealType: "Breakfast",
    // dietaryTags: [],
    // allergens: [],
    nutritionalInfo: {},
    preparationTime: 0,
    images: [],
  });

  // API hooks
  const { data: foods, isLoading: foodsLoading } = useGetFoods();
  const { data: categories, isLoading: categoriesLoading } =
    useGetFoodCategories();
  const createFoodMutation = useCreateFood();
  const createCategoryMutation = useCreateFoodCategory();

  const { data: branchData } = useBranches();

  // useEffect(() => {
  //   console.log("branch data", branchData);
  // });

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

  const stats = [
    {
      title: "Total Foods",
      value: foods?.length?.toString() || "0",
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
      title: "Categories",
      value: categories?.length?.toString() || "0",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "Active Foods",
      value: foods?.filter((food) => food.isActive)?.length?.toString() || "0",
      icon: Camera,
      color: "text-purple-600",
    },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleFormChange = (field: keyof CreateFoodData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleDietaryTagChange = (tag: string, checked: boolean) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     dietaryTags: checked
  //       ? [...prev.dietaryTags, tag]
  //       : prev.dietaryTags.filter((t) => t !== tag),
  //   }));
  // };

  // const handleAllergenChange = (allergen: string, checked: boolean) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     allergens: checked
  //       ? [...prev.allergens, allergen]
  //       : prev.allergens.filter((a) => a !== allergen),
  //   }));
  // };

  const handleUpload = () => {
    if (!formData.categoryId || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createFoodMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Food Created",
          description: "Food has been successfully created.",
        });
        setIsUploadOpen(false);
        setFormData({
          categoryId: "",
          name: "",
          description: "",
          mealType: "Breakfast",
          // dietaryTags: [],
          // allergens: [],
          nutritionalInfo: {},
          preparationTime: 0,
          images: [],
        });
        setSelectedFiles([]);
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to create food",
          variant: "destructive",
        });
      },
    });
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    createCategoryMutation.mutate(
      { name: newCategoryName },
      {
        onSuccess: () => {
          toast({
            title: "Category Created",
            description: "Food category has been successfully created.",
          });
          setIsCategoryDialogOpen(false);
          setNewCategoryName("");
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.message || "Failed to create category",
            variant: "destructive",
          });
        },
      }
    );
  };

  // const handleDelete = (foodId: string) => {
  //   toast({
  //     title: "Food Deleted",
  //     description: "Food has been removed from the system.",
  //     variant: "destructive",
  //   });
  // };

  // Filter foods based on search and filters
  const filteredFoods =
    foods?.filter((food) => {
      const matchesSearch =
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMeal =
        selectedMeal === "all-meals" ||
        food.mealType.toLowerCase() === selectedMeal;
      const matchesFilter =
        activeFilter === "All" || food.mealType === activeFilter;

      return matchesSearch && matchesMeal && matchesFilter;
    }) || [];

  // random image ko memoized rakha taki har render pe change na ho
  const randomFallback = useMemo(() => {
    const idx = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[idx];
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Food Management</h1>
          </div>
          <div className="flex gap-2">
            {/* <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Gallery
            </Button> */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Food
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Food</DialogTitle>
                  <DialogDescription>
                    Add a new food item with images and details
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Images Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="images">Food Images</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop images here, or click to select
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                      {selectedFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">
                            Selected {selectedFiles.length} file(s)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Food Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        placeholder="Enter food name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mealType">Meal Type *</Label>
                      <Select
                        value={formData.mealType}
                        onValueChange={(value) =>
                          handleFormChange("mealType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                          <SelectItem value="Lunch">Lunch</SelectItem>
                          <SelectItem value="Dinner">Dinner</SelectItem>
                          {/* <SelectItem value="Snack">Snack</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Food Category *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          handleFormChange("categoryId", value)
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog
                        open={isCategoryDialogOpen}
                        onOpenChange={setIsCategoryDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#F87D7D]"
                          >
                            <Plus className="h-5 w-5 text-white font-bold" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                              Add a new food category
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="categoryName">
                                Category Name
                              </Label>
                              <Input
                                id="categoryName"
                                value={newCategoryName}
                                onChange={(e) =>
                                  setNewCategoryName(e.target.value)
                                }
                                placeholder="Enter category name"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsCategoryDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleCreateCategory}>
                                Create Category
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleFormChange("description", e.target.value)
                      }
                      placeholder="Describe the food item..."
                    />
                  </div>

                  {/* Preparation Time */}
                  <div className="space-y-2">
                    <Label htmlFor="preparationTime">
                      Preparation Time (minutes)
                    </Label>
                    <Input
                      id="preparationTime"
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) =>
                        handleFormChange(
                          "preparationTime",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Enter preparation time"
                    />
                  </div>

                  {/* Dietary Tags */}
                  {/* <div className="space-y-2">
                    <Label>Dietary Tags</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "Vegetarian",
                        "Vegan",
                        "Gluten-Free",
                        "Dairy-Free",
                        "Halal",
                        "Kosher",
                      ].map((tag) => (
                        <label
                          key={tag}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.dietaryTags.includes(tag)}
                            onChange={(e) =>
                              handleDietaryTagChange(tag, e.target.checked)
                            }
                            className="rounded"
                          />
                          <span className="text-sm">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div> */}

                  {/* Allergens */}
                  {/* <div className="space-y-2">
                    <Label>Allergens</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "Nuts",
                        "Dairy",
                        "Eggs",
                        "Soy",
                        "Wheat",
                        "Fish",
                        "Shellfish",
                      ].map((allergen) => (
                        <label
                          key={allergen}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.allergens.includes(allergen)}
                            onChange={(e) =>
                              handleAllergenChange(allergen, e.target.checked)
                            }
                            className="rounded"
                          />
                          <span className="text-sm">{allergen}</span>
                        </label>
                      ))}
                    </div>
                  </div> */}

                  {/* Nutritional Information */}
                  <div className="space-y-2">
                    <Label>Nutritional Information</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="calories">Calories</Label>
                        <Input
                          id="calories"
                          type="number"
                          value={formData.nutritionalInfo.calories || ""}
                          onChange={(e) =>
                            handleFormChange("nutritionalInfo", {
                              ...formData.nutritionalInfo,
                              calories: parseInt(e.target.value) || undefined,
                            })
                          }
                          placeholder="Calories"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input
                          id="protein"
                          type="number"
                          value={formData.nutritionalInfo.protein || ""}
                          onChange={(e) =>
                            handleFormChange("nutritionalInfo", {
                              ...formData.nutritionalInfo,
                              protein: parseInt(e.target.value) || undefined,
                            })
                          }
                          placeholder="Protein"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={createFoodMutation.isPending}
                  >
                    {createFoodMutation.isPending
                      ? "Creating..."
                      : "Create Food"}
                  </Button>
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

        {/* Food Gallery */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Gallery Header */}
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Food Gallery</h2>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  type="text"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-branches">All Branches</SelectItem>
                    {allBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        <div className="flex items-center gap-2">
                          <span>{branch.name}</span>-
                          <Badge className="bg-[#F87D7D] text-white">
                            {branch.company}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Meals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-meals">All Meals</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>
                {/* <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button> */}
              </div>

              {/* Filter Tabs with Icons */}
              <div className="flex flex-wrap items-center justify-between gap-2">
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
                {/* <Button
                  variant={activeFilter === "Snack" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveFilter("Snack")}
                  className={
                    activeFilter === "Snack"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }
                >
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-purple-400 rounded-sm flex items-center justify-center">
                      <Clock className="w-2 h-2 text-white" />
                    </div>
                    Snack
                  </div>
                </Button> */}
              </div>

              {/* Loading State */}
              {foodsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading foods...</p>
                </div>
              ) : (
                /* Food Grid */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredFoods.map((food) => (
                    <Card
                      key={food._id}
                      className="overflow-hidden border shadow-sm"
                    >
                      <div className="relative">
                        <img
                          src={`http://localhost:5001${food.images?.[0] || ""}`}
                          alt={food.name}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null; // infinite loop se bachaega
                            const randomFallback =
                              fallbackImages[
                                Math.floor(
                                  Math.random() * fallbackImages.length
                                )
                              ];
                            target.src = randomFallback;
                          }}
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
                          <span className="font-medium">{food.mealType}</span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <h3 className="font-medium text-sm leading-tight line-clamp-2">
                            {food.name}
                          </h3>
                          <p className="text-xs">{food.description}</p>

                          {/* <div className="flex flex-wrap gap-1">
                            {food.dietaryTags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div> */}

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>
                                {food.categoryId?.name || "Unknown Category"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{food.preparationTime} min</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!foodsLoading && filteredFoods.length === 0 && (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No foods found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || activeFilter !== "All"
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first food item"}
                  </p>
                  {!searchTerm && activeFilter === "All" && (
                    <Button
                      onClick={() => setIsUploadOpen(true)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add First Food
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
