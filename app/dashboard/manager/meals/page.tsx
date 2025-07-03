import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Utensils, Search, Download, Clock, Users, TrendingUp, AlertTriangle } from "lucide-react"

export default function ManagerMealsPage() {
  const mealData = [
    {
      id: 1,
      resident: "John Smith",
      room: "204",
      breakfast: { collected: true, time: "08:15 AM", dietary: "Regular" },
      lunch: { collected: false, time: null, dietary: "Regular" },
      dinner: { collected: false, time: null, dietary: "Regular" },
      specialRequirements: "None",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      resident: "Mary Wilson",
      room: "301",
      breakfast: { collected: true, time: "08:30 AM", dietary: "Vegetarian" },
      lunch: { collected: true, time: "12:45 PM", dietary: "Vegetarian" },
      dinner: { collected: false, time: null, dietary: "Vegetarian" },
      specialRequirements: "Vegetarian",
      lastUpdated: "30 minutes ago",
    },
    {
      id: 3,
      resident: "Robert Davis",
      room: "105",
      breakfast: { collected: false, time: null, dietary: "Diabetic" },
      lunch: { collected: false, time: null, dietary: "Diabetic" },
      dinner: { collected: false, time: null, dietary: "Diabetic" },
      specialRequirements: "Diabetic, Low Sodium",
      lastUpdated: "1 hour ago",
    },
    {
      id: 4,
      resident: "Alice Johnson",
      room: "208",
      breakfast: { collected: true, time: "09:00 AM", dietary: "Halal" },
      lunch: { collected: true, time: "01:15 PM", dietary: "Halal" },
      dinner: { collected: false, time: null, dietary: "Halal" },
      specialRequirements: "Halal",
      lastUpdated: "45 minutes ago",
    },
  ]

  const mealStats = {
    breakfast: { total: 28, collected: 24, percentage: 86 },
    lunch: { total: 28, collected: 18, percentage: 64 },
    dinner: { total: 28, collected: 0, percentage: 0 },
  }

  const dietaryBreakdown = [
    { type: "Regular", count: 18, percentage: 64 },
    { type: "Vegetarian", count: 4, percentage: 14 },
    { type: "Diabetic", count: 3, percentage: 11 },
    { type: "Halal", count: 2, percentage: 7 },
    { type: "Other", count: 1, percentage: 4 },
  ]

  const getMealStatus = (meal: any) => {
    if (meal.collected) {
      return <Badge className="bg-green-100 text-green-800">Collected</Badge>
    }
    return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
  }

  const getDietaryColor = (dietary: string) => {
    switch (dietary.toLowerCase()) {
      case "vegetarian":
        return "text-green-600"
      case "diabetic":
        return "text-blue-600"
      case "halal":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: "Meal Marking" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meal Marking</h1>
            <p className="text-muted-foreground">Track meal collection and dietary requirements</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Mark Meals
            </Button>
          </div>
        </div>

        {/* Meal Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Breakfast</h3>
                <Utensils className="h-5 w-5 text-orange-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Collected:</span>
                  <span className="font-medium">
                    {mealStats.breakfast.collected}/{mealStats.breakfast.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${mealStats.breakfast.percentage}%` }}
                  />
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {mealStats.breakfast.percentage}% completion
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Lunch</h3>
                <Utensils className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Collected:</span>
                  <span className="font-medium">
                    {mealStats.lunch.collected}/{mealStats.lunch.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${mealStats.lunch.percentage}%` }} />
                </div>
                <div className="text-right text-sm text-muted-foreground">{mealStats.lunch.percentage}% completion</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Dinner</h3>
                <Utensils className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Collected:</span>
                  <span className="font-medium">
                    {mealStats.dinner.collected}/{mealStats.dinner.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${mealStats.dinner.percentage}%` }} />
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {mealStats.dinner.percentage}% completion
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dietary Requirements Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dietary Requirements</CardTitle>
              <CardDescription>Distribution of special dietary needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dietaryBreakdown.map((diet, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium">{diet.type}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${diet.percentage}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{diet.count}</div>
                      <div className="text-xs text-muted-foreground">{diet.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
              <CardDescription>Overall meal collection statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Total Residents</span>
                  </div>
                  <span className="text-2xl font-bold">28</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Meals Collected</span>
                  </div>
                  <span className="text-2xl font-bold">42</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Missed Meals</span>
                  </div>
                  <span className="text-2xl font-bold">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Avg Collection Time</span>
                  </div>
                  <span className="text-2xl font-bold">2.5m</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meal Tracking Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Meal Collection Tracking
                </CardTitle>
                <CardDescription>Individual resident meal status</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by dietary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dietary Types</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="diabetic">Diabetic</SelectItem>
                    <SelectItem value="halal">Halal</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search residents..." className="pl-10 w-64" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Breakfast</TableHead>
                    <TableHead>Lunch</TableHead>
                    <TableHead>Dinner</TableHead>
                    <TableHead>Dietary Requirements</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealData.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {resident.resident
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{resident.resident}</div>
                            <div className="text-sm text-muted-foreground">Room {resident.room}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getMealStatus(resident.breakfast)}
                          {resident.breakfast.collected && (
                            <div className="text-xs text-muted-foreground">{resident.breakfast.time}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getMealStatus(resident.lunch)}
                          {resident.lunch.collected && (
                            <div className="text-xs text-muted-foreground">{resident.lunch.time}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getMealStatus(resident.dinner)}
                          {resident.dinner.collected && (
                            <div className="text-xs text-muted-foreground">{resident.dinner.time}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getDietaryColor(resident.breakfast.dietary)}`}>
                          {resident.breakfast.dietary}
                        </div>
                        {resident.specialRequirements !== "None" && (
                          <div className="text-xs text-muted-foreground">{resident.specialRequirements}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">{resident.lastUpdated}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
