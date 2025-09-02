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
import { useCreateLocation } from "@/hooks/useCreateLocation";
import { Plus, Trash2 } from "lucide-react";

export const ROOM_PREFERENCE_TYPES = {
  SINGLE: "Single Room (Capacity 1)",
  DOUBLE: "Double Room (Capacity 2)",
  TWIN: "Twin Room (Capacity 2 - 2 single beds)",
  TRIPLE: "Triple Room (Capacity 3)",
  QUAD: "Quad Room (Capacity 4)",
  QUINTUPLE: "Quintuple Room (Capacity 5)",
};

const ROOM_TYPE_CAPACITY: Record<string, number> = {
  "Single Room (Capacity 1)": 1,
  "Double Room (Capacity 2)": 2,
  "Twin Room (Capacity 2 - 2 single beds)": 2,
  "Triple Room (Capacity 3)": 3,
  "Quad Room (Capacity 4)": 4,
  "Quintuple Room (Capacity 5)": 5,
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
  capacity: any;
  amenities: string[];
}

interface Location {
  name: string;
  rooms: Room[];
}

interface AddLocationForBranchDialogProps {
  branchId: string;
  existingLocations: Array<{ _id: string; name: string }>;
  onLocationCreated: (location: {
    _id: string;
    name: string;
    rooms: Array<{
      _id: string;
      roomNumber: string;
      type: string;
      amenities: string[];
    }>;
  }) => void;
}

export default function AddLocationForBranchDialog({
  branchId,
  onLocationCreated,
  existingLocations,
}: AddLocationForBranchDialogProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [location, setLocation] = useState<Location>({
    name: "",
    rooms: [
      {
        roomNumber: "",
        capacity: 1,
        type: ROOM_PREFERENCE_TYPES.SINGLE,
        amenities: [],
      },
    ],
  });
  const { toast } = useToast();
  const { mutate, isPending } = useCreateLocation();
  const [locationNameError, setLocationNameError] = useState<string | null>(
    null
  );

  const updateLocationName = (value: string) => {
    setLocation((prev) => ({ ...prev, name: value }));

    // ✅ Check duplicate name
    if (
      existingLocations.some(
        (loc: any) =>
          loc.name.trim().toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      setLocationNameError(
        "A location with this name already exists in this branch."
      );
    } else {
      setLocationNameError(null);
    }
  };

  // const updateLocationName = (value: string) => {
  //   setLocation((prev) => ({ ...prev, name: value }));
  // };

  const addRoom = () => {
    setLocation((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          roomNumber: "",
          type: ROOM_PREFERENCE_TYPES.SINGLE,
          capacity: 1,
          amenities: [],
        },
      ],
    }));
  };

  const updateRoom = (
    roomIndex: number,
    field: keyof Room,
    value: string | number
  ) => {
    setLocation((prev) => {
      const updatedRooms = [...prev.rooms];
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        [field]: value,
      };
      return { ...prev, rooms: updatedRooms };
    });
  };

  const removeRoom = (roomIndex: number) => {
    setLocation((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== roomIndex),
    }));
  };

  const toggleAmenity = (roomIndex: number, amenity: string) => {
    setLocation((prev) => {
      const updatedRooms = [...prev.rooms];
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

      return {
        ...prev,
        rooms: updatedRooms,
      };
    });
  };

  const handleSubmit = () => {
    if (!location.name) {
      toast({
        title: "Error",
        description: "Location name is required.",
        variant: "destructive",
      });
      return;
    }

    if (location.rooms.some((room) => !room.roomNumber || !room.type)) {
      toast({
        title: "Error",
        description: "All rooms must have a room number and capacity.",
        variant: "destructive",
      });
      return;
    }

    const locationData = {
      branchId,
      locations: [
        {
          name: location.name,
          rooms: location.rooms.map((room) => ({
            roomNumber: room.roomNumber,
            type: room.type,
            capacity: room.capacity,
            amenities: room.amenities.length > 0 ? room.amenities : [""],
          })),
        },
      ],
    };

    // ✅ Log the data being sent
    console.log("Sending location data to API:", locationData);

    mutate(locationData, {
      onSuccess: (data) => {
        // ✅ Log the API response
        console.log("Location created successfully:", data);

        const createdLocation = data.locations[0];
        // const createdRooms = data.locations.rooms;
        toast({
          title: "Location Created Successfully",
        });
        if (createdLocation) {
          onLocationCreated({
            _id: createdLocation._id,
            name: createdLocation.name,
            rooms: createdLocation.rooms,
          });
        }
        setIsAddDialogOpen(false);
        setLocation({
          name: "",
          rooms: [
            {
              roomNumber: "",
              type: ROOM_PREFERENCE_TYPES.SINGLE,
              capacity: 1,
              amenities: [],
            },
          ],
        });
      },

      onError: (error: any) => {
        const message =
          error.response?.data?.error ||
          error.message ||
          "Failed to create Location.";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      },
    });
  };

  const isFormValid =
    location.name.trim() !== "" &&
    !locationNameError &&
    location.rooms.every(
      (room) =>
        room.roomNumber.trim() !== "" &&
        room.type.trim() !== "" &&
        room.amenities.length > 0
    );

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Enter the details for the new location
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="location-name">Location Name *</Label>
            <Input
              id="location-name"
              value={location.name}
              onChange={(e) => updateLocationName(e.target.value)}
              placeholder="e.g., Floor 1, East Wing"
            />
            {locationNameError && (
              <p className="text-red-500 text-sm">{locationNameError}</p>
            )}
          </div>
          <div className="space-y-4">
            <Label>Rooms</Label>
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
                    onClick={() => removeRoom(roomIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Room Number *</Label>
                    <Input
                      value={room.roomNumber}
                      onChange={(e) =>
                        updateRoom(roomIndex, "roomNumber", e.target.value)
                      }
                      placeholder="e.g., 101, A-1"
                    />
                  </div>
                  <div>
                    <Label>Room Type *</Label>
                    <Select
                      value={room.type}
                      onValueChange={(value) => {
                        updateRoom(roomIndex, "type", value);

                        // Auto-update capacity if mapping exists
                        const autoCapacity = ROOM_TYPE_CAPACITY[value];
                        if (autoCapacity) {
                          updateRoom(
                            roomIndex,
                            "capacity",
                            String(autoCapacity)
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ROOM_PREFERENCE_TYPES).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Room Capacity *</Label>
                    <Select
                      value={room.capacity}
                      onValueChange={(value) =>
                        updateRoom(roomIndex, "capacity", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
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
                          id={`amenity-${roomIndex}-${amenity}`}
                          checked={room.amenities.includes(amenity)}
                          onCheckedChange={() =>
                            toggleAmenity(roomIndex, amenity)
                          }
                        />
                        <Label
                          htmlFor={`amenity-${roomIndex}-${amenity}`}
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
              onClick={addRoom}
              className="w-full border-dashed border-2 h-10"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Room
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
          <Button onClick={handleSubmit} disabled={isPending || !isFormValid}>
            {isPending ? "Adding..." : "Add Location"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
