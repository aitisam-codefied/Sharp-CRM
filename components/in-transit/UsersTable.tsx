"use client";

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
  Eye,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Truck,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { InTransitUser } from "@/hooks/useGetInTransitUsers";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import api from "@/lib/axios";

interface UsersTableProps {
  filteredUsers: InTransitUser[];
  handleViewUser: (userId: string) => void;
  handleMarkArrived: (userId: string) => void;
}

interface Branch {
  _id: string;
  name: string;
  address: string;
  locations: { _id: string; name: string; rooms: string[] }[];
  documents: any[];
  createdAt: string;
  updatedAt: string;
}

interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  currentOccupancy: number;
  currentKids: number;
  availableAdultSpace: number;
  availableKidSpace: number;
  totalAvailableSpace: number;
  locationId: string;
  location: string;
  branch: string;
  status: string;
  roomType: string;
  amenities: string[];
  maxAdultsCanFit: number;
  maxKidsCanFit: number;
  recommendedFor: string;
  specialNote: string;
}

const fetchBranches = async (companyId: string): Promise<Branch[]> => {
  const response = await api.get(
    `/branch/list/by-company?companyId=${companyId}`
  );
  return response.data.branches;
};

const fetchRooms = async (): Promise<Room[]> => {
  const response = await api.get(`/guest/rooms/capacity?capacity=1&kids=0`);
  return response.data.data;
};

export default function UsersTable({
  filteredUsers,
  handleViewUser,
  handleMarkArrived,
}: UsersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch branches when modal opens
  const {
    data: branches = [],
    isLoading: isLoadingBranches,
    isError: isBranchesError,
  } = useQuery({
    queryKey: ["branches", selectedCompanyId],
    queryFn: () => fetchBranches(selectedCompanyId!),
    enabled: !!selectedCompanyId && isModalOpen,
  });

  // Fetch rooms when branch is selected
  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    isError: isRoomsError,
  } = useQuery({
    queryKey: ["rooms", selectedBranchId],
    queryFn: fetchRooms,
    enabled: !!selectedBranchId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "Transferred":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Transferred":
        return <Truck className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleApproveClick = (userId: string, companyId: string) => {
    setSelectedUserId(userId);
    setSelectedCompanyId(companyId);
    setIsModalOpen(true);
  };

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  const handleRejectClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedUserId) return;

    try {
      setIsRejecting(true);
      await api.post("/su-removal/reject-removal", {
        guestIds: [selectedUserId],
        rejectionReason:
          "Transfer request rejected - insufficient documentation provided",
      });

      // Invalidate queries to refetch the table data
      await queryClient.invalidateQueries({ queryKey: ["inTransitUsers"] });

      setIsRejectModalOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error("Error rejecting user:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRoomSelect = (roomId: string, locationId: string) => {
    setSelectedRoomId(roomId);
    setSelectedLocationId(locationId);
  };

  const handleProceed = async () => {
    if (
      !selectedUserId ||
      !selectedCompanyId ||
      !selectedBranchId ||
      !selectedRoomId ||
      !selectedLocationId
    )
      return;

    try {
      setIsApproving(true);
      await api.post("/su-removal/approve-transfer", {
        guestIds: [selectedUserId],
        targetCompanyId: selectedCompanyId,
        targetBranchId: selectedBranchId,
        targetLocationId: selectedLocationId,
        targetRoomId: selectedRoomId,
        approvalNotes: "Transfer approved - guest moving to new location",
      });

      // Invalidate queries to refetch the table data
      await queryClient.invalidateQueries({ queryKey: ["inTransitUsers"] });

      // Close modal and reset selections
      setIsModalOpen(false);
      setSelectedUserId(null);
      setSelectedCompanyId(null);
      setSelectedBranchId(null);
      setSelectedRoomId(null);
      setSelectedLocationId(null);
    } catch (error) {
      console.error("Error approving transfer:", error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service User</TableHead>
            <TableHead>Contact Details</TableHead>
            <TableHead>Current Location</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user: any) => (
            <TableRow className="text-xs" key={user?._id}>
              <TableCell>
                <div className="font-medium capitalize">
                  {user?.guestId?.userId?.fullName}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    {user?.guestId?.userId?.phoneNumber}
                  </div>
                  <div className="flex items-center text-xs">
                    {user?.guestId?.userId?.emailAddress}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Room: {user?.guestId?.familyRooms[0]?.roomId?.roomNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Location: {user?.guestId?.familyRooms[0]?.locationId?.name}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">-</div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(user.removalStatus)}
                >
                  <div className="flex items-center gap-1">
                    {getStatusIcon(user.removalStatus)}
                    {user?.removalStatus
                      ?.replace("_", " ")
                      ?.replace(/\b\w/g, (l: any) => l?.toUpperCase())}
                  </div>
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {user.removalStatus === "pending" ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleApproveClick(user._id, user.companyId._id)
                      }
                      className="bg-green-50 text-green-800 border border-green-200 hover:bg-green-100 hover:border-green-300"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectClick(user._id)}
                      className="bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 hover:border-red-300"
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleViewUser(user._id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              Select Destination Branch and Room
            </DialogTitle>
          </DialogHeader>
          {isLoadingBranches ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : isBranchesError ? (
            <div className="text-red-500 text-center py-4 bg-red-50 rounded-lg">
              Error loading branches. Please try again.
            </div>
          ) : (
            <div className="space-y-6">
              <Select onValueChange={handleBranchSelect}>
                <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg p-3 bg-gray-50">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg">
                  {branches.map((branch) => (
                    <SelectItem
                      key={branch._id}
                      value={branch._id}
                      className="hover:bg-blue-50 cursor-pointer"
                    >
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isLoadingRooms ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : isRoomsError ? (
                <div className="text-red-500 text-center py-4 bg-red-50 rounded-lg">
                  Error loading rooms. Please try again.
                </div>
              ) : (
                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg bg-white ${
                        selectedRoomId === room.id
                          ? "border-2 border-blue-500"
                          : ""
                      }`}
                      onClick={() => handleRoomSelect(room.id, room.locationId)}
                    >
                      <CardHeader className="border-b border-gray-100 pb-3">
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          {room.roomNumber}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 font-medium">Type</p>
                            <p className="text-gray-800">{room.roomType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">
                              Location
                            </p>
                            <p className="text-gray-800">{room.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Branch</p>
                            <p className="text-gray-800">{room.branch}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Status</p>
                            <p
                              className={
                                room.status === "Partially Available"
                                  ? "text-green-600"
                                  : "text-gray-800"
                              }
                            >
                              {room.status}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">
                              Available Space
                            </p>
                            <p className="text-gray-800">
                              {room.totalAvailableSpace}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">
                              Amenities
                            </p>
                            <p className="text-gray-800">
                              {room.amenities.join(", ")}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-600 font-medium">
                              Recommended
                            </p>
                            <p className="text-gray-800">
                              {room.recommendedFor}
                            </p>
                          </div>
                          {room.specialNote && (
                            <div className="col-span-2">
                              <p className="text-gray-600 font-medium">Note</p>
                              <p className="text-gray-600 italic">
                                {room.specialNote}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {selectedRoomId && (
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleProceed}
                    disabled={isApproving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isApproving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Proceed
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Confirm Rejection
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to reject this transfer request?
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={isRejecting}
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
