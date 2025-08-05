// hooks/useCompanies.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  amenities: string[];
  capacity: number;
}

export interface Location {
  _id: string;
  branchId: string;
  name: string;
  rooms: Room[];
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
  locations: Location[];
}

export interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Branch[];
  createdAt: string;
  updatedAt: string;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async (): Promise<Location[]> => {
      const res = await api.get("/location/list");
      if (res.data.success) {
        return res.data.locations;
      } else {
        throw new Error("Failed to fetch locations");
      }
    },
  });
};
