// hooks/useCompanies.ts
"use client"

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuth } from "@/components/providers/auth-provider";

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

export const useCompanies = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["companies"],
    queryFn: async (): Promise<Company[]> => {
      const isAdmin = user?.roles[0].name === "Admin";

      const res = isAdmin ? await api.get("/company/list") : [];
      
      if (res.data.success) {
        return res.data.companies;
      } else {
        throw new Error("Failed to fetch companies");
      }
    },
  });
};
