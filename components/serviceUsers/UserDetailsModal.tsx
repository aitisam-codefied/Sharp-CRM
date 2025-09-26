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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMedicalStaff } from "@/hooks/useGetMedicalStaff";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";

interface UserDetailsModalProps {
  user: ServiceUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  forceAssignDropdown?: boolean;
}

export function UserDetailsModal({
  user,
  isOpen,
  onOpenChange,
  forceAssignDropdown = false,
}: UserDetailsModalProps) {
  if (!user) return null;

  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [selectedMedicId, setSelectedMedicId] = useState<string | null>(null);

  const { data } = useMedicalStaff(500);
  const medicalStaff: any[] = Array.isArray(data?.results)
    ? data.results.filter((staff: any) => staff.status === "Active")
    : [];

  const medicalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => {
      if (medicalRef.current) {
        medicalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    document.addEventListener("scrollToMedical", handler);
    return () => {
      document.removeEventListener("scrollToMedical", handler);
    };
  }, []);

  // const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  useEffect(() => {
    if (isOpen && forceAssignDropdown) {
      setShowAssignDropdown(true);
    }
  }, [isOpen, forceAssignDropdown]);

  const assignMedicMutation = useMutation({
    mutationFn: (medicId: string) => {
      return api.patch(`/guest/${user._id}/medic`, { medicId });
    },
    onSuccess: () => {
      // ✅ Refresh list + this user
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["guests", user._id] });

      // ✅ Reset states
      setShowAssignDropdown(false);
      setSelectedMedicId(null);

      // ✅ Close modal
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error assigning medic:", error);
    },
  });

  const handleAssignClick = () => {
    if (selectedMedicId) {
      assignMedicMutation.mutate(selectedMedicId);
    }
  };

  useEffect(() => {
    console.log("user in modal", user);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6">
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
            </CardContent>
          </Card>

          <Separator className="my-4" />

          {/* Medical Information */}
          <Card className="shadow-sm" ref={medicalRef}>
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

              <div
                className={`space-y-2 rounded-md p-3 text-sm ${
                  user?.medic?.status === "Inactive"
                    ? "bg-red-50 text-gray-600"
                    : "bg-green-50 text-gray-800"
                }`}
              >
                <p className="mb-2">
                  <strong>Assigned Medical Staff:</strong>
                </p>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span>{user?.medic?.fullName || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{user?.medic?.phoneNumber || "N/A"}</span>
                </div>
                {user?.medic?.status === "Inactive" && (
                  <p className="text-red-500 text-xs mt-2">
                    This medic is <strong>Inactive</strong>. Kindly{" "}
                    <span
                      onClick={() =>
                        router.push("/dashboard/admin/medical-staff")
                      }
                      className="text-red-500 underline cursor-pointer"
                    >
                      activate
                    </span>{" "}
                    or{" "}
                    <span
                      onClick={() => setShowAssignDropdown(true)}
                      className="text-red-500 underline cursor-pointer"
                    >
                      assign another
                    </span>
                    .
                    {showAssignDropdown && (
                      <div className="mt-3 space-y-2">
                        <Select
                          onValueChange={(value) => setSelectedMedicId(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select medical staff" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicalStaff.map((staff) => (
                              <SelectItem key={staff._id} value={staff._id}>
                                {staff.fullName} ({staff.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleAssignClick}
                          disabled={
                            !selectedMedicId || assignMedicMutation.isPending
                          }
                          size="sm"
                          variant="destructive"
                        >
                          {assignMedicMutation.isPending
                            ? "Assigning..."
                            : "Assign"}
                        </Button>
                      </div>
                    )}
                  </p>
                )}
              </div>
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
          <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileSignature className="h-5 w-5 text-primary" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>{user.additionalNotes || "N/A"}</p>
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
            <CardContent className="text-sm">
              {user.removal?.status === "none" || !user.removal?.status ? (
                <p className="text-muted-foreground">
                  No removal or transfer request has been made for this guest
                  yet.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  A transfer is currently in process.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
