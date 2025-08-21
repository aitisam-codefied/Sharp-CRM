"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Wifi,
  Coffee,
  Monitor,
  Car,
  Building,
  Zap,
  Edit,
  CheckCircle,
  X,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUpdateLocation } from "@/hooks/useUpdateLocation";
import { useDeleteLocation } from "@/hooks/useDeleteLocation";
import AddRoomForLocationDialog from "./AddRoomForLocationDialog";
import { useDeleteRoom } from "@/hooks/useDeleteRoom";
import EditRoomDialog from "./EditRoomDialog";
import RoomCard from "./RoomCard";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface Location {
  _id: string;
  name: string;
  rooms: Array<{
    _id: string;
    roomNumber: string;
    type: string;
    amenities: string[];
  }>;
}

const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity?.toLowerCase();
  if (amenityLower?.includes("wifi") || amenityLower?.includes("internet"))
    return Wifi;
  if (amenityLower?.includes("coffee") || amenityLower?.includes("kitchen"))
    return Coffee;
  if (
    amenityLower?.includes("projector") ||
    amenityLower?.includes("screen") ||
    amenityLower?.includes("tv")
  )
    return Monitor;
  if (amenityLower?.includes("parking")) return Car;
  return Zap;
};

const getRoomTypeColor = (type: string) => {
  const typeLower = type?.toLowerCase();
  if (typeLower?.includes("meeting"))
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (typeLower?.includes("conference"))
    return "bg-purple-50 text-purple-700 border-purple-200";
  if (typeLower?.includes("office"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (typeLower?.includes("training"))
    return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
};

export default function LocationCard({
  location,
  isEditable,
  onLocationUpdate,
  onLocationDelete,
}: {
  location: Location;
  isEditable: boolean;
  onLocationUpdate?: (updatedLocation: Location) => void;
  onLocationDelete?: (locationId: string) => void;
}) {
  const [locations, setLocation] = useState<Location>(location);
  const { toast } = useToast();
  const updateLocationMutation = useUpdateLocation();
  const deleteLocationMutation = useDeleteLocation();
  const [editingLocationId, setEditingLocationId] = useState<string | null>(
    null
  );
  const [editLocationName, setEditLocationName] = useState(location.name);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteRoomMutation = useDeleteRoom();
  const [editRoomDialogOpen, setEditRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [deleteRoomDialogOpen, setDeleteRoomDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{
    _id: string;
    roomNumber: string;
  } | null>(null);

  const handleEditLocation = () => {
    setEditingLocationId(location._id);
    setEditLocationName(location.name);
  };

  const handleSaveEdit = () => {
    updateLocationMutation.mutate(
      {
        locationId: location._id,
        data: { name: editLocationName },
      },
      {
        onSuccess: () => {
          toast({
            title: "Location Updated successfully",
          });
          onLocationUpdate?.({ ...location, name: editLocationName });
          setEditingLocationId(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update location",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingLocationId(null);
    setEditLocationName(location.name);
  };

  const handleDeleteLocation = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLocation = () => {
    deleteLocationMutation.mutate(location._id, {
      onSuccess: () => {
        toast({
          title: "Location Deleted successfully",
        });
        onLocationDelete?.(location._id);
        setDeleteDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete location",
          variant: "destructive",
        });
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleRoomCreated = (newRoom: {
    _id: string;
    roomNumber: string;
    type: string;
    amenities: string[];
  }) => {
    const updatedLocation = {
      ...location,
      rooms: [...location.rooms, newRoom],
    };
    onLocationUpdate?.(updatedLocation);
  };

  const confirmDeleteRoom = () => {
    if (!roomToDelete) return;
    deleteRoomMutation.mutate(roomToDelete._id, {
      onSuccess: () => {
        toast({ title: "Room deleted successfully" });
        const updatedLocation = {
          ...location,
          rooms: location.rooms.filter((room) => room._id !== roomToDelete._id),
        };
        onLocationUpdate?.(updatedLocation);
        setDeleteRoomDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete room",
          variant: "destructive",
        });
        setDeleteRoomDialogOpen(false);
      },
    });
  };

  return (
    <>
      <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                {isEditable && editingLocationId === location._id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editLocationName}
                      onChange={(e) => setEditLocationName(e.target.value)}
                      className="bg-white/95 border-2 border-[#F87D7D]/50 text-gray-900 placeholder:text-gray-500 text-lg font-semibold focus:border-[#F87D7D] focus:ring-2 focus:ring-[#F87D7D]/30 rounded-lg w-[60%]"
                      placeholder="Location name"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveEdit}
                      disabled={updateLocationMutation.isPending}
                      className="h-10 w-10 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg"
                    >
                      {updateLocationMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelEdit}
                      className="h-10 w-10 bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h5 className="text-xl font-bold text-gray-900 mb-1">
                      {location.name}
                    </h5>
                    {isEditable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEditLocation}
                        className="h-8 w-8 hover:bg-amber-100 hover:text-amber-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4 text-indigo-500" />
                    {location.rooms?.length} rooms
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditable && editingLocationId !== location._id && (
                <>
                  <AddRoomForLocationDialog
                    locationId={location._id}
                    existingRooms={location.rooms}
                    onRoomCreated={handleRoomCreated}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeleteLocation}
                    disabled={deleteLocationMutation.isPending}
                    className="h-10 w-10 bg-[#F87D7D] hover:bg-white hover:text-red-500 text-white rounded-xl backdrop-blur-sm transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {location.rooms?.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {location.rooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    isEditable={isEditable}
                    onEditRoom={() => {
                      setSelectedRoom(room);
                      setEditRoomDialogOpen(true);
                    }}
                    onDeleteRoom={() => {
                      setRoomToDelete({
                        _id: room._id,
                        roomNumber: room.roomNumber,
                      });
                      setDeleteRoomDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-300">
                <Home className="h-8 w-8 text-gray-400" />
              </div>
              <h6 className="font-semibold text-gray-900 text-lg mb-2">
                No rooms available
              </h6>
              <p className="text-gray-500 text-sm">
                Add rooms to this location to get started
              </p>
            </div>
          )}
        </div>
      </Card>

      {isEditable && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Location?"
          description={
            <>
              This action cannot be undone. This will permanently delete the
              location{" "}
              <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                "{location.name}"
              </span>{" "}
              and all its associated data.
            </>
          }
          onConfirm={confirmDeleteLocation}
          isPending={deleteLocationMutation.isPending}
          confirmText="Delete Location"
        />
      )}

      <DeleteConfirmationDialog
        open={deleteRoomDialogOpen}
        onOpenChange={setDeleteRoomDialogOpen}
        title="Delete Room?"
        description={
          <>
            This action cannot be undone. This will permanently delete room{" "}
            <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
              "{roomToDelete?.roomNumber}"
            </span>{" "}
            from this location.
          </>
        }
        onConfirm={confirmDeleteRoom}
        isPending={deleteRoomMutation.isPending}
        confirmText="Delete Room"
      />

      {selectedRoom && (
        <EditRoomDialog
          room={selectedRoom}
          open={editRoomDialogOpen}
          onOpenChange={setEditRoomDialogOpen}
          onRoomUpdated={(updatedRoom) => {
            const updatedLocation = {
              ...location,
              rooms: location.rooms.map((r) =>
                r._id === updatedRoom._id ? updatedRoom : r
              ),
            };
            onLocationUpdate?.(updatedLocation);
          }}
        />
      )}
    </>
  );
}
