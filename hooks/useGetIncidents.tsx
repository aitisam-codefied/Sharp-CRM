// useIncidents.ts
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

const fetchIncidents = async (): Promise<UIIncident[]> => {
  const response = await api.get<ApiResponse>("/incident/list?limit=1000");
  const apiIncidents = response.data.data.data;

  return apiIncidents.map((api: ApiIncident) => ({
    id: api._id,
    title: `${api.incidentType} at ${api.location}`,
    description: api.description,
    severity: api.severity.toLowerCase(),
    status: api.status.toLowerCase(),
    reportedBy: api.staffId.fullName,
    assignedTo: api.staffId.fullName,
    branch: api.branchId.name,
    location: api.location,
    residentInvolved: api.guestId.userId.fullName,
    dateReported: new Date(api.reportedAt).toISOString().split("T")[0],
    timeReported: new Date(api.reportedAt).toLocaleTimeString("en-GB", {
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
