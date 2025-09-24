// hooks/useFoodFeedbacks.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "@/lib/axios";

// types/foodFeedback.ts
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

export interface FoodFeedback {
  _id: string;
  guestId: Guest;
  branchId: Branch;
  locationIds: string[];
  staffId: Staff;
  weekStartDate: string;
  weekEndDate: string;
  overallRating: number;
  comments: string;
  guestSatisfaction: string;
  suggestions: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: FoodFeedback[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface DisplayFeedback {
  id: string;
  residentId: string;
  residentName: string;
  room: string;
  branch: string;
  mealType: string;
  date: string;
  time: string;
  ratings: {
    taste: number;
    freshness: number;
    portion: number;
    temperature: number;
    overall: number;
  };
  comments: string;
  staffMember: string;
  dietary: string[];
}

const fetchFoodFeedbacks = async (): Promise<FoodFeedback[]> => {
  const url = "/food-feedback/list?limit=50"; // Increased limit to fetch more/all results in one go
  const response = await api.get<ApiResponse>(url);
  return response?.data?.data?.results ?? [];
};

export const useFoodFeedbacks = () => {
  return useQuery<FoodFeedback[], Error>({
    queryKey: ["foodFeedbacks"],
    queryFn: fetchFoodFeedbacks,
  });
};
