import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Eye,
  Edit,
  FileText,
  MapPin,
  Phone,
  Mail,
  Trash2,
} from "lucide-react";
import { Branch, Room, Guest, Location } from "@/lib/types";
import { useState } from "react";
import { useDeleteGuest } from "@/hooks/useDeleteGuest";
import DeleteConfirmationDialog from "../company/DeleteConfirmationDialog";
import { UserDetailsModal } from "./UserDetailsModal";
import { EditUserModal } from "./EditUserModal";

interface UserTableProps {
  users: Guest[];
  searchTerm: string;
  selectedBranch: string;
  selectedStatus: string;
  selectedNationality: string;
  branches: Branch[];
  allLocations: Location[];
  allRooms: Room[];
  nationalities: string[];
}

export function UserTable({
  users,
  searchTerm,
  selectedBranch,
  selectedStatus,
  selectedNationality,
  branches,
  allLocations,
  allRooms,
  nationalities,
}: UserTableProps) {
  const deleteGuest = useDeleteGuest();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    fullName: string;
  } | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewUser, setSelectedViewUser] = useState<Guest | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEditUser, setSelectedEditUser] = useState<Guest | null>(null);

  const getStatusColor = (status: string) => {
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
  };

  const flattenedUsers = users.map((guest, index) => ({
    id: guest._id || `${index}`,
    fullName: guest.userId?.fullName || "",
    email: guest.userId?.emailAddress || "",
    phone: guest.userId?.phoneNumber || "",
    branch:
      branches.find((b) => b._id === guest.familyRooms[0]?.branchId)?.name ||
      "",
    location:
      branches.find((b) => b._id === guest.familyRooms[0]?.branchId)?.address ||
      "",
    dateOfBirth: guest.dateOfBirth
      ? new Date(guest.dateOfBirth).toLocaleDateString()
      : "",
    gender: guest.gender || "",
    nationality: guest.nationality || "",
    languages: guest.language ? [guest.language] : [],
    arrivalDate: "", // Not present in new structure, keeping for compatibility
    caseWorker: guest.caseWorker?.fullName || "",
    status: guest.priorityLevel || "Unknown",
    room: guest.familyRooms[0]?.roomId?.roomNumber || "",
  }));

  const filteredUsers = flattenedUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || user.branch === selectedBranch;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    const matchesNationality =
      selectedNationality === "all" || user.nationality === selectedNationality;

    return (
      matchesSearch && matchesBranch && matchesStatus && matchesNationality
    );
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Service User Directory
          </CardTitle>
          <CardDescription>
            Comprehensive list of all service users and their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service User</TableHead>
                  <TableHead>Personal Details</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, idx) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="font-medium capitalize">
                          {user.fullName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs">
                          <strong>DOB:</strong> {user.dateOfBirth || "N/A"}
                        </div>
                        <div className="text-xs">
                          <strong>Nationality:</strong>{" "}
                          {user.nationality || "N/A"}
                        </div>
                        <div className="text-xs">
                          <strong>Gender:</strong> {user.gender || "N/A"}
                        </div>
                        <div className="text-xs">
                          <strong>Languages:</strong>{" "}
                          {user.languages.length > 0
                            ? user.languages.join(", ")
                            : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.branch || "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Room {user.room || "N/A"}
                        </div>
                        {user.arrivalDate && (
                          <div className="text-xs">
                            <strong>Arrived:</strong> {user.arrivalDate}
                          </div>
                        )}
                        {user.caseWorker && (
                          <div className="text-xs">
                            <strong>Case Worker:</strong> {user.caseWorker}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone || "N/A"}
                        </div>
                        <div className="flex items-center text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedViewUser(users[idx]);
                            setViewModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEditUser(users[idx]);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedUser({
                              id: user.id,
                              fullName: user.fullName,
                            });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                No service users found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or add a new service user.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailsModal
        user={selectedViewUser}
        isOpen={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />

      <EditUserModal
        user={selectedEditUser}
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        branches={branches}
        allLocations={allLocations}
        allRooms={allRooms}
        nationalities={nationalities}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Service User"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{selectedUser?.fullName}</strong>? <br />
            This action cannot be undone.
          </>
        }
        onConfirm={() => {
          if (selectedUser) {
            deleteGuest.mutate(selectedUser.id, {
              onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedUser(null);
              },
            });
          }
        }}
        isPending={deleteGuest.isPending}
        confirmText="Yes, Delete"
      />
    </>
  );
}
