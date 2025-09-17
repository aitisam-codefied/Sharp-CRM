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
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { Plus } from "lucide-react";

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

interface AddRoomForLocationDialogProps {
  locationId: string;
  existingRooms: { _id: string; roomNumber: string }[];
  onRoomCreated: (room: {
    _id: string;
    roomNumber: string;
    type: string;
    amenities: string[];
  }) => void;
}

export default function AddRoomForLocationDialog({
  locationId,
  existingRooms,
  onRoomCreated,
}: AddRoomForLocationDialogProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [room, setRoom] = useState<Room>({
    roomNumber: "",
    type: ROOM_PREFERENCE_TYPES.SINGLE,
    capacity: 1,
    amenities: [],
  });
  const { toast } = useToast();
  const { mutate, isPending } = useCreateRoom();

  const [roomNumberError, setRoomNumberError] = useState<string | null>(null);

  const updateRoom = (field: keyof Room, value: string) => {
    if (field === "roomNumber") {
      if (value.length > 10) {
        setRoomNumberError("Room number cannot exceed 10 characters.");
      } else if (
        existingRooms.some(
          (r) =>
            r.roomNumber.trim().toLowerCase() === value.trim().toLowerCase()
        )
      ) {
        setRoomNumberError("This room number already exists in this location.");
      } else {
        setRoomNumberError(null);
      }
    }

    setRoom((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    if (roomNumberError) return false;
    if (!room.roomNumber.trim() || !room.type.trim()) return false;
    if (room.amenities.length === 0) return false;
    return true;
  };

  const toggleAmenity = (amenity: string) => {
    setRoom((prev) => {
      const amenities = [...prev.amenities];
      const amenityIndex = amenities.indexOf(amenity);

      if (amenityIndex > -1) {
        amenities.splice(amenityIndex, 1);
      } else {
        amenities.push(amenity);
      }

      return {
        ...prev,
        amenities,
      };
    });
  };

  const handleSubmit = () => {
    if (!room.roomNumber || !room.type) {
      toast({
        title: "Error",
        description: "Room number and type are required.",
        variant: "destructive",
      });
      return;
    }

    const roomData = {
      locationId,
      roomData: {
        roomNumber: room.roomNumber,
        type: room.type,
        capacity: room.capacity,
        amenities: room.amenities.length > 0 ? room.amenities : [""],
      },
    };

    mutate(roomData, {
      onSuccess: (data) => {
        console.log("Created room response:", data);
        toast({
          title: "Room Created Successfully",
        });
        onRoomCreated({
          _id: data.room._id,
          roomNumber: data.room.roomNumber,
          type: data.room.type,
          amenities: data.room.amenities,
        });
        setIsAddDialogOpen(false);
        setRoom({
          roomNumber: "",
          type: ROOM_PREFERENCE_TYPES.SINGLE,
          capacity: 1,
          amenities: [],
        });
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.error ||
          error.message ||
          "Failed to create room.";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#F87D7D] hover:bg-[#F87D7D]/90">
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-[#F87D7D]/10 border-[#F87D7D]/20">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Enter the details for the new room
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="room-number">Room Number *</Label>
            <Input
              id="room-number"
              value={room.roomNumber}
              onChange={(e) => updateRoom("roomNumber", e.target.value)}
              placeholder="e.g., 101, A-1"
              className="border-[#F87D7D]/50 focus:border-[#F87D7D] focus:ring-[#F87D7D]/30"
            />
            {roomNumberError && (
              <p className="text-red-600 text-sm">{roomNumberError}</p>
            )}
          </div>
          <div>
            <Label>Room Type *</Label>
            <Select
              value={room.type}
              onValueChange={(value) => {
                updateRoom("type", value);
                const autoCapacity = ROOM_TYPE_CAPACITY[value];
                if (autoCapacity) {
                  updateRoom("capacity", String(autoCapacity));
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
          <div className="hidden space-y-2">
            <Label>Room Capacity *</Label>
            <Select value={room.capacity} disabled>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder="Auto-selected" />
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
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-3 gap-3">
              {ROOM_AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={room.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label
                    htmlFor={`amenity-${amenity}`}
                    className="text-sm font-normal"
                  >
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(false)}
            disabled={isPending}
            className="border-[#F87D7D]/50 text-[#F87D7D] hover:bg-[#F87D7D]/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !isFormValid()}
            className="bg-[#F87D7D] hover:bg-[#F87D7D]/90"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </div>
            ) : (
              "Add Room"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
