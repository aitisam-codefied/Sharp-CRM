import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchReports = async () => {
  const response = await api.get("/report?limit=100");
  return response.data.data.results; // Return only the results array
};

export const useGetReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
  });
};
