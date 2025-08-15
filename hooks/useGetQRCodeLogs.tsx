import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface QRCodeLog {
  _id: string;
  staffId: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
  };
  qrCodeId: { _id: string; type: string; code: string };
  branchId: { _id: string; name: string; address: string };
  startedAt: string;
  durationMaxLimitMinutes: number;
  isActive: boolean;
  actions: {
    actionType: string;
    timestamp: string;
    notes: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const useGetQRCodeLogs = () => {
  return useQuery<QRCodeLog[], Error>({
    queryKey: ["qrCodeLogs"],
    queryFn: async () => {
      const response = await api.get("/qr-code-logs/list");
      if (!response.data.success) {
        throw new Error("Failed to fetch QR code logs");
      }
      return response.data.results;
    },
  });
};
