"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Utensils,
  Search,
  QrCode,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Users,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MealsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedMeal, setSelectedMeal] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const { toast } = useToast()

  const residents = [
    {
      id: "SMS-USER-1001",
      name: "John Smith",
      room: "204A",
      branch: "Manchester",
      meals: {
        breakfast: { marked: true, time: "08:30", staff: "Sarah J." },
        lunch: { marked: false, time: null, staff: null },
        dinner: { marked: false, time: null, staff: null },
      },
      dietary: ["Halal", "No Nuts"],
      lastMeal: "Breakfast",
    },
    {
      id: "SMS-USER-1002",
      name: "Ahmed Hassan",
      room: "205B",
      branch: "Manchester",
      meals: {
        breakfast: { marked: true, time: "08:15", staff: "Ahmed H." },
        lunch: { marked: true, time: "12:45", staff: "Emma W." },
        dinner: { marked: false, time: null, staff: null },
      },
      dietary: ["Vegetarian"],
      lastMeal: "Lunch",
    },
    {
      id: "SMS-USER-1003",
      name: "Maria Garcia",
      room: "206A",
      branch: "Birmingham",
      meals: {
        breakfast: { marked: false, time: null, staff: null },
        lunch: { marked: false, time: null, staff: null },
        dinner: { marked: false, time: null, staff: null },
      },
      dietary: [],
      lastMeal: "None",
    },
    {
      id: "SMS-USER-1004",
      name: "David Wilson",
      room: "207B",
      branch: "Liverpool",
      meals: {
        breakfast: { marked: true, time: "09:00", staff: "Lisa C." },
        lunch: { marked: false, time: null, staff: null },
        dinner: { marked: false, time: null, staff: null },
      },
      dietary: ["Gluten Free"],
      lastMeal: "Breakfast",
    },
  ]

  const branches = ["Manchester", "Birmingham", "London Central", "Liverpool", "Leeds"]

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = selectedBranch === "all" || resident.branch === selectedBranch

    return matchesSearch && matchesBranch
  })

  const handleMealToggle = (userId: string, mealType: string, checked: boolean) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const resident = residents.find((r) => r.id === userId)

    toast({
      title: checked ? "Meal Marked" : "Meal Unmarked",
      description: `${mealType} ${checked ? "marked" : "unmarked"} for ${resident?.name}`,
    })
  }

  const getMealStats = () => {
    const totalResidents = filteredResidents.length
    const breakfastMarked = filteredResidents.filter((r) => r.meals.breakfast.marked).length
    const lunchMarked = filteredResidents.filter((r) => r.meals.lunch.marked).length
    const dinnerMarked = filteredResidents.filter((r) => r.meals.dinner.marked).length

    return {
      breakfast: {
        marked: breakfastMarked,
        total: totalResidents,
        percentage: (breakfastMarked / totalResidents) * 100,
      },
      lunch: { marked: lunchMarked, total: totalResidents, percentage: (lunchMarked / totalResidents) * 100 },
      dinner: { marked: dinnerMarked, total: totalResidents, percentage: (dinnerMarked / totalResidents) * 100 },
      totalMarked: breakfastMarked + lunchMarked + dinnerMarked,
      totalPossible: totalResidents * 3,
    }
  }

  const stats = getMealStats()

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "Meal Marking" }]}
      title="Meal Tracking System"
      description="Track meal attendance and dietary requirements across all branches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            QR Scanner
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Meal Statistics */}
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
              <Progress value={(stats.totalMarked / stats.totalPossible) * 100} className="mt-2" />
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Users className="mr-1 h-3 w-3" />
                {Math.round((stats.totalMarked / stats.totalPossible) * 100)}% overall
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Meal Attendance Tracking
            </CardTitle>
            <CardDescription>Mark meal attendance for residents across all branches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, room, or ID..."
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
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Residents Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Branch & Room</TableHead>
                    <TableHead>Dietary Requirements</TableHead>
                    <TableHead>Breakfast</TableHead>
                    <TableHead>Lunch</TableHead>
                    <TableHead>Dinner</TableHead>
                    <TableHead>Last Meal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResidents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{resident.name}</div>
                          <div className="text-sm text-muted-foreground">{resident.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{resident.branch}</div>
                          <div className="text-sm text-muted-foreground">Room {resident.room}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {resident.dietary.length > 0 ? (
                            resident.dietary.map((diet) => (
                              <Badge key={diet} variant="outline" className="text-xs">
                                {diet}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${resident.id}-breakfast`}
                            checked={resident.meals.breakfast.marked}
                            onCheckedChange={(checked) =>
                              handleMealToggle(resident.id, "breakfast", checked as boolean)
                            }
                          />
                          {resident.meals.breakfast.marked && (
                            <div className="text-xs text-muted-foreground">
                              <div>{resident.meals.breakfast.time}</div>
                              <div>{resident.meals.breakfast.staff}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${resident.id}-lunch`}
                            checked={resident.meals.lunch.marked}
                            onCheckedChange={(checked) => handleMealToggle(resident.id, "lunch", checked as boolean)}
                          />
                          {resident.meals.lunch.marked && (
                            <div className="text-xs text-muted-foreground">
                              <div>{resident.meals.lunch.time}</div>
                              <div>{resident.meals.lunch.staff}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${resident.id}-dinner`}
                            checked={resident.meals.dinner.marked}
                            onCheckedChange={(checked) => handleMealToggle(resident.id, "dinner", checked as boolean)}
                          />
                          {resident.meals.dinner.marked && (
                            <div className="text-xs text-muted-foreground">
                              <div>{resident.meals.dinner.time}</div>
                              <div>{resident.meals.dinner.staff}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {resident.lastMeal}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredResidents.length === 0 && (
              <div className="text-center py-8">
                <Utensils className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No residents found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
