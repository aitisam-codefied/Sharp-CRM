// components/meals/MealsStats.jsx (Separate stats component)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Utensils,
} from "lucide-react";

const getMealStats = (residents: any) => {
  const totalResidents = residents.length;
  const breakfastMarked = residents.filter(
    (r: any) => r.meals.breakfast.marked
  ).length;
  const lunchMarked = residents.filter((r: any) => r.meals.lunch.marked).length;
  const dinnerMarked = residents.filter(
    (r: any) => r.meals.dinner.marked
  ).length;

  return {
    breakfast: {
      marked: breakfastMarked,
      total: totalResidents,
      percentage:
        totalResidents > 0 ? (breakfastMarked / totalResidents) * 100 : 0,
    },
    lunch: {
      marked: lunchMarked,
      total: totalResidents,
      percentage: totalResidents > 0 ? (lunchMarked / totalResidents) * 100 : 0,
    },
    dinner: {
      marked: dinnerMarked,
      total: totalResidents,
      percentage:
        totalResidents > 0 ? (dinnerMarked / totalResidents) * 100 : 0,
    },
    totalMarked: breakfastMarked + lunchMarked + dinnerMarked,
    totalPossible: totalResidents * 3,
  };
};

export default function MealsStats({ residents }: any) {
  const stats = getMealStats(residents);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Breakfast</CardTitle>
          <Utensils className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.breakfast.marked}/{stats.breakfast.total}
          </div>
          <Progress value={stats.breakfast.percentage} className="mt-2" />
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
            {Math.round(stats.breakfast.percentage)}% completed
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lunch</CardTitle>
          <Utensils className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.lunch.marked}/{stats.lunch.total}
          </div>
          <Progress value={stats.lunch.percentage} className="mt-2" />
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Clock className="mr-1 h-3 w-3 text-orange-500" />
            {Math.round(stats.lunch.percentage)}% completed
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dinner</CardTitle>
          <Utensils className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.dinner.marked}/{stats.dinner.total}
          </div>
          <Progress value={stats.dinner.percentage} className="mt-2" />
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <AlertCircle className="mr-1 h-3 w-3 text-gray-500" />
            {Math.round(stats.dinner.percentage)}% completed
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalMarked}/{stats.totalPossible}
          </div>
          <Progress
            value={(stats.totalMarked / stats.totalPossible) * 100}
            className="mt-2"
          />
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Users className="mr-1 h-3 w-3" />
            {Math.round((stats.totalMarked / stats.totalPossible) * 100)}%
            overall
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
