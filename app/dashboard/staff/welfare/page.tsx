"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Search, QrCode, AlertTriangle, CheckCircle, Clock, User, Camera, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WelfareCheckPage() {
  const [selectedResident, setSelectedResident] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [welfareForm, setWelfareForm] = useState({
    physicalHealth: "",
    mentalState: "",
    socialInteraction: "",
    covidSymptoms: false,
    isolationRequired: false,
    criticalFlag: false,
    notes: "",
    followUpRequired: false,
  })
  const { toast } = useToast()

  const residents = [
    {
      id: "SMS-USER-1001",
      name: "John Smith",
      room: "204A",
      lastWelfareCheck: "2024-01-15 09:30",
      status: "normal",
      flags: [],
    },
    {
      id: "SMS-USER-1002",
      name: "Ahmed Hassan",
      room: "205B",
      lastWelfareCheck: "2024-01-14 14:20",
      status: "attention",
      flags: ["Follow-up required"],
    },
    {
      id: "SMS-USER-1003",
      name: "Maria Garcia",
      room: "206A",
      lastWelfareCheck: "2024-01-13 11:15",
      status: "critical",
      flags: ["Mental health concern", "Isolation"],
    },
    {
      id: "SMS-USER-1004",
      name: "David Wilson",
      room: "207B",
      lastWelfareCheck: "2024-01-15 16:45",
      status: "normal",
      flags: [],
    },
  ]

  const handleWelfareSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedResident) {
      toast({
        title: "Error",
        description: "Please select a resident first",
        variant: "destructive",
      })
      return
    }

    const resident = residents.find((r) => r.id === selectedResident)

    toast({
      title: "Welfare Check Submitted",
      description: `Welfare check completed for ${resident?.name}`,
    })

    // Reset form
    setWelfareForm({
      physicalHealth: "",
      mentalState: "",
      socialInteraction: "",
      covidSymptoms: false,
      isolationRequired: false,
      criticalFlag: false,
      notes: "",
      followUpRequired: false,
    })
    setSelectedResident(null)
  }

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive"
      case "attention":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "attention":
        return <Clock className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Staff Dashboard", href: "/dashboard/staff" }, { label: "Welfare Checks" }]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welfare Checks</h1>
            <p className="text-muted-foreground">Conduct and track resident welfare assessments</p>
          </div>
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            QR Scanner
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Resident Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Resident
              </CardTitle>
              <CardDescription>Choose a resident to conduct welfare check</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search residents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredResidents.map((resident) => (
                    <div
                      key={resident.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedResident === resident.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedResident(resident.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{resident.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Room {resident.room}</span>
                            <span>•</span>
                            <span>{resident.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Last check: {resident.lastWelfareCheck}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={getStatusColor(resident.status)} className="flex items-center gap-1">
                            {getStatusIcon(resident.status)}
                            {resident.status}
                          </Badge>
                          {resident.flags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {resident.flags.map((flag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Welfare Check Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Welfare Assessment
              </CardTitle>
              <CardDescription>Complete welfare check for selected resident</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedResident ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Select a resident to begin welfare check</p>
                </div>
              ) : (
                <form onSubmit={handleWelfareSubmit} className="space-y-6">
                  {/* Selected Resident Info */}
                  <Alert>
                    <User className="h-4 w-4" />
                    <AlertDescription>
                      Conducting welfare check for:{" "}
                      <strong>{residents.find((r) => r.id === selectedResident)?.name}</strong>
                    </AlertDescription>
                  </Alert>

                  {/* Physical Health */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Physical Health</Label>
                    <RadioGroup
                      value={welfareForm.physicalHealth}
                      onValueChange={(value) => setWelfareForm((prev) => ({ ...prev, physicalHealth: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id="physical-excellent" />
                        <Label htmlFor="physical-excellent">Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="physical-good" />
                        <Label htmlFor="physical-good">Good</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id="physical-fair" />
                        <Label htmlFor="physical-fair">Fair</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id="physical-poor" />
                        <Label htmlFor="physical-poor">Poor</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Mental State */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Mental State</Label>
                    <RadioGroup
                      value={welfareForm.mentalState}
                      onValueChange={(value) => setWelfareForm((prev) => ({ ...prev, mentalState: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="positive" id="mental-positive" />
                        <Label htmlFor="mental-positive">Positive</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stable" id="mental-stable" />
                        <Label htmlFor="mental-stable">Stable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="anxious" id="mental-anxious" />
                        <Label htmlFor="mental-anxious">Anxious</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="distressed" id="mental-distressed" />
                        <Label htmlFor="mental-distressed">Distressed</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Social Interaction */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Social Interaction</Label>
                    <RadioGroup
                      value={welfareForm.socialInteraction}
                      onValueChange={(value) => setWelfareForm((prev) => ({ ...prev, socialInteraction: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="engaging" id="social-engaging" />
                        <Label htmlFor="social-engaging">Engaging well</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="limited" id="social-limited" />
                        <Label htmlFor="social-limited">Limited interaction</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="withdrawn" id="social-withdrawn" />
                        <Label htmlFor="social-withdrawn">Withdrawn</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="isolated" id="social-isolated" />
                        <Label htmlFor="social-isolated">Self-isolating</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Health Flags */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Health Indicators</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="covid-symptoms"
                          checked={welfareForm.covidSymptoms}
                          onCheckedChange={(checked) =>
                            setWelfareForm((prev) => ({ ...prev, covidSymptoms: checked as boolean }))
                          }
                        />
                        <Label htmlFor="covid-symptoms">COVID-19 symptoms present</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isolation-required"
                          checked={welfareForm.isolationRequired}
                          onCheckedChange={(checked) =>
                            setWelfareForm((prev) => ({ ...prev, isolationRequired: checked as boolean }))
                          }
                        />
                        <Label htmlFor="isolation-required">Isolation required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="follow-up"
                          checked={welfareForm.followUpRequired}
                          onCheckedChange={(checked) =>
                            setWelfareForm((prev) => ({ ...prev, followUpRequired: checked as boolean }))
                          }
                        />
                        <Label htmlFor="follow-up">Follow-up required</Label>
                      </div>
                    </div>
                  </div>

                  {/* Critical Flag */}
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="critical-flag"
                        checked={welfareForm.criticalFlag}
                        onCheckedChange={(checked) =>
                          setWelfareForm((prev) => ({ ...prev, criticalFlag: checked as boolean }))
                        }
                      />
                      <Label htmlFor="critical-flag" className="font-medium text-red-800">
                        Flag as Critical - Requires Immediate Attention
                      </Label>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      Check this box if the resident requires urgent intervention
                    </p>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any additional observations or concerns..."
                      value={welfareForm.notes}
                      onChange={(e) => setWelfareForm((prev) => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Welfare Check
                    </Button>
                    <Button type="button" variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Add Photo
                    </Button>
                    <Button type="button" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Attach Document
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
