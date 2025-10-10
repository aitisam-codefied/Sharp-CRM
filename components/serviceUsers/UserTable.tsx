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
import { Button } from "@/components/ui/button";
import {
  Users,
  Eye,
  Edit,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { Branch, Room, Guest, Location } from "@/lib/types";
import { useState } from "react";
import { useDeleteGuest } from "@/hooks/useDeleteGuest";
import DeleteConfirmationDialog from "../company/DeleteConfirmationDialog";
import { UserDetailsModal } from "./UserDetailsModal";
import { EditUserModal } from "./EditUserModal";
import { useRouter } from "next/navigation";
import { Tree } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";

interface UserTableProps {
  users: Guest[]; // 🚨 Already filtered + paginated
  branches: Branch[];
  allLocations: Location[];
  allRooms: Room[];
  nationalities: string[];
}

export function UserTable({
  users,
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
  const [forceAssignDropdown, setForceAssignDropdown] = useState(false);
  const [copiedPortId, setCopiedPortId] = useState<string | null>(null);
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const router = useRouter();

  // Flatten data for display only (new API response structure)
  const flattenedUsers = users.map((guest, index) => ({
    id: guest._id || `${index}`,
    fullName: guest.user?.fullName || "",
    portNumber: guest.portNumber || guest.user?.portNumber || "",
    email: guest.user?.emailAddress || "",
    phone: guest.user?.phoneNumber || "",

    // Dependants only if isPrimary true
    dependants: guest?.family?.isPrimary ? guest.family?.dependants || [] : [],
    isPrimary: guest?.family?.isPrimary || false,

    medicFullName: guest.medic?.name || "",
    medicPhone: guest.medic?.phoneNumber || "",
    medicEmail: guest.medic?.emailAddress || "",
    medicStatus: guest.medic?.status || "",

    dentistFullName: guest.dentist?.name || "",
    dentistPhone: guest.dentist?.phoneNumber || "",
    dentistEmail: guest.dentist?.emailAddress || "",
    dentistStatus: guest.dentist?.status || "",

    branch: guest.branch?.name || "",
    location: guest.branch?.address || "",
    company: guest.branch?.company?.name || "",

    dateOfBirth: guest.profile?.dateOfBirth
      ? new Date(guest.profile.dateOfBirth).toLocaleDateString()
      : "",
    gender: guest.profile?.gender || "",
    nationality: guest.profile?.nationality || "",
    languages: guest.profile?.language ? [guest.profile.language] : [],

    caseWorker: guest.caseWorker?.fullName || "",

    room: guest.assignedRooms?.[0]?.roomNumber || "",

    arrivalDate: guest.checkInDate
      ? new Date(guest.checkInDate).toLocaleDateString()
      : "",
    departureDate: guest.checkOutDate
      ? new Date(guest.checkOutDate).toLocaleDateString()
      : "",
  }));

  // Callback to handle assignment completion
  const handleAssignmentComplete = (userId: string) => {
    setAssigningUserId(null); // Clear assigning state
  };

  return (
    <>
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Service User Directory
          </CardTitle>
          <CardDescription>
            Comprehensive list of all service users and their information
          </CardDescription>
        </CardHeader>
        <CardContent> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service User</TableHead>
              <TableHead>Port Number</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Dependants</TableHead>
              <TableHead>General Practitioner</TableHead>
              <TableHead>Dentist</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flattenedUsers.map((user, idx) => (
              <TableRow key={user.id}>
                <TableCell className="min-w-[150px]">
                  <div className="flex flex-col items-start gap-2">
                    <div className="font-medium capitalize bg-green-100 text-green-800 px-2 py-1 rounded-xl text-sm">
                      {user.fullName}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div>
                        <strong>DOB:</strong> {user.dateOfBirth || "N/A"}
                      </div>
                      <div>
                        <strong>Nationality:</strong>{" "}
                        {user.nationality || "N/A"}
                      </div>
                      <div>
                        <strong>Gender:</strong> {user.gender || "N/A"}
                      </div>
                      <div>
                        <strong>Language:</strong>{" "}
                        {user.languages.length > 0
                          ? user.languages.join(", ")
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-xs flex items-center gap-2">
                    <span className="w-[80px] break-all whitespace-normal">
                      {user.portNumber || "N/A"}
                    </span>
                    {user.portNumber && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.portNumber);
                          setCopiedPortId(user.id); // jis user ka copy kiya uska id set
                          setTimeout(() => setCopiedPortId(null), 2000); // 2 sec baad reset
                        }}
                        className="text-gray-500 hover:text-black transition-colors"
                      >
                        {copiedPortId === user.id ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      {/* <MapPin className="h-3 w-3 mr-1" /> */}
                      {user.branch || "N/A"}
                    </div>
                    <div className="">Room {user.room || "N/A"}</div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1 text-xs">
                    {/* Phone clickable */}
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {user.phone ? (
                        <a
                          href={`tel:${user.phone}`}
                          className="hover:underline"
                        >
                          {user.phone}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>

                    {/* Email clickable */}
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email ? (
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:underline"
                        >
                          {user.email}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {user?.isPrimary && user.dependants.length > 0 ? (
                    <Tree
                      showLine
                      switcherIcon={(props: any) =>
                        props.expanded ? (
                          <MinusSquareOutlined style={{ fontSize: "14px" }} />
                        ) : (
                          <PlusSquareOutlined style={{ fontSize: "14px" }} />
                        )
                      }
                      treeData={[
                        {
                          title: "Dependants",
                          key: "dependants-root",
                          children: user.dependants.map((dep, depIdx) => ({
                            key: `dep-${user.id}-${depIdx}`,
                            title: (
                              <div className="text-xs">
                                <div className="capitalize">{dep.fullName}</div>
                                <div>
                                  <strong> Port Number :</strong>{" "}
                                  {dep.portNumber || "N/A"}
                                </div>
                              </div>
                            ),
                          })),
                        },
                      ]}
                    />
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      No dependants for this user
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      {user?.medicFullName || "N/A"}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {user?.medicPhone || "N/A"}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user?.medicEmail || "N/A"}
                    </div>
                  </div>
                  {user.medicStatus === "Inactive" && (
                    <div className="mt-2 text-xs bg-red-50 text-red-600 p-2 rounded-md w-fit">
                      This medic is currently <strong>inactive</strong>.<br />
                      {assigningUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Assigning...
                        </div>
                      ) : (
                        <>
                          Kindly{" "}
                          <span
                            onClick={() =>
                              router.push("/medical-staff")
                            }
                            className="underline cursor-pointer"
                          >
                            activate
                          </span>{" "}
                          or{" "}
                          <span
                            onClick={() => {
                              setSelectedViewUser(users[idx]);
                              setViewModalOpen(true);
                              setForceAssignDropdown(true);
                              // setAssigningUserId(user.id);
                              setTimeout(() => {
                                document.dispatchEvent(
                                  new CustomEvent("scrollToMedical")
                                );
                              }, 300);
                            }}
                            className="underline cursor-pointer"
                          >
                            assign a new one
                          </span>
                          .
                        </>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      {user?.dentistFullName || "N/A"}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {user?.dentistPhone || "N/A"}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user?.dentistEmail || "N/A"}
                    </div>
                  </div>

                  {user.dentistStatus === "Inactive" && (
                    <div className="mt-2 text-xs bg-red-50 text-red-600 p-2 rounded-md w-fit">
                      This dentist is currently <strong>inactive</strong>.<br />
                      {assigningUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Assigning...
                        </div>
                      ) : (
                        <>
                          Kindly{" "}
                          <span
                            onClick={() =>
                              router.push("/medical-staff")
                            }
                            className="underline cursor-pointer"
                          >
                            activate
                          </span>{" "}
                          or{" "}
                          <span
                            onClick={() => {
                              setSelectedViewUser(users[idx]);
                              setViewModalOpen(true);
                              setForceAssignDropdown(true);
                              // setAssigningUserId(user.id);
                              setTimeout(() => {
                                document.dispatchEvent(
                                  new CustomEvent("scrollToMedical")
                                );
                              }, 300);
                            }}
                            className="underline cursor-pointer"
                          >
                            assign a new one
                          </span>
                          .
                        </>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedViewUser(users[idx]);
                        setViewModalOpen(true);
                        setForceAssignDropdown(false);
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
                    {/* <Button
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
                        </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {flattenedUsers.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No service users found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or add a new service user.
          </p>
        </div>
      )}
      {/* </CardContent>
      </Card> */}

      {/* Modals */}
      <UserDetailsModal
        user={selectedViewUser}
        isOpen={viewModalOpen}
        onOpenChange={setViewModalOpen}
        forceAssignDropdown={forceAssignDropdown}
        setAssigningUserId={setAssigningUserId}
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
