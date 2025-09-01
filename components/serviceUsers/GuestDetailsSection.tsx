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
    formState: { errors, dirtyFields },
  } = useForm<ServiceUser & { location: { _id: string } }>({
    defaultValues: {
      _id: "",
      dateOfBirth: "",
      gender: user?.gender || "",
      nationality: user?.nationality || "",
      language: "",
      numberOfDependents: 0,
      dental: { name: "", phoneNumber: "", emailAddress: "" },
      address: "",
      emergencyContacts: [],
      medicalCondition: "",
      allergies: "",
      currentMedications: "",
      additionalNotes: "",
      dietaryRequirements: [],
      supportServices: [],
      priorityLevel: user?.priorityLevel || "",
      documents: [],
      branch: {
        _id: user?.branch?._id || "",
        companyId: { _id: "", name: "" },
        name: "",
        address: "",
      },
      roomTypePreference: user?.roomTypePreference || "",
      assignedRoom: { _id: "", roomNumber: "", type: "" },
      checkInDate: "",
      consentAccuracy: false,
      consentDataProcessing: false,
      consentDataRetention: false,
      signature: "",
      removal: {
        transfer: {
          requestedBy: null,
          approvedBy: null,
          approvalStatus: null,
          approvalNotes: null,
          targetCompanyId: null,
          targetBranchId: null,
          targetLocationId: null,
          targetRoomId: null,
        },
        status: "",
        scheduledAt: null,
        scheduledBy: null,
        notes: null,
        executedAt: null,
        executedBy: null,
        lastError: null,
      },
      createdAt: "",
      updatedAt: "",
      location: { _id: "" },
    },
  });

  const initialBranch = user?.branch?._id || "";

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        location: { _id: "" },
      });
      setBranchChanged(false);
    }
  }, [user, reset]);

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

    const changedData: Partial<ServiceUser> = {};

    if (dirtyFields.dateOfBirth) changedData.dateOfBirth = data.dateOfBirth;
    if (dirtyFields.gender) changedData.gender = data.gender;
    if (dirtyFields.nationality) changedData.nationality = data.nationality;
    if (dirtyFields.language) changedData.language = data.language;
    if (dirtyFields.numberOfDependents)
      changedData.numberOfDependents = data.numberOfDependents;

    if (
      dirtyFields.dental?.name ||
      dirtyFields.dental?.phoneNumber ||
      dirtyFields.dental?.emailAddress
    ) {
      changedData.dental = {};
      if (dirtyFields.dental?.name) changedData.dental.name = data.dental.name;
      if (dirtyFields.dental?.phoneNumber)
        changedData.dental.phoneNumber = data.dental.phoneNumber;
      if (dirtyFields.dental?.emailAddress)
        changedData.dental.emailAddress = data.dental.emailAddress;
    }

    if (dirtyFields.address) changedData.address = data.address;
    if (dirtyFields.emergencyContacts)
      changedData.emergencyContacts = data.emergencyContacts;
    if (dirtyFields.medicalCondition)
      changedData.medicalCondition = data.medicalCondition;
    if (dirtyFields.allergies) changedData.allergies = data.allergies;
    if (dirtyFields.currentMedications)
      changedData.currentMedications = data.currentMedications;
    if (dirtyFields.additionalNotes)
      changedData.additionalNotes = data.additionalNotes;
    if (dirtyFields.dietaryRequirements)
      changedData.dietaryRequirements = data.dietaryRequirements;

    if (dirtyFields.branch?._id) changedData.branch = data.branch._id;
    if (dirtyFields.assignedRoom?._id)
      changedData.assignedRoom = data.assignedRoom._id;
    if (dirtyFields.roomTypePreference)
      changedData.roomTypePreference = data.roomTypePreference;
    if (dirtyFields.checkInDate) changedData.checkInDate = data.checkInDate;
    if (dirtyFields.consentAccuracy)
      changedData.consentAccuracy = data.consentAccuracy;
    if (dirtyFields.consentDataProcessing)
      changedData.consentDataProcessing = data.consentDataProcessing;
    if (dirtyFields.consentDataRetention)
      changedData.consentDataRetention = data.consentDataRetention;
    if (dirtyFields.signature) changedData.signature = data.signature;

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
        <div className="grid grid-cols-1 gap-4">
          {/* <div className="space-y-2">
            <Label htmlFor="branch._id">Branch</Label>
            <Controller
              name="branch._id"
              control={control}
              rules={{ required: "Branch is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    if (val !== initialBranch) {
                      setBranchChanged(true);
                      setValue("assignedRoom._id", "");
                      setValue("location._id", "");
                    } else {
                      setBranchChanged(false);
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map((branch: Branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.branch?._id && (
              <p className="text-red-500 text-xs">
                {errors.branch._id.message}
              </p>
            )}
          </div> */}
        </div>
        {/* <div className="grid grid-cols-2 gap-4 mt-4">
          {branchChanged && (
            <>
              <div className="space-y-2">
                <Label htmlFor="location._id">Location</Label>
                <Controller
                  name="location._id"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => {
                    const branchObj = branches.find(
                      (b) => b._id === selectedBranch
                    );
                    const locations = branchObj?.locations || [];
                    return (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setValue("assignedRoom._id", "");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc: any) => (
                            <SelectItem key={loc._id} value={loc._id}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedRoom._id">Room</Label>
                <Controller
                  name="assignedRoom._id"
                  control={control}
                  rules={{ required: "Room is required" }}
                  render={({ field }) => {
                    const branchObj = branches.find(
                      (b) => b._id === selectedBranch
                    );
                    const locationObj = branchObj?.locations.find(
                      (l: any) => l._id === watch("location._id")
                    );
                    const rooms = locationObj?.rooms || [];
                    return (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map((room: any) => (
                            <SelectItem key={room._id} value={room._id}>
                              {room.roomNumber} ({room.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>
            </>
          )}
        </div> */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
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
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
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
                    {nationalities?.map((nationality) => (
                      <SelectItem key={nationality} value={nationality}>
                        {nationality}
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
            <Input
              id="language"
              placeholder="e.g., English"
              {...register("language")}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="numberOfDependents">Number of Dependents</Label>
            <Input
              id="numberOfDependents"
              type="number"
              placeholder="0"
              {...register("numberOfDependents", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              {...register("address")}
            />
          </div>
        </div>

        <ContactFields2 control={control} register={register} />
        <div className="grid grid-cols-2 gap-4 mt-4">
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
        <div className="grid grid-cols-2 gap-4 mt-4">
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
                  <div className="space-y-2">
                    <Select
                      onValueChange={(value) => {
                        let updatedValues = [...selectedValues];
                        if (updatedValues.includes(value)) {
                          updatedValues = updatedValues.filter(
                            (v) => v !== value
                          );
                        } else {
                          updatedValues.push(value);
                        }
                        field.onChange(updatedValues);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dietary requirements" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DIETARY_REQUIREMENT_TYPES)?.map(
                          (type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
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
                  </div>
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

        {/* <DocumentFields2 index={0} control={control} register={register} /> */}
        <ConsentFields2 register={register} />

        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={updateGuest.isPending}>
            {updateGuest.isPending ? "Updating..." : "Update Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}
