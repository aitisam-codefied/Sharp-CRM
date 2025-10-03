import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, Coffee, Monitor, Car, Zap, Edit, Trash2 } from "lucide-react";

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

interface RoomCardProps {
  room: {
    _id: string;
    roomNumber: string;
    type: string;
    amenities: string[];
  };
  isEditable: boolean;
  onEditRoom: () => void;
  onDeleteRoom: () => void;
}

export default function RoomCard({
  room,
  isEditable,
  onEditRoom,
  onDeleteRoom,
}: RoomCardProps) {
  const roomTypeColor = getRoomTypeColor(room.type);

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200  overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <h6 className="font-bold text-gray-900 text-sm sm:text-lg">
              Room {room.roomNumber}
            </h6>
            {isEditable && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEditRoom}
                  className="h-8 w-8 hover:bg-amber-100 hover:text-amber-600"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDeleteRoom}
                  className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className={`${roomTypeColor} text-xs font-medium mt-1 w-full`}>
            {room.type}
          </div>

          <div className="bg-blue-100 text-blue-700 border-blue-200 w-fit text-xs font-medium rounded-xl px-3 py-1.5 shadow-sm mt-1">
            {room.status}
          </div>
          <div className="text-xs text-gray-700 mt-1">
            Current Occupancy: {room.currentOccupancy}
          </div>
          {Number(room.currentKids) > 0 && (
            <div className="text-xs text-gray-700 mt-1">
              Current Kids In This Room: {room.currentKids}
            </div>
          )}
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
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-200 w-fit text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 shadow-sm"
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
}
