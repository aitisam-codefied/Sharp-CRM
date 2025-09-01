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
            {user.userId?.fullName || "N/A"}'s Profile
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
                <p>
                  <strong>Address:</strong> {user.address || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          {/* Room Information */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-5 w-5 text-primary" />
                Room Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {user.familyRooms?.length > 0 ? (
                user.familyRooms.map((room, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <p>
                      <strong>Room Number:</strong>{" "}
                      {room.roomId?.roomNumber || "N/A"}
                    </p>
                    <p>
                      <strong>Room Type:</strong> {room.roomId?.type || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No room information available
                </p>
              )}
              <p>
                <strong>Is Primary Guest:</strong>{" "}
                {user.isPrimaryGuest ? "Yes" : "No"}
              </p>
              <p>
                <strong>Family ID:</strong> {user.familyId || "N/A"}
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
              <p>
                <strong>Medic ID:</strong> {user.medic || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Separator className="my-4" />

          {/* Case Worker and Emergency Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-primary" />
                  Case Worker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <strong>Name:</strong> {user.caseWorker?.fullName || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {user.caseWorker?.phoneNumber || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user.caseWorker?.emailAddress || "N/A"}
                </p>
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
                    <div
                      key={index}
                      className="text-sm mb-3 flex flex-col gap-2 last:mb-0"
                    >
                      <p>
                        <strong>Name:</strong> {contact.fullName || "N/A"}
                      </p>
                      <p>
                        <strong>Relationship:</strong>{" "}
                        {contact.relationship || "N/A"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {contact.phoneNumber || "N/A"}
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
                <p className="text-sm">
                  <strong>Occupancy Agreement:</strong>{" "}
                  {user.occupancyAgreementUrl ? (
                    <a
                      href={user.occupancyAgreementUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Agreement
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p className="text-sm mt-3">
                  <strong>Signature:</strong>{" "}
                  {user.signatureUrl ? (
                    <a
                      href={user.signatureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Signature
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
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
                  <strong>Consent - Accuracy:</strong>{" "}
                  {user.consentAccuracy ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Consent - Data Processing:</strong>{" "}
                  {user.consentDataProcessing ? "Yes" : "No"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Removal Information */}
          <Separator className="my-4" />
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Removal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  className={getStatusColor(user.removal?.status || "Unknown")}
                >
                  {user.removal?.status || "N/A"}
                </Badge>
              </p>
              <p>
                <strong>Reason:</strong> {user.removal?.reason || "N/A"}
              </p>
              <p>
                <strong>Scheduled At:</strong>{" "}
                {user.removal?.scheduledAt
                  ? new Date(user.removal.scheduledAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Scheduled By:</strong>{" "}
                {user.removal?.scheduledBy || "N/A"}
              </p>
              <p>
                <strong>Notes:</strong> {user.removal?.notes || "N/A"}
              </p>
              <p>
                <strong>Executed At:</strong>{" "}
                {user.removal?.executedAt
                  ? new Date(user.removal.executedAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Executed By:</strong>{" "}
                {user.removal?.executedBy || "N/A"}
              </p>
              <p>
                <strong>Last Error:</strong> {user.removal?.lastError || "N/A"}
              </p>
              <p>
                <strong>Transfer:</strong> {user.removal?.transfer || "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to reuse status color logic
function getStatusColor(status: string) {
  switch (status) {
    case "none":
      return "bg-gray-100 text-gray-800";
    case "scheduled":
      return "bg-yellow-100 text-yellow-800";
    case "executed":
      return "bg-green-100 text-green-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
