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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Upload, Camera, Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewUserPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { toast } = useToast();

  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Basic personal details",
    },
    {
      id: 2,
      title: "Contact & Emergency",
      description: "Contact information and emergency contacts",
    },
    {
      id: 3,
      title: "Medical & Dietary",
      description: "Health and dietary requirements",
    },
    {
      id: 4,
      title: "Support & Services",
      description: "Support needs and services required",
    },
    { id: 5, title: "Documentation", description: "Upload required documents" },
    { id: 6, title: "Room Assignment", description: "Assign accommodation" },
    {
      id: 7,
      title: "Review & Submit",
      description: "Final review and submission",
    },
  ];

  const branches = [
    "Manchester",
    "Birmingham",
    "London Central",
    "Liverpool",
    "Leeds",
  ];
  const nationalities = [
    "Syrian",
    "Afghan",
    "Venezuelan",
    "Eritrean",
    "Iraqi",
    "Iranian",
    "Sudanese",
    "Other",
  ];
  const languages = [
    "Arabic",
    "English",
    "Dari",
    "Pashto",
    "Spanish",
    "Tigrinya",
    "Kurdish",
    "Farsi",
  ];
  const supportServices = [
    "Legal Advice",
    "Medical Support",
    "Mental Health Support",
    "Language Classes",
    "Job Training",
    "Education",
    "Housing Support",
    "Benefits Advice",
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Registration Complete",
      description:
        "New service user has been successfully registered and assigned accommodation.",
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo</Label>

                <label
                  htmlFor="photo-upload"
                  className="relative w-32 h-32 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer"
                >
                  <Camera className="h-6 w-6 text-gray-400" />
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                          const imageElement = document.getElementById(
                            "preview-img"
                          ) as HTMLImageElement;
                          if (imageElement && event.target?.result) {
                            imageElement.src = event.target.result as string;
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <img
                    id="preview-img"
                    // alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                  />
                </label>

                <p className="text-sm text-gray-500">Click to upload photo</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input id="dob" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <RadioGroup defaultValue="male" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {nationalities.map((nationality) => (
                      <SelectItem
                        key={nationality}
                        value={nationality.toLowerCase()}
                      >
                        {nationality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+44 7700 900000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="user@temp.com" />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emergency Contact 1 *</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ec1Name">Full Name</Label>
                  <Input id="ec1Name" placeholder="Emergency contact name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ec1Relationship">Relationship</Label>
                  <Input
                    id="ec1Relationship"
                    placeholder="e.g., Brother, Friend"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ec1Phone">Phone Number</Label>
                  <Input id="ec1Phone" placeholder="+44 7700 900000" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Emergency Contact 2 (Optional)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ec2Name">Full Name</Label>
                  <Input id="ec2Name" placeholder="Emergency contact name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ec2Relationship">Relationship</Label>
                  <Input
                    id="ec2Relationship"
                    placeholder="e.g., Sister, Cousin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ec2Phone">Phone Number</Label>
                  <Input id="ec2Phone" placeholder="+44 7700 900000" />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medical Information</h3>
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  placeholder="List any medical conditions, medications, or health concerns..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  placeholder="List any known allergies..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="List current medications and dosages..."
                  rows={3}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dietary Requirements</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dietary Preferences</Label>
                  <div className="space-y-2">
                    {[
                      "Halal",
                      "Vegetarian",
                      "Vegan",
                      "No Pork",
                      "No Beef",
                      "Kosher",
                      "Gluten Free",
                      "Dairy Free",
                    ].map((diet) => (
                      <div key={diet} className="flex items-center space-x-2">
                        <Checkbox id={diet} />
                        <Label htmlFor={diet} className="text-sm">
                          {diet}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalDietary">
                    Additional Dietary Notes
                  </Label>
                  <Textarea
                    id="additionalDietary"
                    placeholder="Any additional dietary requirements or restrictions..."
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Support Services Required</h3>
              <div className="grid grid-cols-2 gap-4">
                {supportServices.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox id={service} />
                    <Label htmlFor={service} className="text-sm">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Case Worker Assignment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseWorker">Assign Case Worker</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case worker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="emma">Emma Wilson</SelectItem>
                      <SelectItem value="david">David Brown</SelectItem>
                      <SelectItem value="lisa">Lisa Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Support Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional information about support needs..."
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Required Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Passport/ID Document",
                  "Birth Certificate",
                  "Medical Records",
                  "Asylum Application",
                  "Educational Certificates",
                  "Previous Address Proof",
                  "Bank Statements",
                  "Other Documents",
                ].map((doc) => (
                  <div key={doc} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">{doc}</Label>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <Input type="file" className="hidden" multiple />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Room Assignment</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch.toLowerCase()}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type Preference</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Room</SelectItem>
                      <SelectItem value="shared">Shared Room</SelectItem>
                      <SelectItem value="family">Family Room</SelectItem>
                      <SelectItem value="accessible">
                        Accessible Room
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor Preference</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground">Ground Floor</SelectItem>
                      <SelectItem value="1">1st Floor</SelectItem>
                      <SelectItem value="2">2nd Floor</SelectItem>
                      <SelectItem value="3">3rd Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Rooms</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    room: "204A",
                    type: "Single",
                    floor: "2nd",
                    facilities: ["Private Bathroom", "WiFi", "Heating"],
                  },
                  {
                    room: "301B",
                    type: "Single",
                    floor: "3rd",
                    facilities: ["Private Bathroom", "WiFi", "Kitchenette"],
                  },
                  {
                    room: "105C",
                    type: "Shared",
                    floor: "1st",
                    facilities: ["Shared Bathroom", "WiFi", "Heating"],
                  },
                ].map((room) => (
                  <div
                    key={room.room}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Room {room.room}</h4>
                      <Badge>{room.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {room.floor} Floor
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {room.facilities.map((facility) => (
                        <Badge
                          key={facility}
                          variant="outline"
                          className="text-xs"
                        >
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Registration Summary</h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Full Name
                    </Label>
                    <p className="font-medium">John Smith</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Date of Birth
                    </Label>
                    <p className="font-medium">15/03/1985</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Nationality
                    </Label>
                    <p className="font-medium">Syrian</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Assigned Room
                    </Label>
                    <p className="font-medium">204A - Manchester</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Case Worker
                    </Label>
                    <p className="font-medium">Sarah Johnson</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Registration Date
                    </Label>
                    <p className="font-medium">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I confirm that all information provided is accurate and
                  complete
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="consent" />
                <Label htmlFor="consent" className="text-sm">
                  I have obtained consent for data processing and storage
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="New Service User Registration"
      description="Complete registration process for new service users"
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Registration Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-8 overflow-x-auto px-2">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    {/* Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium transition-all ${
                          isActive
                            ? "bg-red-400 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isActive ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          String(step.id).padStart(2, "0")
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 text-center whitespace-nowrap ${
                          isActive
                            ? "text-red-400 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>

                    {/* Line between steps */}
                    {index < steps.length - 1 && (
                      <div className="w-10 h-0.5 bg-gray-300 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Complete Registration
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
