"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Edit, Trash2, MapPin, Home } from "lucide-react";
import LocationCard from "./LocationCard";

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
}: {
  branch: Branch;
  companyId: string;
  onBranchUpdate: (updatedBranch: Branch) => void;
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
        setDeleteDialogOpen(false);
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

  return (
    <>
      <Card key={branch._id}>
        <CardHeader className="pb-3 flex justify-between items-start">
          <div className="flex items-center justify-between w-full">
            <div>
              {editingBranchId === branch._id ? (
                <>
                  <Input
                    value={editBranchData.name}
                    onChange={(e) =>
                      setEditBranchData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="mb-1"
                  />
                  <Input
                    value={editBranchData.address}
                    onChange={(e) =>
                      setEditBranchData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </>
              ) : (
                <>
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <p className="text-gray-600">{branch.address}</p>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingBranchId === branch._id ? (
                <button
                  className="text-green-600 hover:text-green-700"
                  onClick={handleSaveEdit}
                  disabled={updateBranchMutation.isPending}
                >
                  Update
                </button>
              ) : (
                <Button variant="ghost" size="icon" onClick={handleEditBranch}>
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700"
                onClick={handleDeleteBranch}
                disabled={deleteBranchMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Home className="h-4 w-4" />
              Locations ({branch.locations.length})
            </h4>
            {branch.locations.map((location) => (
              <LocationCard key={location._id} location={location} />
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              branch "{branch.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBranch}
              disabled={deleteBranchMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteBranchMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
