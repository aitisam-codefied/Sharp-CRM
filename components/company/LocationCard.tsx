import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users } from "lucide-react";

interface Location {
  _id: string;
  name: string;
  rooms: Array<{
    _id: string;
    roomNumber: string;
    type: string;
    capacity: number;
    amenities: string[];
  }>;
}

export default function LocationCard({ location }: { location: Location }) {
  return (
    <div className="ml-6 p-3 bg-gray-50 rounded-lg">
      <h5 className="font-medium mb-2">{location.name}</h5>
      {location.rooms.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Rooms ({location.rooms.length}):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {location.rooms.map((room) => (
              <div key={room._id} className="p-2 bg-white rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Room {room.roomNumber}</p>
                    <p className="text-sm text-gray-600">{room.type}</p>
                    <p className="text-sm flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Capacity: {room.capacity}
                    </p>
                  </div>
                </div>
                {room.amenities.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="outline"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No rooms in this location</p>
      )}
    </div>
  );
}
