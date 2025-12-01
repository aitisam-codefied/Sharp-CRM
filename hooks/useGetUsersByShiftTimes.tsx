import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface UserByShiftTime {
  _id: string;
  fullName: string;
  username: string;
  emailAddress: string;
  phoneNumber: string;
  portNumber: string;
  roles: Array<{
    _id: string;
    name: string;
  }>;
  shiftDetails: {
    start: string;
    end: string;
    defaultBreakMins: number;
    allowedEarlyMins: number;
  };
  branch: {
    _id: string;
    name: string;
  };
}

export interface UsersByShiftTimesResponse {
  success: boolean;
  totalCount: number;
  shiftStartTime: string;
  shiftEndTime: string;
  branchId: string;
  users: UserByShiftTime[];
}

export const useGetUsersByShiftTimes = () => {
  return useQuery<UsersByShiftTimesResponse>({
    queryKey: ["usersByShiftTimes"],
    queryFn: async () => {
      const response = await api.get("/user/by-shift-times");
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

