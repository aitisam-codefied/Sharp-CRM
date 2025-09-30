"use client";

import { use, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useUpdateGuest } from "@/hooks/useUpdateGuest";
import { ServiceUser, Branch } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { SUPPORT_SERVICE_TYPES, DIETARY_REQUIREMENT_TYPES } from "./GuestForm";
import { ROOM_PREFERENCE_TYPES } from "../AddBranchDialog";
import { ContactFields2 } from "./ContactFields2";
import { ConsentFields2 } from "./ConsentFields2";
import { DocumentFields2 } from "./DocumentFields2";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";

interface GuestDetailsSectionProps {
  user: ServiceUser | null;
  branches: Branch[];
  nationalities: string[];
  onClose: () => void;
}

export function GuestDetailsSection({
  user,
  branches,
  nationalities,
  onClose,
}: GuestDetailsSectionProps) {
  const { toast } = useToast();
  const updateGuest = useUpdateGuest();
  const [branchChanged, setBranchChanged] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<ServiceUser & { location: { _id: string } }>({
    defaultValues: {
      _id: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      language: "",
      address: "",
      emergencyContacts: [],
      medicalCondition: "",
      allergies: "",
      currentMedications: "",
      additionalNotes: "",
      dietaryRequirements: [],
      supportServices: [],
      priorityLevel: "",
      branch: {
        _id: "",
        companyId: { _id: "", name: "" },
        name: "",
        address: "",
      },
      roomTypePreference: "",
      assignedRoom: { _id: "", roomNumber: "", type: "" },
      checkInDate: "",
      consentAccuracy: false,
      consentDataProcessing: false,
      consentDataRetention: false,
      signature: "",
      documents: [],
      removal: { status: "" },
    },
  });

  const initialBranch = user?.branch?._id || "";

  useEffect(() => {
    if (user) {
      reset({
        _id: user._id,
        dateOfBirth: user.profile?.dateOfBirth
          ? new Date(user.profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: user.profile?.gender?.toLowerCase() || "",
        nationality: user.profile?.nationality?.toLowerCase() || "",
        language: user.profile?.language?.toLowerCase() || "",
        address: user.profile?.address || "",
        emergencyContacts: user.profile?.emergencyContacts || [],
        medicalCondition: user.profile?.medicalCondition || "",
        allergies: user.profile?.allergies || "",
        currentMedications: user.profile?.currentMedications || "",
        additionalNotes: user.profile?.additionalNotes || "",
        dietaryRequirements: user.profile?.dietaryRequirements || [],
        supportServices: user.profile?.supportServices || [],
        priorityLevel: user.priorityLevel || "",
        branch: user.branch || {
          _id: "",
          companyId: { _id: "", name: "" },
          name: "",
          address: "",
        },
        assignedRoom: user.assignedRooms?.[0] || {
          _id: "",
          roomNumber: "",
          type: "",
        },
        roomTypePreference: user.profile?.roomTypePreference || "",
        checkInDate: user.checkInDate
          ? new Date(user.checkInDate).toISOString().split("T")[0]
          : "",
        consentAccuracy: user.profile?.consentAccuracy || false,
        consentDataProcessing: user.profile?.consentDataProcessing || false,
        consentDataRetention: user.profile?.consentDataRetention || false,
        signature: user.profile?.signature || "",
      });
      setBranchChanged(false);
    }
  }, [user, reset]);

  console.log("User nationality:", user?.profile?.nationality);
  console.log("Nationalities list:", nationalities);

  const selectedBranch = watch("branch._id");

  useEffect(() => {
    if (selectedBranch) {
      setValue("assignedRoom._id", "");
      if (selectedBranch !== initialBranch) {
        setBranchChanged(true);
        setValue("location._id", "");
      } else {
        setBranchChanged(false);
      }
    }
  }, [selectedBranch, setValue, initialBranch]);

  const onSubmit = (data: ServiceUser) => {
    if (!user || !user._id) return;

    const changedData: Record<string, any> = {};

    // Date of birth, gender, nationality, language
    if (
      dirtyFields.dateOfBirth ||
      dirtyFields.gender ||
      dirtyFields.nationality ||
      dirtyFields.language
    ) {
      changedData.dateOfBirth = data.dateOfBirth;
      changedData.gender = data.gender;
      changedData.nationality = data.nationality;
      changedData.language = data.language;
    }

    if (dirtyFields.address) changedData.address = data.address;
    if (dirtyFields.medicalCondition)
      changedData.medicalCondition = data.medicalCondition;
    if (dirtyFields.allergies) changedData.allergies = data.allergies;
    if (dirtyFields.currentMedications)
      changedData.currentMedications = data.currentMedications;
    if (dirtyFields.additionalNotes)
      changedData.additionalNotes = data.additionalNotes;

    if (dirtyFields.dietaryRequirements)
      changedData.dietaryRequirements = data.dietaryRequirements;

    if (dirtyFields.branch?._id) changedData.branch = data.branch;
    if (dirtyFields.assignedRoom?._id)
      changedData.assignedRooms = [data.assignedRoom];
    if (dirtyFields.checkInDate) changedData.checkInDate = data.checkInDate;

    if (Object.keys(changedData).length === 0) {
      toast({
        title: "No Changes",
        description: "No service user details were changed.",
      });
      return;
    }

    updateGuest.mutate(
      { id: user._id, data: changedData },
      {
        onSuccess: () => {
          toast({
            title: "Service User Updated",
            description: "Service user details have been successfully updated.",
          });
          onClose();
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.error ||
            error.message ||
            "Failed to update service user. Please try again.";
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
    <div className="border p-4 rounded-md mt-4">
      <h3 className="text-lg font-semibold mb-4">Details</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              max={
                user?.isPrimaryGuest
                  ? new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                      .toISOString()
                      .split("T")[0] // 18 years ago
                  : new Date().toISOString().split("T")[0] // today
              }
              {...register("dateOfBirth", {
                required: "Date of birth is required",
              })}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              {...register("address")}
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender.message}</p>
            )}
          </div> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Controller
              name="nationality"
              control={control}
              rules={{ required: "Nationality is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {nationalities?.map((nat) => (
                      <SelectItem key={nat} value={nat.toLowerCase()}>
                        {nat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.nationality && (
              <p className="text-red-500 text-xs">
                {errors.nationality.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Controller
              name="language"
              control={control}
              rules={{ required: "Language is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="urdu">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.language && (
              <p className="text-red-500 text-xs">{errors.language.message}</p>
            )}
          </div> */}
        </div>

        <ContactFields2 control={control} register={register} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="medicalCondition">Medical Conditions</Label>
            <Textarea
              id="medicalCondition"
              placeholder="List any medical conditions..."
              {...register("medicalCondition")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              placeholder="List any allergies..."
              {...register("allergies")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              placeholder="List current medications..."
              {...register("currentMedications")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
            <Controller
              name="dietaryRequirements"
              control={control}
              render={({ field }) => {
                const selectedValues: string[] = field.value || [];
                return (
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {selectedValues.length > 0
                            ? `${selectedValues.length} selected`
                            : "Select dietary requirements"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandGroup>
                            {Object.values(DIETARY_REQUIREMENT_TYPES).map(
                              (type) => {
                                const isSelected =
                                  selectedValues.includes(type);
                                return (
                                  <CommandItem
                                    key={type}
                                    onSelect={() => {
                                      let updated = isSelected
                                        ? selectedValues.filter(
                                            (v) => v !== type
                                          )
                                        : [...selectedValues, type];
                                      field.onChange(updated);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        isSelected ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                    {type}
                                  </CommandItem>
                                );
                              }
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2">
                      {selectedValues?.map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() =>
                            field.onChange(
                              selectedValues.filter((v) => v !== type)
                            )
                          }
                        >
                          {type} ✕
                        </Badge>
                      ))}
                    </div>
                  </>
                );
              }}
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Any additional notes..."
            {...register("additionalNotes")}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={updateGuest.isPending || !isDirty}>
            {updateGuest.isPending ? "Updating..." : "Update Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}
