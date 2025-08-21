"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

const createBranch = async (branchData: any) => {
  const response = await api.post("/branch/create", branchData);
  return response.data;
};

export const useCreateBranch = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Branch created successfully!",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to create branch.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    // onError: (error: any) => {
    //   toast({
    //     title: "Error",
    //     description: error.response?.data?.message || "Failed to create branch",
    //     variant: "destructive",
    //   });
    // },
  });
};
