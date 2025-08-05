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
  name: string;
  rooms: Room[];
}

export interface Branch {
  _id: string;
  companyId: {
    _id: string;
    name: string;
  };
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

export const useBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: async (): Promise<Branch[]> => {
      const res = await api.get("/branch/list");
      if (res.data.success) {
        return res.data.branches;
      } else {
        throw new Error("Failed to fetch branches");
      }
    },
  });
};
