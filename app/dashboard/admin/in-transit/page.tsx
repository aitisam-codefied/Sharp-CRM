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
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";
import { useInTransitUsers } from "@/hooks/useGetInTransitUsers";
import { InTransitUser, Guest } from "@/hooks/useGetInTransitUsers";
import StatsCards from "@/components/in-transit/StatsCards";
import Filters from "@/components/in-transit/Filters";
import UsersTable from "@/components/in-transit/UsersTable";
import UrgentArrivals from "@/components/in-transit/UrgentArrivals";

export default function InTransitPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const { toast } = useToast();
  const { data: apiUsers, isLoading, error } = useInTransitUsers();

  // Filter based on removal.status = "pending" or "requested"
  const filteredApiUsers = (apiUsers || []).filter((user) =>
    ["pending", "requested"].includes(user.removal.status)
  );

  // Map to InTransitUser format
  const inTransitUsers: InTransitUser[] = filteredApiUsers.map(mapGuestToUser);

  const branches = [
    "Manchester",
    "Birmingham",
    "London Central",
    "Liverpool",
    "Leeds",
  ];
  const statusOptions = ["requested", "pending"];

  const filteredUsers = inTransitUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.assignedRoom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || user.destinationBranch === selectedBranch;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    const matchesDate = !selectedDate || user.expectedArrival === selectedDate;

    return matchesSearch && matchesBranch && matchesStatus && matchesDate;
  });

  const handleViewUser = (userId: string) => {
    toast({
      title: "View Transit Details",
      description: `Opening detailed view for ${userId}`,
    });
  };

  const handleMarkArrived = (userId: string) => {
    toast({
      title: "Arrival Confirmed",
      description:
        "User has been marked as arrived and room assignment activated.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading in-transit data...
      </div>
    );
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <DashboardLayout
      title="In-Transit User Management"
      description="Track and manage incoming service users across all branches"
    >
      <div className="space-y-6">
        <StatsCards filteredUsers={filteredUsers} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              In-Transit Service Users
            </CardTitle>
            <CardDescription>
              Monitor incoming service users and prepare for arrivals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Filters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              branches={branches}
              statusOptions={statusOptions}
            />

            <UsersTable
              filteredUsers={filteredUsers}
              handleViewUser={handleViewUser}
              handleMarkArrived={handleMarkArrived}
            />

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  No in-transit users found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or add a new transit alert.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <UrgentArrivals
          filteredUsers={filteredUsers}
          handleViewUser={handleViewUser}
        />
      </div>
    </DashboardLayout>
  );
}

// Helper function to calculate age
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date("2025-09-04"); // Using provided current date
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Mapper function
function mapGuestToUser(guest: Guest): InTransitUser {
  const age = calculateAge(guest.dateOfBirth);
  const expectedArrival = guest.removal.scheduledAt
    ? new Date(guest.removal.scheduledAt).toISOString().split("T")[0]
    : "N/A";
  const expectedTime = guest.removal.scheduledAt
    ? new Date(guest.removal.scheduledAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
  const destinationBranch = "Main Branch"; // Placeholder, as branchId is ID; adjust if mapping available
  const assignedRoom = guest.familyRooms[0]?.roomId.roomNumber || "N/A";
  const transportMethod = "N/A"; // Not in API
  const referringAgency = "N/A"; // Not in API
  const caseWorker = `ID: ${guest.caseWorker}`; // ID, not name; adjust if fetching names
  const contactNumber = guest.userId.phoneNumber;
  const emergencyContact = guest.emergencyContacts[0]
    ? {
        name: guest.emergencyContacts[0].fullName,
        relation: guest.emergencyContacts[0].relationship,
        phone: guest.emergencyContacts[0].phoneNumber,
      }
    : null;
  const specialRequirements = guest.dietaryRequirements;
  // const medicalNotes = `${guest.medicalCondition} | Allergies: ${guest.allergies} | Meds: ${guest.currentMedications}`;
  const status = guest.removal.status; // Use removal.status
  const estimatedDuration = "N/A"; // Not in API
  const lastUpdate = new Date(guest.updatedAt).toLocaleString();
  const documents: string[] = [];
  if (guest.occupancyAgreementUrl) documents.push("Occupancy Agreement");
  if (guest.signatureUrl) documents.push("Signature");

  return {
    id: guest.portNumber,
    name: guest.userId.fullName,
    email: guest.userId.emailAddress,
    dateOfBirth: guest.dateOfBirth,
    age,
    language: guest.language,
    nationality: guest.nationality,
    gender: guest.gender,
    expectedArrival,
    expectedTime,
    destinationBranch,
    assignedRoom,
    transportMethod,
    referringAgency,
    caseWorker,
    contactNumber,
    emergencyContact,
    specialRequirements,
    medicalCondition: guest.medicalCondition,
    allergies: guest.allergies,
    currentMedications: guest.currentMedications,
    status,
    estimatedDuration,
    lastUpdate,
    documents,
    avatar: "/placeholder.svg?height=40&width=40",
  };
}
