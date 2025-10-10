// Updated FeedbackPage component
"use client";

import { useEffect, useState } from "react";
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
import { useBranches } from "@/hooks/useGetBranches";

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedMeal, setSelectedMeal] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const { toast } = useToast();

  const { data: feedback, isLoading, error } = useFoodFeedbacks();

  useEffect(() => {
    console.log("feedback data", feedback);
  });

  const { data: branchData } = useBranches();

  if (error) {
    return <div>Error loading feedback: {error.message}</div>;
  }

  // useEffect(() => {
  //   console.log("branch data", branchData);
  // });

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

  const filteredFeedback = feedback?.filter((feedback: any) => {
    const matchesSearch = feedback?.guestId?.userId?.fullName
      ?.toLowerCase()
      .includes(searchTerm?.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || feedback?.branchId?._id === selectedBranch;

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "excellent" &&
        feedback?.details[feedback?.details.length - 1]?.overallRating >=
          4.5) ||
      (selectedRating === "good" &&
        feedback?.details[feedback?.details.length - 1]?.overallRating >= 3.5 &&
        feedback?.details[feedback?.details.length - 1]?.overallRating < 4.5) ||
      (selectedRating === "fair" &&
        feedback?.details[feedback?.details.length - 1]?.overallRating >= 2.5 &&
        feedback?.details[feedback?.details.length - 1]?.overallRating < 3.5) ||
      (selectedRating === "poor" &&
        feedback?.details[feedback?.details.length - 1]?.overallRating < 2.5);
    const matchesDate =
      selectedDate === "" ||
      feedback?.details[feedback?.details.length - 1]?.weekStartDate ===
        selectedDate;

    return matchesSearch && matchesBranch && matchesRating && matchesDate;
  });

  // useEffect(() => {
  //   console.log("filtered feedback", filteredFeedback);
  // });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-yellow-600";
    return "text-red-600";
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

  return (
    <DashboardLayout
      title="Food Feedback Management"
      description="Monitor meal satisfaction and feedback from residents"
    >
      <div className="space-y-6">
        {/* Feedback Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Utensils className="h-5 w-5" />
              Feedback Records
            </CardTitle>
            <CardDescription className="text-sm">
              Detailed meal feedback and ratings
            </CardDescription>
          </CardHeader>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
              <p className="mt-2"> Loading feedbacks...</p>
            </div>
          ) : (
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
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
                <Input
                  type="date"
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
                    <SelectItem value="all">All Branches</SelectItem>
                    {allBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        <div className="flex items-center gap-2">
                          <span>{branch.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedRating}
                  onValueChange={setSelectedRating}
                >
                  <SelectTrigger className="w-full">
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
                filteredFeedback={filteredFeedback ?? []}
                getRatingColor={getRatingColor}
                getMealTypeColor={getMealTypeColor}
              />

              {filteredFeedback?.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No feedback found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
