"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ServiceUser } from "@/lib/types";
import { useUpdateStaff } from "@/hooks/useUpdateStaff";

interface BasicInfoSectionProps {
  user: ServiceUser | null;
  onClose: () => void;
}

export function BasicInfoSection({ user, onClose }: BasicInfoSectionProps) {
  const { toast } = useToast();
  const updateStaff = useUpdateStaff();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<{
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
  }>({
    defaultValues: {
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (user?.user) {
      reset({
        fullName: user.user.fullName,
        emailAddress: user.user.emailAddress,
        phoneNumber: user.user.phoneNumber,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
  }) => {
    if (!user?.user?._id) return;

    const changedData: Partial<ServiceUser> = {};
    if (dirtyFields.fullName) changedData.fullName = data.fullName;
    if (dirtyFields.emailAddress) changedData.emailAddress = data.emailAddress;
    if (dirtyFields.phoneNumber) changedData.phoneNumber = data.phoneNumber;

    if (Object.keys(changedData).length === 0) {
      toast({
        title: "No Changes",
        description: "No basic information was changed.",
      });
      return;
    }

    updateStaff.mutate(
      { id: user.user._id, staffData: changedData },
      {
        onSuccess: () => {
          toast({
            title: "User Updated",
            description: "User basic info updated successfully.",
          });
          onClose();
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.error ||
            error.message ||
            "Failed to update user basic info.";
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="border p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address</Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="user@example.com"
              {...register("emailAddress", { required: "Email is required" })}
            />
            {errors.emailAddress && (
              <p className="text-red-500 text-xs">
                {errors.emailAddress.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+1234567890"
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={updateStaff.isPending || !isDirty}>
            {updateStaff.isPending ? "Updating..." : "Update Basic Info"}
          </Button>
        </div>
      </form>
    </div>
  );
}
