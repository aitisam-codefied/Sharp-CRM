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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedMeal, setSelectedMeal] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { toast } = useToast();

  const feedbackData = [
    {
      id: "FB001",
      residentId: "SMS-USER-1001",
      residentName: "John Smith",
      room: "204A",
      branch: "Manchester",
      mealType: "Breakfast",
      date: "2024-01-15",
      time: "09:00",
      ratings: {
        taste: 4,
        freshness: 5,
        portion: 4,
        temperature: 4,
        overall: 4.2,
      },
      comments: "Good breakfast, enjoyed the variety of options available.",
      staffMember: "Sarah Johnson",
      dietary: ["Halal"],
    },
    {
      id: "FB002",
      residentId: "SMS-USER-1002",
      residentName: "Ahmed Hassan",
      room: "205B",
      branch: "Manchester",
      mealType: "Lunch",
      date: "2024-01-15",
      time: "13:00",
      ratings: {
        taste: 3,
        freshness: 3,
        portion: 4,
        temperature: 2,
        overall: 3.0,
      },
      comments:
        "Food was cold when served, taste was okay but could be better.",
      staffMember: "Ahmed Hassan",
      dietary: ["Vegetarian"],
    },
    {
      id: "FB003",
      residentId: "SMS-USER-1003",
      residentName: "Maria Garcia",
      room: "206A",
      branch: "Birmingham",
      mealType: "Dinner",
      date: "2024-01-15",
      time: "19:30",
      ratings: {
        taste: 5,
        freshness: 5,
        portion: 5,
        temperature: 5,
        overall: 5.0,
      },
      comments:
        "Excellent dinner! The curry was perfectly spiced and very fresh.",
      staffMember: "Emma Wilson",
      dietary: [],
    },
    {
      id: "FB004",
      residentId: "SMS-USER-1004",
      residentName: "David Wilson",
      room: "207B",
      branch: "Liverpool",
      mealType: "Breakfast",
      date: "2024-01-15",
      time: "08:30",
      ratings: {
        taste: 2,
        freshness: 3,
        portion: 3,
        temperature: 3,
        overall: 2.8,
      },
      comments: "Breakfast was not very tasty, needs improvement in seasoning.",
      staffMember: "Lisa Chen",
      dietary: ["Gluten Free"],
    },
  ];

  const branches = [
    "Manchester",
    "Birmingham",
    "London Central",
    "Liverpool",
    "Leeds",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  const filteredFeedback = feedbackData.filter((feedback) => {
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

    return matchesSearch && matchesBranch && matchesMeal && matchesRating;
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Meal Details</TableHead>

                    <TableHead>Overall</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead className="">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {feedback.residentName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {feedback.branch} • Room {feedback.room}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            className={getMealTypeColor(feedback.mealType)}
                          >
                            {feedback.mealType}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {feedback.date} at {feedback.time}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span
                            className={`font-bold ${getRatingColor(
                              feedback.ratings.overall
                            )}`}
                          >
                            {feedback.ratings.overall.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm line-clamp-2 max-w-xs">
                          {feedback.comments}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {feedback.staffMember}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

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
