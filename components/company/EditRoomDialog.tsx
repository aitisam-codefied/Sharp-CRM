"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { ROOM_PREFERENCE_TYPES } from "./AddRoomForLocationDialog";
import { useUpdateRoom } from "@/hooks/useUpdateRoom";

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

interface EditRoomDialogProps {
  room: { _id: string; roomNumber: string; type: string; amenities: string[] };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomUpdated: (updatedRoom: {
    _id: string;
    roomNumber: string;
    type: string;
    amenities: string[];
  }) => void;
}

export default function EditRoomDialog({
  room,
  open,
  onOpenChange,
  onRoomUpdated,
}: EditRoomDialogProps) {
  const [form, setForm] = useState(room);
  const { toast } = useToast();
  const { mutate, isPending } = useUpdateRoom();

  // Populate form when dialog opens
  useEffect(() => {
    setForm(room);
  }, [room]);

  const updateField = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleSubmit = () => {
    if (!form.roomNumber || !form.type) {
      toast({
        title: "Error",
        description: "Room number and type are required.",
        variant: "destructive",
      });
      return;
    }

    mutate(
      { roomId: room._id, roomData: form },
      {
        onSuccess: (data) => {
          toast({ title: "Room updated successfully" });
          onRoomUpdated({
            _id: data.data._id,
            roomNumber: data.data.roomNumber,
            type: data.data.type,
            amenities: data.data.amenities,
          });
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update room",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>Modify the details of this room</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Room Number */}
          <div className="space-y-2">
            <Label>Room Number *</Label>
            <Input
              value={form.roomNumber}
              onChange={(e) => updateField("roomNumber", e.target.value)}
            />
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <Label>Room Type *</Label>
            <Select
              value={form.type}
              onValueChange={(value) => updateField("type", value)}
            >
              <SelectTrigger>
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

          {/* Amenities */}
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-3 gap-3">
              {ROOM_AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    checked={form.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label className="text-sm font-normal">{amenity}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Updating..." : "Update Room"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
