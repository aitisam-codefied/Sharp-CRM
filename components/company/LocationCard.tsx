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
} from "lucide-react";
import { useEffect } from "react";

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
}: {
  location: Location;
  isEditable: boolean;
}) {
  // useEffect(() => {
  //   console.log("locationssss", location);
  // });

  return (
    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h5 className="text-xl font-bold text-gray-900 mb-1">
                {location.name}
              </h5>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building className="h-4 w-4 text-indigo-500" />
                  {location.rooms?.length} rooms
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-[#F87D7D]/50 text-[#F87D7D] bg-[#F87D7D]/10 font-semibold"
          >
            {location.rooms?.length} Rooms
          </Badge>
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
  );
}
