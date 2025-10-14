// useIncidents.ts
"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserId {
  _id: string;
  portNumber: string;
  fullName: string;
}

interface GuestId {
  _id: string;
  userId: UserId;
  familyId: string;
  isPrimaryGuest: boolean;
}

interface BranchId {
  _id: string;
  name: string;
}

interface StaffId {
  _id: string;
  fullName: string;
}

interface ApiIncident {
  _id: string;
  guestId: GuestId;
  branchId: BranchId;
  staffId: StaffId;
  incidentType: string;
  severity: string;
  description: string;
  location: string;
  witnesses: any[];
  evidence: any[];
  status: string;
  isActive: boolean;
  reportedAt: string;
  createdAt: string;
  updatedAt: string;
  locationIds?: string[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    results: ApiIncident[];
    totalResults: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UIIncident {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  reportedBy: string;
  assignedTo: string;
  branch: string;
  location: string;
  residentInvolved: string;
  dateReported: string;
  timeReported: string;
  dateResolved: string | null;
  timeResolved: string | null;
  category: string;
  actionsTaken: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  });
};

const fetchIncidents = async (): Promise<UIIncident[]> => {
  const response = await api.get<ApiResponse>("/incident/list?limit=1000");
  const apiIncidents = response.data.data.data;

  console.log("apiIncidents", apiIncidents);

  return apiIncidents.map((api: ApiIncident) => ({
    id: api._id,
    type: api?.incidentType,
    description: api.description,
    severity: api.severity?.toLowerCase(),
    status: api.status,
    evidence: api.evidence,
    reportedBy: api.staffId?.fullName,
    assignedTo: api.staffId?.fullName,
    branch: api.branchId?.name,
    branchId: api.branchId?._id,
    location: api.location,
    residentInvolved: api.guestId?.userId.fullName,
    dateReported: formatDate(api?.reportedAt),
    timeReported: new Date(api?.reportedAt).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    dateResolved: null,
    timeResolved: null,
    category: api.incidentType.toLowerCase(),
    actionsTaken: "",
  }));
};

export const useIncidents = () => {
  return useQuery<UIIncident[], Error>({
    queryKey: ["incidents"],
    queryFn: fetchIncidents,
  });
};
