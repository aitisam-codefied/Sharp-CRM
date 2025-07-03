"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Utensils, Search, QrCode, CheckCircle, Clock, AlertCircle, Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MealMarkingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMealType, setSelectedMealType] = useState("all")
  const { toast } = useToast()

  const residents = [
    {
      id: "SMS-USER-1001",
      name: "John Smith",
      room: "204A",
      meals: {
        breakfast: { marked: true, time: "08:30" },
        lunch: { marked: false, time: null },
        dinner: { marked: false, time: null },
      },
      dietary: ["Halal", "No Nuts"],
    },
    {
      id: "SMS-USER-1002",
      name: "Ahmed Hassan",
      room: "205B",
      meals: {
        breakfast: { marked: true, time: "08:15" },
        lunch: { marked: true, time: "12:45" },
        dinner: { marked: false, time: null },
      },
      dietary: ["Vegetarian"],
    },
    {
      id: "SMS-USER-1003",
      name: "Maria Garcia",
      room: "206A",
      meals: {
        breakfast: { marked: false, time: null },
        lunch: { marked: false, time: null },
        dinner: { marked: false, time: null },
      },
      dietary: [],
    },
    {
      id: "SMS-USER-1004",
      name: "David Wilson",
      room: "207B",
      meals: {
        breakfast: { marked: true, time: "09:00" },
        lunch: { marked: false, time: null },
        dinner: { marked: false, time: null },
      },
      dietary: ["Gluten Free"],
    },
  ]

  const handleMealToggle = (userId: string, mealType: string, checked: boolean) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    toast({
      title: checked ? "Meal Marked" : "Meal Unmarked",
      description: `${mealType} ${checked ? "marked" : "unmarked"} for ${residents.find((r) => r.id === userId)?.name}`,
    })
  }

  const getMealStats = () => {
    const totalResidents = residents.length
    const breakfastMarked = residents.filter((r) => r.meals.breakfast.marked).length
    const lunchMarked = residents.filter((r) => r.meals.lunch.marked).length
    const dinnerMarked = residents.filter((r) => r.meals.dinner.marked).length

    return {
      breakfast: { marked: breakfastMarked, total: totalResidents },
      lunch: { marked: lunchMarked, total: totalResidents },
      dinner: { marked: dinnerMarked, total: totalResidents },
    }
  }

  const stats = getMealStats()

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout breadcrumbs={[{ label: "Staff Dashboard", href: "/dashboard/staff" }, { label: "Meal Marking" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meal Marking</h1>
            <p className="text-muted-foreground">Track meal attendance for all residents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <QrCode className="h-4 w-4 mr-2" />
              QR Scanner
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Meal Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Breakfast</CardTitle>
              <Utensils className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.breakfast.marked}/{stats.breakfast.total}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                {Math.round((stats.breakfast.marked / stats.breakfast.total) * 100)}% completed
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
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3 text-orange-500" />
                {Math.round((stats.lunch.marked / stats.lunch.total) * 100)}% completed
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
              <div className="flex items-center text-xs text-muted-foreground">
                <AlertCircle className="mr-1 h-3 w-3 text-gray-500" />
                {Math.round((stats.dinner.marked / stats.dinner.total) * 100)}% completed
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Resident Meal Tracking</CardTitle>
            <CardDescription>Mark meal attendance for each resident</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
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
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Residents List */}
            <div className="space-y-4">
              {filteredResidents.map((resident) => (
                <Card key={resident.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{resident.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Room {resident.room}</span>
                          <span>•</span>
                          <span>{resident.id}</span>
                        </div>
                        {resident.dietary.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {resident.dietary.map((diet) => (
                              <Badge key={diet} variant="outline" className="text-xs">
                                {diet}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Breakfast */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${resident.id}-breakfast`}
                          checked={resident.meals.breakfast.marked}
                          onCheckedChange={(checked) => handleMealToggle(resident.id, "breakfast", checked as boolean)}
                        />
                        <label htmlFor={`${resident.id}-breakfast`} className="text-sm font-medium cursor-pointer">
                          Breakfast
                        </label>
                        {resident.meals.breakfast.marked && (
                          <Badge variant="outline" className="text-xs">
                            {resident.meals.breakfast.time}
                          </Badge>
                        )}
                      </div>

                      {/* Lunch */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${resident.id}-lunch`}
                          checked={resident.meals.lunch.marked}
                          onCheckedChange={(checked) => handleMealToggle(resident.id, "lunch", checked as boolean)}
                        />
                        <label htmlFor={`${resident.id}-lunch`} className="text-sm font-medium cursor-pointer">
                          Lunch
                        </label>
                        {resident.meals.lunch.marked && (
                          <Badge variant="outline" className="text-xs">
                            {resident.meals.lunch.time}
                          </Badge>
                        )}
                      </div>

                      {/* Dinner */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${resident.id}-dinner`}
                          checked={resident.meals.dinner.marked}
                          onCheckedChange={(checked) => handleMealToggle(resident.id, "dinner", checked as boolean)}
                        />
                        <label htmlFor={`${resident.id}-dinner`} className="text-sm font-medium cursor-pointer">
                          Dinner
                        </label>
                        {resident.meals.dinner.marked && (
                          <Badge variant="outline" className="text-xs">
                            {resident.meals.dinner.time}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
