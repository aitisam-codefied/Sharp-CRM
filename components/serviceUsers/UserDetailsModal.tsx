import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ServiceUser } from "@/lib/types";
import {
  MapPin,
  Phone,
  Mail,
  FileText,
  User,
  Heart,
  Home,
  Stethoscope,
  FileSignature,
  Users as UsersIcon,
} from "lucide-react";

interface UserDetailsModalProps {
  user: ServiceUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({
  user,
  isOpen,
  onOpenChange,
}: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto rounded-lg p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-primary capitalize">
            <User className="h-6 w-6 text-primary" />
            {user.userId?.fullName}'s Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detailed information about the service user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Personal and Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <strong>Full Name:</strong> {user.userId?.fullName || "N/A"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {user.gender || "N/A"}
                </p>
                <p>
                  <strong>Nationality:</strong> {user.nationality || "N/A"}
                </p>
                <p>
                  <strong>Language:</strong> {user.language || "N/A"}
                </p>
                <p>
                  <strong>Number of Dependents:</strong>{" "}
                  {user.numberOfDependents || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user.userId?.emailAddress || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {user.userId?.phoneNumber || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          {/* Location Information */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <span>
                  <strong>Branch:</strong> {user.branch?.name || "N/A"}
                </span>
              </p>
              <p className="">
                <strong>Address:</strong> {user.branch?.address || "N/A"}
              </p>
              <p>
                <strong>Room:</strong> {user.assignedRoom?.roomNumber || "N/A"}{" "}
                ({user.assignedRoom?.type || "N/A"})
              </p>
              <p>
                <strong>Check-in Date:</strong>{" "}
                {user.checkInDate
                  ? new Date(user.checkInDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Room Preference:</strong>{" "}
                {user.roomTypePreference || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Separator className="my-4" />

          {/* Medical Information */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="h-5 w-5 text-primary" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>Medical Conditions:</strong>{" "}
                {user.medicalCondition || "N/A"}
              </p>
              <p>
                <strong>Current Medications:</strong>{" "}
                {user.currentMedications || "N/A"}
              </p>
              <p>
                <strong>Allergies:</strong> {user.allergies || "N/A"}
              </p>
              <p className="flex items-center gap-3">
                <strong>Dietary Requirements:</strong>{" "}
                <div className="flex flex-wrap gap-2">
                  {user.dietaryRequirements?.length > 0 ? (
                    user.dietaryRequirements.map((diet, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {diet}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No dietary requirements
                    </p>
                  )}
                </div>
              </p>
            </CardContent>
          </Card>

          <Separator className="my-4" />

          {/* Support Services and Emergency Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-primary" />
                  Support Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.supportServices?.length > 0 ? (
                    user.supportServices.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {service}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No support services assigned
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UsersIcon className="h-5 w-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.emergencyContacts?.length > 0 ? (
                  user.emergencyContacts.map((contact, index) => (
                    <div key={index} className="text-sm mb-3 last:mb-0">
                      <p>
                        <strong>Name:</strong> {contact.fullName}
                      </p>
                      <p>
                        <strong>Relationship:</strong> {contact.relationship}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {contact.phoneNumber}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No emergency contacts provided
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          {/* Documents and Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.documents?.length > 0 ? (
                  user.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="text-sm mb-3 last:mb-0 flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {doc.type}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No documents uploaded
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileSignature className="h-5 w-5 text-primary" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <strong>Additional Notes:</strong>{" "}
                  {user.additionalNotes || "N/A"}
                </p>
                <p>
                  <strong>Signature:</strong> {user.signature || "N/A"}
                </p>
                <p>
                  <strong>Priority Level:</strong>{" "}
                  <Badge
                    className={getStatusColor(user.priorityLevel || "Unknown")}
                  >
                    {user.priorityLevel || "Unknown"}
                  </Badge>
                </p>
                <p>
                  <strong>Consent - Accuracy:</strong>{" "}
                  {user.consentAccuracy ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Consent - Data Processing:</strong>{" "}
                  {user.consentDataProcessing ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Consent - Data Retention:</strong>{" "}
                  {user.consentDataRetention ? "Yes" : "No"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Dental Information */}
          {user.dental && (
            <>
              <Separator className="my-4" />
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Dental Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>Clinic Name:</strong> {user.dental.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.dental.emailAddress || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {user.dental.phoneNumber || "N/A"}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to reuse status color logic
function getStatusColor(status: string) {
  switch (status) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
