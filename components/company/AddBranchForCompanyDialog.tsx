"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCreateBranch } from "@/hooks/useCreateBranch";
import { Plus, Trash2 } from "lucide-react";

export const ROOM_PREFERENCE_TYPES = {
  SINGLE: "Single Room (Capacity 1)",
  DOUBLE: "Double Room (Capacity 2)",
  TWIN: "Twin Room (Capacity 2 - 2 single beds)",
  TRIPLE: "Triple Room (Capacity 3)",
  QUAD: "Quad Room (Capacity 4)",
  QUINTUPLE: "Quintuple Room (Capacity 5)",
};

const ROOM_AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Private Bathroom",
  "Shared Bathroom",
  "TV",
  "Refrigerator",
  "Microwave",
  "Desk",
  "Wardrobe",
  "Balcony",
  "Kitchen Access",
  "Laundry Access",
];

interface Room {
  roomNumber: string;
  type: string;
  amenities: string[];
}

interface Location {
  name: string;
  rooms: Room[];
}

interface Branch {
  name: string;
  address: string;
  locations: Location[];
}

export default function AddBranchForCompanyDialog({
  companyId,
  existingBranches,
  onBranchCreated,
}: {
  companyId: string;
  existingBranches: { _id: string; name: string }[];
  onBranchCreated: (branch: {
    _id: string;
    name: string;
    address: string;
    locations: Location[];
  }) => void;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [branch, setBranch] = useState<Branch>({
    name: "",
    address: "",
    locations: [
      {
        name: "",
        rooms: [
          {
            roomNumber: "",
            type: ROOM_PREFERENCE_TYPES.SINGLE,
            amenities: [],
          },
        ],
      },
    ],
  });
  const { toast } = useToast();
  const { mutate, isPending } = useCreateBranch();

  const [branchNameError, setBranchNameError] = useState<string | null>(null);

  const updateBranch = (field: keyof Branch, value: string) => {
    if (field === "name") {
      const exists = existingBranches.some(
        (b) => b.name.trim().toLowerCase() === value.trim().toLowerCase()
      );
      if (exists) {
        setBranchNameError(
          "A branch with this name already exists in this company."
        );
      } else {
        setBranchNameError(null);
      }
    }

    setBranch((prev) => ({ ...prev, [field]: value }));
  };

  // const updateBranch = (field: keyof Branch, value: string) => {
  //   setBranch((prev) => ({ ...prev, [field]: value }));
  // };

  const addLocation = () => {
    setBranch((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          name: "",
          rooms: [
            {
              roomNumber: "",
              type: ROOM_PREFERENCE_TYPES.SINGLE,
              amenities: [],
            },
          ],
        },
      ],
    }));
  };

  const updateLocation = (locationIndex: number, value: string) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        name: value,
      };
      return { ...prev, locations: updatedLocations };
    });
  };

  const removeLocation = (locationIndex: number) => {
    setBranch((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== locationIndex),
    }));
  };

  const addRoom = (locationIndex: number) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        rooms: [
          ...updatedLocations[locationIndex].rooms,
          {
            roomNumber: "",
            type: ROOM_PREFERENCE_TYPES.SINGLE,
            amenities: [],
          },
        ],
      };
      return { ...prev, locations: updatedLocations };
    });
  };

  const updateRoom = (
    locationIndex: number,
    roomIndex: number,
    field: keyof Room,
    value: any
  ) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      const updatedRooms = [...updatedLocations[locationIndex].rooms];
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        [field]: value,
      };
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        rooms: updatedRooms,
      };
      return { ...prev, locations: updatedLocations };
    });
  };

  const removeRoom = (locationIndex: number, roomIndex: number) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        rooms: updatedLocations[locationIndex].rooms.filter(
          (_, i) => i !== roomIndex
        ),
      };
      return { ...prev, locations: updatedLocations };
    });
  };

  const toggleAmenity = (
    locationIndex: number,
    roomIndex: number,
    amenity: string
  ) => {
    setBranch((prev) => {
      const updatedLocations = [...prev.locations];
      const updatedRooms = [...updatedLocations[locationIndex].rooms];
      const room = { ...updatedRooms[roomIndex] };
      const amenities = [...room.amenities];
      const amenityIndex = amenities.indexOf(amenity);

      if (amenityIndex > -1) {
        amenities.splice(amenityIndex, 1);
      } else {
        amenities.push(amenity);
      }

      room.amenities = amenities;
      updatedRooms[roomIndex] = room;
      updatedLocations[locationIndex] = {
        ...updatedLocations[locationIndex],
        rooms: updatedRooms,
      };

      return {
        ...prev,
        locations: updatedLocations,
      };
    });
  };

  const handleSubmit = () => {
    if (!branch.name || !branch.address) {
      toast({
        title: "Error",
        description: "Branch name and address are required.",
        variant: "destructive",
      });
      return;
    }

    const branchData = {
      companyId,
      branch: {
        name: branch.name,
        address: branch.address,
        locations: branch.locations.map((location) => ({
          name: location.name,
          rooms: location.rooms.map((room) => ({
            roomNumber: room.roomNumber,
            type: room.type,
            amenities: room.amenities.length > 0 ? room.amenities : [""],
          })),
        })),
      },
    };

    mutate(branchData, {
      onSuccess: (data) => {
        const createdBranch = data.createdBranch;
        toast({
          title: "Branch Created Successfully",
        });

        onBranchCreated(createdBranch);
        setIsAddDialogOpen(false);
        setBranch({
          name: "",
          address: "",
          locations: [
            {
              name: "",
              rooms: [
                {
                  roomNumber: "",
                  type: ROOM_PREFERENCE_TYPES.SINGLE,
                  amenities: [],
                },
              ],
            },
          ],
        });
      },

      onError: (error: any) => {
        const message =
          error.response?.data?.error ||
          error.message ||
          "Failed to create branch.";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      },
    });
  };

  const isFormValid = () => {
    if (branchNameError) return false; // 👈 duplicate branch prevent
    if (!branch.name.trim() || !branch.address.trim()) return false;

    for (const location of branch.locations) {
      if (!location.name.trim()) return false;

      for (const room of location.rooms) {
        if (!room.roomNumber.trim() || !room.type.trim()) return false;
        if (room.amenities.length === 0) return false;
      }
    }

    return true;
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Branch</DialogTitle>
          <DialogDescription>
            Enter the details for the new branch
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="branch-name">Branch Name *</Label>
            <Input
              id="branch-name"
              value={branch.name}
              onChange={(e) => updateBranch("name", e.target.value)}
              placeholder="Enter branch name"
            />
            {branchNameError && (
              <p className="text-red-600 text-sm">{branchNameError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-address">Branch Address *</Label>
            <Textarea
              id="branch-address"
              value={branch.address}
              onChange={(e) => updateBranch("address", e.target.value)}
              placeholder="Enter complete branch address"
              rows={3}
            />
          </div>
          <div className="space-y-4">
            <Label>Locations</Label>
            {branch.locations.map((location, locationIndex) => (
              <div
                key={locationIndex}
                className="space-y-4 border p-4 rounded-md"
              >
                <div className="flex gap-2 items-center">
                  <Input
                    value={location.name}
                    onChange={(e) =>
                      updateLocation(locationIndex, e.target.value)
                    }
                    placeholder="e.g., Floor 1, East Wing, Reception"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLocation(locationIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {location.rooms.map((room, roomIndex) => (
                    <div
                      key={roomIndex}
                      className="space-y-4 border p-4 rounded-md bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <Label>Room {roomIndex + 1}</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRoom(locationIndex, roomIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Room Number *</Label>
                          <Input
                            value={room.roomNumber}
                            onChange={(e) =>
                              updateRoom(
                                locationIndex,
                                roomIndex,
                                "roomNumber",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 101, A-1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Room Type *</Label>
                          <Select
                            value={room.type}
                            onValueChange={(value) =>
                              updateRoom(
                                locationIndex,
                                roomIndex,
                                "type",
                                value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(ROOM_PREFERENCE_TYPES).map(
                                (type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Amenities</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {ROOM_AMENITIES.map((amenity) => (
                            <div
                              key={amenity}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`amenity-${locationIndex}-${roomIndex}-${amenity}`}
                                checked={room.amenities.includes(amenity)}
                                onCheckedChange={() =>
                                  toggleAmenity(
                                    locationIndex,
                                    roomIndex,
                                    amenity
                                  )
                                }
                              />
                              <Label
                                htmlFor={`amenity-${locationIndex}-${roomIndex}-${amenity}`}
                                className="text-sm font-normal"
                              >
                                {amenity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addRoom(locationIndex)}
                    className="w-full border-dashed border-2 h-10"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addLocation}
              className="w-full border-dashed border-2 h-10"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isFormValid()}>
            {isPending ? "Adding..." : "Add Branch"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
