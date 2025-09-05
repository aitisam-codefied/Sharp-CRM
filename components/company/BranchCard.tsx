"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDeleteBranch } from "@/hooks/useDeleteBranch";
import { useUpdateBranch } from "@/hooks/useUpdateBranch";
import { useAuth } from "@/components/providers/auth-provider";
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
import {
  Edit,
  Trash2,
  MapPin,
  Home,
  CheckCircle,
  X,
  Building2,
} from "lucide-react";
import LocationCard from "./LocationCard";
import { on } from "events";
import AddLocationForBranchDialog from "./AddLocationForBranchDialog";

interface Branch {
  _id: string;
  name: string;
  address: string;
  locations: Array<{
    _id: string;
    name: string;
    rooms: Array<{
      _id: string;
      roomNumber: string;
      type: string;
      capacity: number;
      amenities: string[];
    }>;
  }>;
}

export default function BranchCard({
  branch,
  companyId,
  onBranchUpdate,
  onBranchDelete,
  isEditable,
  onClose,
}: {
  branch: Branch;
  companyId: string;
  onBranchUpdate: (updatedBranch: Branch) => void;
  onBranchDelete: (branchId: string) => void;
  isEditable: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const { removeBranchFromCompany } = useAuth();
  const updateBranchMutation = useUpdateBranch();
  const deleteBranchMutation = useDeleteBranch();
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editBranchData, setEditBranchData] = useState({
    name: branch.name,
    address: branch.address,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // useEffect(() => {
  //   console.log("branchssssss", branch);
  // });

  const handleEditBranch = () => {
    setEditingBranchId(branch._id);
    setEditBranchData({ name: branch.name, address: branch.address });
  };

  const handleSaveEdit = () => {
    updateBranchMutation.mutate(
      {
        branchId: branch._id,
        data: editBranchData,
      },
      {
        onSuccess: () => {
          toast({
            title: "Branch Updated successfully",
          });
          onBranchUpdate({ ...branch, ...editBranchData });
          setEditingBranchId(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update branch",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingBranchId(null);
    setEditBranchData({ name: branch.name, address: branch.address });
  };

  const handleDeleteBranch = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBranch = () => {
    deleteBranchMutation.mutate(branch._id, {
      onSuccess: () => {
        toast({
          title: "Deleted successfully",
        });
        removeBranchFromCompany(companyId, branch._id);
        onBranchDelete(branch._id);
        setDeleteDialogOpen(false);
        onClose();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete branch",
          variant: "destructive",
        });
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleLocationCreated = (newLocation: {
    _id: string;
    name: string;
    rooms: Array<{
      _id: string;
      roomNumber: string;
      type: string;
      capacity: number;
      price: number;
      amenities: string[];
    }>;
  }) => {
    const updatedBranch = {
      ...branch,
      locations: [...branch.locations, newLocation],
    };
    onBranchUpdate(updatedBranch);
  };

  const handleLocationUpdate = (updatedLocation: {
    _id: string;
    name: string;
    rooms: Array<{
      _id: string;
      roomNumber: string;
      type: string;
      capacity: number;
      amenities: string[];
    }>;
  }) => {
    const updatedBranch = {
      ...branch,
      locations: branch.locations.map((loc) =>
        loc._id === updatedLocation._id ? updatedLocation : loc
      ),
    };
    onBranchUpdate(updatedBranch);
  };

  const handleLocationDelete = (locationId: string) => {
    const updatedBranch = {
      ...branch,
      locations: branch.locations.filter((loc) => loc._id !== locationId),
    };
    onBranchUpdate(updatedBranch);
  };

  const totalRooms = branch.locations?.reduce(
    (acc, location) => acc + location.rooms?.length,
    0
  );

  // Merge room details into location.rooms before rendering
  const enrichedLocations = branch.locations?.map((location) => {
    const fullRooms = location.rooms
      ?.map((roomId) => {
        if (typeof roomId === "string") {
          return branch.rooms?.find((room) => room._id === roomId);
        }
        return roomId;
      })
      .filter(Boolean); // remove any undefined/null

    return {
      ...location,
      rooms: fullRooms,
    };
  });

  return (
    <>
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-[#F87D7D]/5 hover:shadow-2xl overflow-hidden">
        <CardHeader className="bg-[#f87d7d] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F87D7D]/20 to-[#F87D7D]/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-[#F87D7D]/50 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  {isEditable && editingBranchId === branch._id ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          value={editBranchData.name}
                          onChange={(e) =>
                            setEditBranchData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="bg-white/95 border-2 border-[#F87D7D]/50 text-gray-900 placeholder:text-gray-500 text-lg font-semibold focus:border-[#F87D7D] focus:ring-2 focus:ring-[#F87D7D]/30 rounded-lg w-full sm:w-[40%]"
                          placeholder="Branch name"
                        />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={editBranchData.address}
                          onChange={(e) =>
                            setEditBranchData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="bg-white/95 border-2 border-[#F87D7D]/50 text-gray-900 placeholder:text-gray-500 pl-10 focus:border-[#F87D7D] focus:ring-2 focus:ring-[#F87D7D]/30 rounded-lg w-full sm:w-[40%]"
                          placeholder="Branch address"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-md sm:text-2xl font-bold text-white mb-2">
                        {branch.name}
                      </CardTitle>
                      <p className="text-sm sm:text-md text-slate-200 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {branch.address}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {isEditable && (
                <div className="flex items-center gap-2">
                  {editingBranchId === branch._id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveEdit}
                        disabled={updateBranchMutation.isPending}
                        className="h-4 sm:h-10 w-4 sm:w-10 bg-green-500 hover:bg-green-600 text-black rounded-xl shadow-lg transition-all duration-200"
                      >
                        {updateBranchMutation.isPending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                        className="h-4 sm:h-10 w-4 sm:w-10 bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow-lg transition-all duration-200"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEditBranch}
                        className="h-10 w-10 bg-[#F87D7D]/20 hover:bg-[#F87D7D]/30 text-white rounded-xl backdrop-blur-sm transition-all duration-200"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDeleteBranch}
                        disabled={deleteBranchMutation.isPending}
                        className="h-10 w-10 bg-white hover:bg-white hover:text-red-500 text-red-500 rounded-xl backdrop-blur-sm transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {editingBranchId !== branch._id && (
              <div className="flex gap-4 mt-6 pt-4 border-t border-white/20">
                <Badge
                  variant="outline"
                  className="border-white/50 text-white bg-white/10 font-semibold"
                >
                  {branch.locations?.length} Locations
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/50 text-white bg-white/10 font-semibold"
                >
                  {totalRooms} Rooms
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-md sm:text-xl font-bold flex items-center gap-3 text-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F87D7D] to-[#F87D7D]/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="h-5 w-5 text-white" />
                </div>
                Locations
                {/* <Badge
                  variant="outline"
                  className="border-[#F87D7D]/50 text-[#F87D7D] bg-[#F87D7D]/10 font-semibold"
                >
                  {branch.locations?.length} Total
                </Badge> */}
              </h4>
              {isEditable && (
                <AddLocationForBranchDialog
                  branchId={branch._id}
                  onLocationCreated={handleLocationCreated}
                  existingLocations={branch.locations || []}
                />
              )}
            </div>

            <div className="space-y-4">
              {enrichedLocations?.map((location) => (
                <div
                  key={location._id}
                  className="transform transition-all duration-200"
                >
                  <LocationCard
                    location={location}
                    isEditable={isEditable}
                    onLocationUpdate={handleLocationUpdate}
                    onLocationDelete={handleLocationDelete}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditable && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-gradient-to-br from-white to-red-50 border-red-200 max-w-[95vw] sm:max-w-md">
            <AlertDialogHeader>
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trash2 className="h-10 w-10 text-red-600" />
              </div>
              <AlertDialogTitle className="text-center text-2xl font-bold text-gray-900">
                Delete Branch?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-gray-600 text-lg leading-relaxed">
                This action cannot be undone. This will permanently delete the
                branch{" "}
                <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                  "{branch.name}"
                </span>{" "}
                and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="grid grid-cols-2 gap-3 items-center justify-center pt-6">
              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-lg font-semibold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteBranch}
                disabled={deleteBranchMutation.isPending}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-2 rounded-lg font-semibold shadow-lg"
              >
                {deleteBranchMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete Branch"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
