// hooks/useOccupancyAgreements.ts
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Interfaces based on API response
interface User {
  _id: string;
  portNumber: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
}

interface FamilyRoom {
  roomId: string;
  locationId: string;
  branchId: string;
  _id: string;
}

interface Guest {
  _id: string;
  userId: User;
  familyId: string;
  isPrimaryGuest: boolean;
  primaryGuestId: string | null;
  familyRooms: FamilyRoom[];
}

interface Branch {
  _id: string;
  name: string;
}

interface Staff {
  _id: string;
  username: string;
  fullName: string;
}

interface Term {
  clause: string;
  description: string;
  acknowledged: boolean;
  _id: string;
}

interface FamilyDependant {
  id: string;
  userId: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  portNumber: string;
  isPrimaryGuest: boolean;
  isRequested?: boolean;
}

interface PrimaryUser extends User {
  familyId: string;
  dependants: FamilyDependant[];
}

interface PrimaryGuest {
  _id: string;
  userId: string;
  isPrimaryGuest: boolean;
}

interface Family {
  familyId: string;
  portNumber: string;
  primaryUser: PrimaryUser;
  primaryGuest: PrimaryGuest;
  dependants: FamilyDependant[];
  isDependant: boolean;
  isPrimaryGuest: boolean;
  dependsOnUserId: string;
}

interface OccupancyAgreement {
  _id: string;
  guestId: Guest | null;
  branchId: Branch;
  locationIds: string[];
  staffId: Staff;
  documentType: string;
  title: string;
  content: string;
  terms: Term[];
  status: string;
  expiresAt: string;
  previousWarnings: any[];
  documentUrl: string;
  notes: string;
  isActive: boolean;
  issuedAt: string;
  attachments: any[];
  createdAt: string;
  updatedAt: string;
  portNumber: string | null;
  familyId?: string;
  family?: Family;
}

interface ApiResponseData {
  success: boolean;
  message: string;
  data: OccupancyAgreement[];
  totalResults: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiResponseData;
}

export const useOccupancyAgreements = () => {
  return useQuery<ApiResponse>({
    queryKey: ["occupancy-agreements"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse>("/occupancy-agreement/list");
      return data;
    },
  });
};
