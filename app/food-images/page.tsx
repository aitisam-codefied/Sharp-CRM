"use client";
import { useState, useRef, useMemo, useEffect } from "react";
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
  Pencil,
  Eye, // Added for edit icon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useGetFoods, Food } from "@/hooks/useGetFoods";
import { useCreateFood, CreateFoodData } from "@/hooks/useCreateFood";
import { useUpdateFood } from "@/hooks/useUpdateFood"; // New import
import {
  useGetFoodCategories,
  FoodCategory,
} from "@/hooks/useGetFoodCategories";
import { useCreateFoodCategory } from "@/hooks/useCreateFoodCategory";
import { useBranches } from "@/hooks/useGetBranches";
import { API_HOST } from "@/lib/axios";
import ModuleLogs from "@/components/ModuleLogs";

const fallbackImages = [
  "/food1.jpg",
  "/food2.jpg",
  "/food3.jpg",
  "/food4.jpg",
  "/food5.jpg",
];

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 300;
const MAX_PREP_TIME_LENGTH = 4; // number of digits allowed
const MAX_CALORIES_LENGTH = 5;
const MAX_PROTEIN_LENGTH = 5;
const MAX_CATEGORY_NAME_LENGTH = 20;

export default function FoodImagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all-branches");
  const [selectedMeal, setSelectedMeal] = useState("all-meals");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  // State for upload dialog
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  // Form state for food creation
  const [formData, setFormData] = useState<CreateFoodData>({
    categoryId: "",
    name: "",
    mealType: "Breakfast",
    images: [],
    dietaryTags: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // State for edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [editFormData, setEditFormData] = useState<CreateFoodData>({
    categoryId: "",
    name: "",
    mealType: "Breakfast",
    images: [],
  });
  const [editSelectedFiles, setEditSelectedFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});
  // API hooks
  const { data: foods, isLoading: foodsLoading } = useGetFoods(
    selectedBranch !== "all-branches" ? selectedBranch : undefined
  );
  const { data: categories, isLoading: categoriesLoading } =
    useGetFoodCategories();
  const createFoodMutation = useCreateFood();
  const updateFoodMutation = useUpdateFood(); // New
  const createCategoryMutation = useCreateFoodCategory();
  const { data: branchData } = useBranches();
  useEffect(() => {
    console.log("foooooooodss", foods);
  });

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

  const handleEditFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEditSelectedFiles(files);
    setEditFormData((prev) => ({ ...prev, images: files }));
  };

  const handleFormChange = (field: keyof CreateFoodData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateField = (field: string, value: any) => {
    let error = "";

    switch (field) {
      case "name":
        if (value.length > MAX_NAME_LENGTH) {
          error = `Food name cannot exceed ${MAX_NAME_LENGTH} characters`;
        }
        break;

      case "categoryName":
        if (value.length > MAX_CATEGORY_NAME_LENGTH) {
          error = `Category name cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters`;
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleEditFormChange = (field: keyof CreateFoodData, value: any) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    setEditErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Food name is required";
    if (!formData.mealType) newErrors.mealType = "Meal type is required";
    if (!formData.images || formData.images.length === 0)
      newErrors.images = "At least one image is required";
    
    // Validate dietary tags - ensure only valid tags are selected
    const validTags = [
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Dairy-Free",
      "Halal",
      "Kosher",
      "Kids",
      "Diabetic",
    ];
    if (formData.dietaryTags && formData.dietaryTags.length > 0) {
      const invalidTags = formData.dietaryTags.filter(
        (tag) => !validTags.includes(tag)
      );
      if (invalidTags.length > 0) {
        newErrors.dietaryTags = "Invalid dietary tags selected";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editFormData.name.trim()) newErrors.name = "Food name is required";
    if (!editFormData.mealType) newErrors.mealType = "Meal type is required";

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = () => {
    if (!validateForm()) return;
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
          mealType: "Breakfast",
          images: [],
          dietaryTags: [],
        });
        setSelectedFiles([]);
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response?.data?.details ||
            error.response?.data?.error ||
            "Failed to create food",
          variant: "destructive",
        });
      },
    });
  };
  const handleEdit = (food: Food) => {
    setSelectedFood(food);
    setEditFormData({
      categoryId: food.categoryId?._id || "",
      name: food.name,
      description: food.description || "",
      mealType: food.mealType,
      // dietaryTags: food.dietaryTags || [],
      // allergens: food.allergens || [],
      nutritionalInfo: food.nutritionalInfo || {},
      preparationTime: food.preparationTime || 0,
      images: [],
    });
    setEditSelectedFiles([]);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!validateEditForm()) return;
    if (selectedFood) {
      updateFoodMutation.mutate(
        { id: selectedFood._id, data: editFormData },
        {
          onSuccess: () => {
            toast({
              title: "Food Updated",
              description: "Food has been successfully updated.",
            });
            setIsEditOpen(false);
            setSelectedFood(null);
            setEditFormData({
              categoryId: "",
              name: "",
              description: "",
              mealType: "Breakfast",
              dietaryTags: [],
              allergens: [],
              nutritionalInfo: {},
              preparationTime: 0,
              images: [],
            });
            setEditSelectedFiles([]);
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error.response?.data?.details || "Failed to update food",
              variant: "destructive",
            });
          },
        }
      );
    }
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

  // Extract unique branches from foods data
  const uniqueBranches = useMemo(() => {
    if (!foods) return [];
    const branchMap = new Map<string, { _id: string; name: string }>();
    foods.forEach((food) => {
      if (food.branchId && typeof food.branchId === 'object' && food.branchId._id && food.branchId.name) {
        branchMap.set(food.branchId._id, {
          _id: food.branchId._id,
          name: food.branchId.name,
        });
      }
    });
    return Array.from(branchMap.values());
  }, [foods]);

  // Filter foods based on search and filters
  const filteredFoods =
    foods?.filter((food) => {
      const matchesSearch =
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMeal =
        selectedMeal === "all-meals" ||
        food.mealType.toLowerCase() === selectedMeal.toLowerCase();
      const matchesFilter =
        activeFilter === "All" || food.mealType === activeFilter;
      // ✅ Date filter
      const matchesDate =
        !selectedDate ||
        (() => {
          const selected = new Date(selectedDate).toISOString().split("T")[0]; // "YYYY-MM-DD"
          const created = new Date(food.createdAt).toISOString().split("T")[0]; // "YYYY-MM-DD"
          return created === selected;
        })();
      const matchesBranch =
        selectedBranch === "all-branches" ||
        (food.branchId && 
         typeof food.branchId === 'object' && 
         food.branchId._id === selectedBranch);
      return matchesSearch && matchesMeal && matchesFilter && matchesDate && matchesBranch;
    }) || [];

  function formatDateWithSuffix(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    // suffix calculate
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  }

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.mealType &&
      (formData.images?.length ?? 0) > 0 &&
      !errors.name &&
      !errors.dietaryTags
    );
  }, [formData, errors]);

  const hasChanges = useMemo(() => {
    if (!selectedFood) return false;
    const initial = {
      categoryId: selectedFood.categoryId?._id || "",
      name: selectedFood.name,
      mealType: selectedFood.mealType,
    };
    // Compare without images (since edit images are new files)
    return (
      JSON.stringify(editFormData) !==
        JSON.stringify({ ...initial, images: [] }) ||
      editSelectedFiles.length > 0
    );
  }, [editFormData, editSelectedFiles, selectedFood]);

  const handleNewCategoryChange = (value: string) => {
    setNewCategoryName(value);
    if (
      categories?.some(
        (cat) => cat.name.toLowerCase() === value.toLowerCase().trim()
      )
    ) {
      setCategoryError("This category already exists.");
    } else {
      setCategoryError("");
    }
  };

  const isCategoryValid = newCategoryName.trim().length > 0 && !categoryError;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm sm:text-2xl font-bold">Food Management</h1>
          </div>
          <div className="flex gap-2">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-[#F87D7D] text-white text-xs sm:text-sm"
                >
                  <Upload className="h-4 w-4" /> Add Food
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
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Food Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center relative h-60 flex items-center justify-center">
                      {selectedFiles.length > 0 ? (
                        <div className="w-full h-full relative">
                          <img
                            src={URL.createObjectURL(selectedFiles[0])}
                            alt="preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {/* Bottom overlay with filename + actions */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 flex items-center justify-between px-3 py-2 text-white text-sm rounded-b-lg">
                            <span className="truncate max-w-[50%]">
                              {selectedFiles[0].name.length > 20
                                ? selectedFiles[0].name.slice(0, 20) + "..."
                                : selectedFiles[0].name}
                            </span>
                            <div className="flex gap-2">
                              {/* 👁 View full image */}
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white"
                                onClick={() =>
                                  setPreviewImage(
                                    URL.createObjectURL(selectedFiles[0])
                                  )
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              {/* 🔄 Re-upload */}
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 mr-1" /> Re-upload
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center h-full w-full cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop or click to upload
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    {errors.images && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.images}
                      </p>
                    )}
                  </div>

                  {/* 🔍 Fullscreen Preview Modal */}
                  <Dialog
                    open={!!previewImage}
                    onOpenChange={() => setPreviewImage(null)}
                  >
                    <DialogContent className="max-w-2xl p-0">
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Full Preview"
                          className="w-full max-h-[80vh] rounded-lg"
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Food Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          handleFormChange("name", e.target.value);
                          validateField("name", e.target.value);
                        }}
                        placeholder="Enter food name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mealType">Meal Type *</Label>
                      <Select
                        value={formData.mealType}
                        onValueChange={(value) => {
                          handleFormChange("mealType", value);

                          if (value === "Breakfast") {
                            // Auto-select "Breakfast" category
                            handleFormChange(
                              "categoryId",
                              categories?.find(
                                (cat) => cat.name.toLowerCase() === "breakfast"
                              )?._id || ""
                            );
                            // Clear dietary tags for Breakfast
                            handleFormChange("dietaryTags", []);
                          } else {
                            // Reset category for Lunch or Dinner
                            handleFormChange("categoryId", "");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                          <SelectItem value="Lunch">Lunch</SelectItem>
                          <SelectItem value="Dinner">Dinner</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.mealType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.mealType}
                        </p>
                      )}
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
                          {categories?.map((category) => {
                            const isBreakfast =
                              category.name.toLowerCase() === "breakfast";

                            const shouldDisable =
                              (formData.mealType === "Breakfast" &&
                                !isBreakfast) || // if meal is breakfast → disable all except breakfast
                              ((formData.mealType === "Lunch" ||
                                formData.mealType === "Dinner") &&
                                isBreakfast); // if meal is lunch/dinner → disable breakfast only

                            return (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                                disabled={shouldDisable}
                              >
                                {category.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      {errors.categoryId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.categoryId}
                        </p>
                      )}

                      {/* Add Category Button */}
                      <Dialog
                        open={isCategoryDialogOpen}
                        onOpenChange={setIsCategoryDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#F87D7D] text-white font-semibold rounded-md hover:bg-[#f96e6e]"
                          >
                            <Plus className="h-4 w-4 font-semibold" /> Add
                            Category
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
                                onChange={(e) => {
                                  handleNewCategoryChange(e.target.value);
                                  validateField("categoryName", e.target.value);
                                }}
                                placeholder="Enter category name"
                              />
                              {errors.categoryName && (
                                <p className="text-red-500 text-xs">
                                  {errors.categoryName}
                                </p>
                              )}
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsCategoryDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleCreateCategory}
                                disabled={
                                  !isCategoryValid ||
                                  newCategoryName.length > 20 ||
                                  createCategoryMutation.isPending
                                }
                              >
                                Create Category
                              </Button>
                            </div>
                            {categoryError && (
                              <p className="text-red-500 text-xs">
                                {categoryError}
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Dietary Tags Selection - Only for Lunch and Dinner */}
                  {(formData.mealType === "Lunch" || formData.mealType === "Dinner") && (
                    <div className="space-y-2">
                      <Label>Dietary Tags * (Multiple Selection Allowed)</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Vegetarian",
                          "Vegan",
                          "Gluten-Free",
                          "Dairy-Free",
                          "Halal",
                          "Kosher",
                          "Kids",
                          "Diabetic",
                        ].map((tag) => {
                          const isSelected = formData.dietaryTags?.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                const currentTags = formData.dietaryTags || [];
                                const newTags = isSelected
                                  ? currentTags.filter((t) => t !== tag)
                                  : [...currentTags, tag];
                                handleFormChange("dietaryTags", newTags);
                                setErrors((prev) => ({ ...prev, dietaryTags: "" }));
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                isSelected
                                  ? "bg-[#F87D7D] text-white shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                      {errors.dietaryTags && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dietaryTags}
                        </p>
                      )}
                    </div>
                  )}
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
                    disabled={createFoodMutation.isPending || !isFormValid}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-between gap-4">
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
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-branches">All Branches</SelectItem>
                    {uniqueBranches.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name}
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
                  <Filter className="h-4 w-4 mr-2" /> Filters
                </Button> */}
              </div>

              {/* Loading State */}
              {foodsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
                  <p className="mt-2"> Loading Food data...</p>
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
                          src={`${API_HOST}${food.images?.[0] || ""}`}
                          alt={food.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
                          <span className="font-medium">{food.mealType}</span>
                        </div>
                        {/* Edit Icon */}
                        {/* <div className="absolute top-2 right-2 bg-white">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(food)}
                            className=""
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div> */}
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <h3 className="font-medium text-sm leading-tight line-clamp-2">
                            {food.name}
                          </h3>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>
                                {food.categoryId?.name || "Unknown Category"}
                              </span>
                            </div>
                            <p>{formatDateWithSuffix(food.createdAt)}</p>
                          </div>

                          {/* Dietary Tags */}
                          {(() => {
                            let tags: string[] = [];
 
                            if (Array.isArray(food.dietaryTags)) {
                              // Flatten nested arrays (handle case where dietaryTags is [[tag1, tag2, tag3]])
                              const flattened = food.dietaryTags.flat();
                              tags = flattened.filter(tag => tag && typeof tag === 'string' && tag.trim());
                            } else if (food.dietaryTags && typeof food.dietaryTags === 'string') {
                              // Handle comma-separated string (runtime check)
                              tags = (food.dietaryTags as string).split(',').map(tag => tag.trim()).filter(tag => tag);
                            }
                            
                            return tags.length > 0 ? (
                              <div className="pt-3 border-t border-gray-200 mt-3">
                                <div className="flex gap-2 flex-wrap">
                                  {tags.map((tag, index) => (
                                    <Badge
                                      key={`${food._id}-${tag}-${index}`}
                                      variant="secondary"
                                      className="text-xs px-3 py-1.5 bg-[#F87D7D]/10 text-[#F87D7D] border border-[#F87D7D]/20 rounded-full w-fit"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ) : null;
                          })()}
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
                      className="bg-[#F87D7D] text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" /> Add First Food
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* logs */}
        <ModuleLogs
          moduleType="MEAL_AND_MEAL_IMAGES"
          title="Meal And Meal Images Activity Logs"
        />

        {/* Edit Modal (Separate Component Logic) */}
        {/* <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Food</DialogTitle>
              <DialogDescription>
                Update the food item with new details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-image">Food Image (optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop new images here, or click to select (replaces
                    existing if selected)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditFileSelect}
                    className="hidden"
                    id="edit-file-input"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("edit-file-input")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" /> Choose File
                  </Button>

                  {(editSelectedFiles.length > 0 ||
                    selectedFood?.images?.[0]) && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Preview
                      </p>
                      <div className="relative w-full max-w-xs h-40 rounded-lg overflow-hidden shadow mx-auto">
                        {editSelectedFiles.length > 0 ? (
                          <img
                            src={URL.createObjectURL(editSelectedFiles[0])}
                            alt="new preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={`http://localhost:5001${
                              selectedFood?.images?.[0] || ""
                            }`}
                            alt="current"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target =
                                e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              const randomFallback =
                                fallbackImages[
                                  Math.floor(
                                    Math.random() * fallbackImages.length
                                  )
                                ];
                              target.src = randomFallback;
                            }}
                          />
                        )}
                        {editSelectedFiles.length > 0 && (
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                            {editSelectedFiles[0].name.length > 15
                              ? editSelectedFiles[0].name.slice(0, 15) + "..."
                              : editSelectedFiles[0].name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Food Name *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) =>
                      handleEditFormChange("name", e.target.value)
                    }
                    placeholder="Enter food name"
                  />
                  {editErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {editErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mealType">Meal Type *</Label>
                  <Select
                    value={editFormData.mealType}
                    onValueChange={(value) =>
                      handleEditFormChange("mealType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                  {editErrors.mealType && (
                    <p className="text-red-500 text-xs mt-1">
                      {editErrors.mealType}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Food Category *</Label>
                <div className="flex gap-2">
                  <Select
                    value={editFormData.categoryId}
                    onValueChange={(value) =>
                      handleEditFormChange("categoryId", value)
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
                  {editErrors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">
                      {editErrors.categoryId}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateFoodMutation.isPending || !hasChanges}
              >
                {updateFoodMutation.isPending ? "Updating..." : "Update Food"}
              </Button>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>
    </DashboardLayout>
  );
}
