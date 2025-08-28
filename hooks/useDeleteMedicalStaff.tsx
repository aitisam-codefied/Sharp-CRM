import { useState } from "react";
import axios from "axios";
import api from "@/lib/axios";

export const useDeleteMedicalStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStaff = async (staffId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/medical/${staffId}`);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete staff member");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteStaff, isLoading, error };
};
