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
import { useState } from "react";
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
  const { toast } = useToast();
  const updateLocationMutation = useUpdateLocation();
  const deleteLocationMutation = useDeleteLocation();
  const [editingLocationId, setEditingLocationId] = useState<string | null>(
    null
  );
  const [editLocationName, setEditLocationName] = useState(location.name);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
                {location.rooms.map((room) => {
                  const roomTypeColor = getRoomTypeColor(room.type);
                  return (
                    <Card
                      key={room._id}
                      className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <h6 className="font-bold text-gray-900 text-lg">
                                Room {room.roomNumber}
                              </h6>
                              <Badge
                                variant="outline"
                                className={`${roomTypeColor} text-xs font-medium mt-1`}
                              >
                                {room.type}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {room.amenities?.length > 0 && (
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-semibold text-gray-700">
                                Amenities
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {room.amenities.map((amenity) => {
                                const IconComponent = getAmenityIcon(amenity);
                                return (
                                  <Badge
                                    key={amenity}
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-all duration-200 text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 shadow-sm"
                                  >
                                    <IconComponent className="h-3 w-3" />
                                    {amenity}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
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
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-gradient-to-br from-white to-red-50 border-red-200 max-w-md">
            <AlertDialogHeader>
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trash2 className="h-10 w-10 text-red-600" />
              </div>
              <AlertDialogTitle className="text-center text-2xl font-bold text-gray-900">
                Delete Location?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-gray-600 text-lg leading-relaxed">
                This action cannot be undone. This will permanently delete the
                location{" "}
                <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                  "{location.name}"
                </span>{" "}
                and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="grid grid-cols-2 gap-3 items-center justify-center pt-6">
              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-lg font-semibold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteLocation}
                disabled={deleteLocationMutation.isPending}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-2 rounded-lg font-semibold shadow-lg"
              >
                {deleteLocationMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete Location"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
