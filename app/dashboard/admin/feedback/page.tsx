// Updated FeedbackPage component
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Search,
  Download,
  Star,
  Eye,
  BarChart3,
  Utensils,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFoodFeedbacks } from "@/hooks/useGetFoodFeedback";
import { FeedbackTable } from "@/components/feedback/FeedbackTable";
import { DisplayFeedback } from "@/hooks/useGetFoodFeedback";

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedMeal, setSelectedMeal] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { toast } = useToast();

  const { data, isLoading, error } = useFoodFeedbacks();

  if (isLoading) {
    return <div>Loading feedback data...</div>;
  }

  if (error) {
    return <div>Error loading feedback: {error.message}</div>;
  }

  const transformed: DisplayFeedback[] =
    data?.map((fb: any) => ({
      id: fb._id,
      residentId: fb.guestId.userId.portNumber,
      residentName: fb.guestId.userId?.fullName,
      room: "N/A", // No room data in API
      branch: fb.branchId?.name,
      mealType: "Weekly", // API is weekly feedback, not per meal
      date: new Date(fb.weekStartDate).toISOString().split("T")[0],
      time: "", // No time data
      ratings: {
        taste: 0, // No breakdown in API
        freshness: 0,
        portion: 0,
        temperature: 0,
        overall: fb.overallRating,
      },
      comments: fb.comments,
      staffMember: fb.staffId?.fullName,
      dietary: [], // No dietary data
    })) || [];

  const branches = Array.from(new Set(transformed.map((f) => f.branch)));
  const mealTypes = ["Weekly"]; // Adjusted to match API data

  const filteredFeedback = transformed.filter((feedback) => {
    const matchesSearch =
      feedback.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.residentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comments.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || feedback.branch === selectedBranch;
    const matchesMeal =
      selectedMeal === "all" || feedback.mealType === selectedMeal;
    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "excellent" && feedback.ratings.overall >= 4.5) ||
      (selectedRating === "good" &&
        feedback.ratings.overall >= 3.5 &&
        feedback.ratings.overall < 4.5) ||
      (selectedRating === "fair" &&
        feedback.ratings.overall >= 2.5 &&
        feedback.ratings.overall < 3.5) ||
      (selectedRating === "poor" && feedback.ratings.overall < 2.5);
    const matchesDate = selectedDate === "" || feedback.date === selectedDate;

    return (
      matchesSearch &&
      matchesBranch &&
      matchesMeal &&
      matchesRating &&
      matchesDate
    );
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800";
    if (rating >= 3.5) return "bg-blue-100 text-blue-800";
    if (rating >= 2.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case "Breakfast":
        return "bg-orange-100 text-orange-800";
      case "Lunch":
        return "bg-green-100 text-green-800";
      case "Dinner":
        return "bg-blue-100 text-blue-800";
      case "Weekly":
        return "bg-purple-100 text-purple-800"; // Added for weekly feedback
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (feedbackId: string) => {
    toast({
      title: "View Feedback",
      description: `Opening detailed view for feedback ${feedbackId}`,
    });
  };

  const getStats = () => {
    const totalFeedback = filteredFeedback.length;
    const avgRating =
      filteredFeedback.reduce((sum, f) => sum + f.ratings.overall, 0) /
        totalFeedback || 0;
    const positiveCount = filteredFeedback.filter(
      (f) => f.ratings.overall >= 4
    ).length;
    const negativeCount = filteredFeedback.filter(
      (f) => f.ratings.overall < 3
    ).length;

    return {
      totalFeedback,
      avgRating,
      positiveCount,
      negativeCount,
      positivePercentage: (positiveCount / totalFeedback) * 100 || 0,
      negativePercentage: (negativeCount / totalFeedback) * 100 || 0,
    };
  };

  const stats = getStats();

  const getCategoryAverages = () => {
    const categories = ["taste", "freshness", "portion", "temperature"];
    return categories.map((category) => {
      const avg =
        filteredFeedback.reduce(
          (sum, f) => sum + f.ratings[category as keyof typeof f.ratings],
          0
        ) / filteredFeedback.length || 0;
      return { category, average: avg };
    });
  };

  const categoryAverages = getCategoryAverages();

  return (
    <DashboardLayout
      title="Food Feedback Management"
      description="Monitor meal satisfaction and feedback from residents"
    >
      <div className="space-y-6">
        {/* Feedback Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Feedback Records
            </CardTitle>
            <CardDescription>
              Detailed meal feedback and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or comments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {/* <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full md:w-48"
              /> */}
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
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="excellent">Excellent (4.5+)</SelectItem>
                  <SelectItem value="good">Good (3.5-4.4)</SelectItem>
                  <SelectItem value="fair">Fair (2.5-3.4)</SelectItem>
                  <SelectItem value="poor">Poor (&lt;2.5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FeedbackTable
              filteredFeedback={filteredFeedback}
              getRatingColor={getRatingColor}
              getMealTypeColor={getMealTypeColor}
            />

            {filteredFeedback.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No feedback found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
