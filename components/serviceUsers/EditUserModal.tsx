"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ServiceUser, Branch, Room } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { SUPPORT_SERVICE_TYPES, DIETARY_REQUIREMENT_TYPES } from "./GuestForm";
import { DocumentFields } from "./DocumentFields";
import { ConsentFields } from "./ConsentFields";
import { ROOM_PREFERENCE_TYPES } from "../AddBranchDialog";
import { ContactFields, ContactFields2 } from "./ContactFields2";
import { ConsentFields2 } from "./ConsentFields2";
import { DocumentFields2 } from "./DocumentFields2";

interface EditUserModalProps {
  user: ServiceUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  branches: Branch[];
  allRooms: Room[];
  nationalities: string[];
}

export function EditUserModal({
  user,
  isOpen,
  onOpenChange,
  branches,
  allRooms,
  nationalities,
}: EditUserModalProps) {
  const { toast } = useToast();
  const updateGuest = useUpdateGuest();

  // Initialize form with ServiceUser fields
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<ServiceUser>({
    defaultValues: {
      _id: "",
      userId: {
        _id: "",
        portNumber: "",
        fullName: "",
        phoneNumber: "",
        emailAddress: "",
        roles: [],
      },
      dateOfBirth: "",
      gender: "",
      nationality: "",
      language: "",
      numberOfDependents: 0,
      dental: {
        name: "",
        phoneNumber: "",
        emailAddress: "",
      },
      address: "",
      emergencyContacts: [],
      medicalCondition: "",
      allergies: "",
      currentMedications: "",
      additionalNotes: "",
      dietaryRequirements: [],
      supportServices: [],
      priorityLevel: "",
      documents: [],
      branch: {
        _id: "",
        companyId: { _id: "", name: "" },
        name: "",
        address: "",
      },
      roomTypePreference: "",
      assignedRoom: {
        _id: "",
        roomNumber: "",
        type: "",
      },
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
    },
  });

  // Reset form when user changes
  useEffect(() => {
    console.log("user data", user);
    console.log("Branches:", branches);
    console.log("Nationalities:", nationalities);
    console.log("All rooms:", allRooms);
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [user, reset]);

  const selectedBranch = watch("branch._id");

  // const getFilteredRooms = (branchId: string) => {
  //   return allRooms?.filter((room) => room.branch?._id === branchId) || [];
  // };

  // const filteredRooms = getFilteredRooms(selectedBranch);

  useEffect(() => {
    if (selectedBranch) {
      setValue("assignedRoom._id", "");
    }
  }, [selectedBranch, setValue]);

  const onSubmit = (data: ServiceUser) => {
    if (!user || !user._id) return;

    const changedData: Partial<ServiceUser> = {};

    // Flatten userId fields
    if (dirtyFields.userId?.fullName)
      changedData.fullName = data.userId.fullName;

    if (dirtyFields.userId?.emailAddress)
      changedData.emailAddress = data.userId.emailAddress;
    if (dirtyFields.userId?.phoneNumber)
      changedData.phoneNumber = data.userId.phoneNumber;

    // Rest fields as normal
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
    if (dirtyFields.supportServices)
      changedData.supportServices = data.supportServices;
    if (dirtyFields.priorityLevel)
      changedData.priorityLevel = data.priorityLevel;
    if (dirtyFields.documents) changedData.documents = data.documents;
    if (dirtyFields.branch?._id) changedData.branch = { _id: data.branch._id };
    if (dirtyFields.assignedRoom?._id)
      changedData.assignedRoom = { _id: data.assignedRoom._id };
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

    updateGuest.mutate(
      { id: user._id, data: changedData },
      {
        onSuccess: () => {
          toast({
            title: "Service User Updated",
            description: "Service user details have been successfully updated.",
          });
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update service user. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Service User Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userId.fullName">Full Name</Label>
                <Input
                  id="userId.fullName"
                  placeholder="Enter full name"
                  {...register("userId.fullName", {
                    required: "Full name is required",
                  })}
                />
                {errors.userId?.fullName && (
                  <p className="text-red-500 text-xs">
                    {errors.userId.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId.emailAddress">Email Address</Label>
                <Input
                  id="userId.emailAddress"
                  type="email"
                  placeholder="user@example.com"
                  {...register("userId.emailAddress", {
                    required: "Email is required",
                  })}
                />
                {errors.userId?.emailAddress && (
                  <p className="text-red-500 text-xs">
                    {errors.userId.emailAddress.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="branch._id">Branch</Label>
                <Controller
                  name="branch._id"
                  control={control}
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId.phoneNumber">Phone Number</Label>
                <Input
                  id="userId.phoneNumber"
                  placeholder="+1234567890"
                  {...register("userId.phoneNumber", {
                    required: "Phone number is required",
                  })}
                />
                {errors.userId?.phoneNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.userId.phoneNumber.message}
                  </p>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="assignedRoom._id">Room</Label>
                <Controller
                  name="assignedRoom._id"
                  control={control}
                  rules={{ required: "Room selection is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedBranch}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {allRooms?.map((room: Room) => (
                          <SelectItem key={room._id} value={room._id}>
                            {room.roomNumber} ({room.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assignedRoom?._id && (
                  <p className="text-red-500 text-xs">
                    {errors.assignedRoom._id.message}
                  </p>
                )}
              </div> */}
            </div>
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
                  <p className="text-red-500 text-xs">
                    {errors.gender.message}
                  </p>
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
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfDependents">Number of Dependents</Label>
                <Input
                  id="numberOfDependents"
                  type="number"
                  placeholder="0"
                  {...register("numberOfDependents", {
                    valueAsNumber: true,
                  })}
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
              <div className="space-y-2">
                <Label htmlFor="priorityLevel">Priority Level</Label>
                <Controller
                  name="priorityLevel"
                  control={control}
                  rules={{ required: "Priority level is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priorityLevel && (
                  <p className="text-red-500 text-xs">
                    {errors.priorityLevel.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="dental.name">Dental Clinic Name</Label>
                <Input
                  id="dental.name"
                  placeholder="Dental Clinic"
                  {...register("dental.name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dental.phoneNumber">Dental Phone</Label>
                <Input
                  id="dental.phoneNumber"
                  placeholder="+1111111111"
                  {...register("dental.phoneNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dental.emailAddress">Dental Email</Label>
                <Input
                  id="dental.emailAddress"
                  type="email"
                  placeholder="clinic@example.com"
                  {...register("dental.emailAddress")}
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
                <Label htmlFor="dietaryRequirements">
                  Dietary Requirements
                </Label>
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
              <Label htmlFor="supportServices">Support Services</Label>
              <Controller
                name="supportServices"
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
                          <SelectValue placeholder="Select support services" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(SUPPORT_SERVICE_TYPES)?.map(
                            (service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2">
                        {selectedValues?.map((service) => (
                          <Badge
                            key={service}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() =>
                              field.onChange(
                                selectedValues.filter((v) => v !== service)
                              )
                            }
                          >
                            {service} <X className="ml-2 h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional notes..."
                {...register("additionalNotes")}
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="roomTypePreference">Room Type Preference</Label>
              <Controller
                name="roomTypePreference"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ROOM_PREFERENCE_TYPES)?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DocumentFields2 index={0} control={control} register={register} />
            <ConsentFields2 register={register} />
            <div className="space-y-2 mt-4">
              <Label htmlFor="signature">Signature</Label>
              <Input
                id="signature"
                placeholder="Enter signature"
                {...register("signature", {
                  required: "Signature is required",
                })}
              />
              {errors.signature && (
                <p className="text-red-500 text-xs">
                  {errors.signature.message}
                </p>
              )}
              {/* </div> */}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateGuest.isPending}>
              {updateGuest.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
