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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

interface UserDetailsModalProps {
  user: ServiceUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  forceAssignDropdown?: boolean;
  setAssigningUserId?: (id: string | null) => void;
}

export function UserDetailsModal({
  user,
  isOpen,
  onOpenChange,
  forceAssignDropdown = false,
  setAssigningUserId,
}: UserDetailsModalProps) {
  if (!user) return null;

  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAssignDropdownForMedic, setShowAssignDropdownForMedic] =
    useState(false);
  const [showAssignDropdownForDentist, setShowAssignDropdownForDentist] =
    useState(false);
  const [selectedMedicId, setSelectedMedicId] = useState<string | null>(null);
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(
    null
  );

  const { data } = useMedicalStaff(500);
  const medicalStaff: any[] = Array.isArray(data?.results)
    ? data.results.filter((staff: any) => staff.status === "Active")
    : [];

  const medicalRef = useRef<HTMLDivElement | null>(null);

  // Track query status to know when data refreshes
  const { data: guestData, isFetching } = useQuery({
    queryKey: ["guests", user._id],
    enabled: isOpen, // Only fetch when modal is open
  });

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

  useEffect(() => {
    if (isOpen && forceAssignDropdown) {
      setShowAssignDropdownForMedic(true);
      setShowAssignDropdownForDentist(true);
    }
  }, [isOpen, forceAssignDropdown]);

  // Clear assigningUserId when query data is refreshed (not fetching anymore)
  useEffect(() => {
    if (!isFetching && guestData) {
      setAssigningUserId?.(null); // Clear loader state after data refresh
    }
  }, [isFetching, guestData, setAssigningUserId]);

  const assignMedicMutation = useMutation({
    mutationFn: (medicId: string) => {
      return api.patch(`/guest/${user._id}/medic`, { medicId });
    },
    onMutate: () => {
      setAssigningUserId?.(user._id); // Set loader state before mutation starts
    },
    onSuccess: () => {
      // ✅ Refresh list + this user
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["guests", user._id] });

      // ✅ Reset states
      setShowAssignDropdownForMedic(false);
      setSelectedMedicId(null);

      // ✅ Close modal
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Medic assigned successfully.",
      });
    },
    onError: (error) => {
      setAssigningUserId?.(null);
      toast({
        title: "Error",
        description: "Failed to assign medic. Please try again.",
        variant: "destructive",
      });
    },
  });

  const assignDentistMutation = useMutation({
    mutationFn: (dentistId: string) => {
      return api.patch(`/guest/${user._id}/dentist`, { dentistId });
    },
    onMutate: () => {
      setAssigningUserId?.(user._id); // Set loader state before mutation starts
    },
    onSuccess: () => {
      // ✅ Refresh list + this user
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["guests", user._id] });

      // ✅ Reset states
      setShowAssignDropdownForDentist(false);
      setSelectedDentistId(null);

      // ✅ Close modal
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Dentist assigned successfully.",
      });
    },
    onError: (error) => {
      setAssigningUserId?.(null);
      toast({
        title: "Error",
        description: "Failed to assign dentist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAssignClickForMedic = () => {
    if (selectedMedicId) {
      // setAssigningUserId?.(user._id);
      assignMedicMutation.mutate(selectedMedicId);
    }
  };

  const handleAssignClickForDentist = () => {
    if (selectedDentistId) {
      // setAssigningUserId?.(user._id);
      assignDentistMutation.mutate(selectedDentistId);
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
            {user.user?.fullName || "N/A"}'s Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detailed information about the service user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Personal & Contact */}
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
                  <strong>Full Name:</strong> {user.user?.fullName || "N/A"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {user.profile?.dateOfBirth
                    ? new Date(user.profile.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {user.profile?.gender || "N/A"}
                </p>
                <p>
                  <strong>Nationality:</strong>{" "}
                  {user.profile?.nationality || "N/A"}
                </p>
                <p>
                  <strong>Language:</strong> {user.profile?.language || "N/A"}
                </p>
                <p>
                  <strong>Number of Dependents:</strong>{" "}
                  {user.profile?.numberOfDependents ?? 0}
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
                  {user.user?.emailAddress || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {user.user?.phoneNumber || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {user.profile?.address || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          {/* Room */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-5 w-5 text-primary" />
                Room Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {user.assignedRooms?.length > 0 ? (
                user.assignedRooms.map((room, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <p>
                      <strong>Room Number:</strong> {room.roomNumber || "N/A"}
                    </p>
                    <p>
                      <strong>Room Type:</strong> {room.type || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong> {room.status || "N/A"}
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

          {/* Medical */}
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
                {user.profile?.medicalCondition || "N/A"}
              </p>
              <p>
                <strong>Current Medications:</strong>{" "}
                {user.profile?.currentMedications || "N/A"}
              </p>
              <p>
                <strong>Allergies:</strong> {user.profile?.allergies || "N/A"}
              </p>
              <p className="flex items-center gap-3">
                <strong>Dietary Requirements:</strong>{" "}
                <div className="flex flex-wrap gap-2">
                  {user.profile?.dietaryRequirements?.length > 0 ? (
                    user.profile.dietaryRequirements.map((diet, index) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medic */}
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
                    <span>{user?.medic?.name || "N/A"}</span>
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
                          router.push("/medical-staff")
                        }
                        className="text-red-500 underline cursor-pointer"
                      >
                        activate
                      </span>{" "}
                      or{" "}
                      <span
                        onClick={() => setShowAssignDropdownForMedic(true)}
                        className="text-red-500 underline cursor-pointer"
                      >
                        assign another
                      </span>
                      .
                      {showAssignDropdownForMedic && (
                        <div className="mt-3 space-y-2">
                          <Select
                            onValueChange={(value) => setSelectedMedicId(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select medical staff" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicalStaff
                                .filter(
                                  (staff) =>
                                    staff.type === "General Practitioner"
                                ) // ✅ filter
                                .map((staff) => (
                                  <SelectItem key={staff._id} value={staff._id}>
                                    {staff.fullName}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={handleAssignClickForMedic}
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

                {/* Dentist */}
                <div
                  className={`space-y-2 rounded-md p-3 text-sm ${
                    user?.dentist?.status === "Inactive"
                      ? "bg-red-50 text-gray-600"
                      : "bg-green-50 text-gray-800"
                  }`}
                >
                  <p className="mb-2">
                    <strong>Assigned Dentist:</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    <span>{user?.dentist?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{user?.dentist?.phoneNumber || "N/A"}</span>
                  </div>

                  {user?.dentist?.status === "Inactive" && (
                    <p className="text-red-500 text-xs mt-2">
                      This dentist is <strong>Inactive</strong>. Kindly{" "}
                      <span
                        onClick={() =>
                          router.push("/medical-staff")
                        }
                        className="text-red-500 underline cursor-pointer"
                      >
                        activate
                      </span>{" "}
                      or{" "}
                      <span
                        onClick={() => setShowAssignDropdownForDentist(true)}
                        className="text-red-500 underline cursor-pointer"
                      >
                        assign another
                      </span>
                      .
                      {showAssignDropdownForDentist && (
                        <div className="mt-3 space-y-2">
                          <Select
                            onValueChange={(value) =>
                              setSelectedDentistId(value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select dentist" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicalStaff
                                .filter((staff) => staff.type === "Dental") // ✅ filter
                                .map((staff) => (
                                  <SelectItem key={staff._id} value={staff._id}>
                                    {staff.fullName}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={handleAssignClickForDentist}
                            disabled={
                              !selectedDentistId ||
                              assignDentistMutation.isPending
                            }
                            size="sm"
                            variant="destructive"
                          >
                            {assignDentistMutation.isPending
                              ? "Assigning..."
                              : "Assign"}
                          </Button>
                        </div>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-4" />

          {/* Case Worker + Emergency */}
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
                {user.profile?.emergencyContacts?.length > 0 ? (
                  user.profile.emergencyContacts.map((contact, index) => (
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

          {/* Additional Notes */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSignature className="h-5 w-5 text-primary" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{user.profile?.additionalNotes || "N/A"}</p>
            </CardContent>
          </Card>

          {/* Removal */}
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
