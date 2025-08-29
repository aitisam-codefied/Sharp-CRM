// hooks/useMedicalStaff.ts
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface MedicalStaffResponse {
  results: {
    _id: string;
    branches: string[];
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

const fetchMedicalStaff = async (limit: number, status?: string) => {
  const url = `/medical/list?page=1&limit=${limit}${
    status ? `&status=${status}` : ""
  }`;
  const response = await api.get<{
    success: boolean;
    data: MedicalStaffResponse;
  }>(url);
  return response.data.data;
};

export const useMedicalStaff = (limit: number, status?: string) => {
  return useQuery({
    queryKey: ["medicalStaff", limit, status],
    queryFn: () => fetchMedicalStaff(limit, status),
  });
};
