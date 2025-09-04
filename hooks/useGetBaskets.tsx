import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export interface User {
  _id: string;
  portNumber: string;
  fullName: string;
}

export interface Guest {
  _id: string;
  userId: User;
  familyId: string;
  isPrimaryGuest: boolean;
}

export interface Branch {
  _id: string;
  name: string;
}

export interface Staff {
  _id: string;
  fullName: string;
}

export interface Basket {
  _id: string;
  guestId: Guest;
  branchId?: Branch;
  locationIds: string[];
  staffId?: Staff;
  basket: any[]; // Empty array in your response, can be typed further if needed
  status: string;
  totalItems: number;
  deliveredItems: number;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Basket[];
    totalResults: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const fetchBaskets = async (): Promise<ApiResponse> => {
  const response = await api.get("/su-basket/list");
  return response.data;
};

export const useBaskets = () => {
  return useQuery({
    queryKey: ["baskets"],
    queryFn: fetchBaskets,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
