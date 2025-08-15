"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useToast } from "@/hooks/use-toast";
import { GuestFormData, Branch, Location, Room } from "@/lib/types";
import { ContactFields } from "./ContactFields";
import { DocumentFields } from "./DocumentFields";
import { ConsentFields } from "./ConsentFields";
import { SUPPORT_SERVICE_TYPES, DIETARY_REQUIREMENT_TYPES } from "./GuestForm";
import { useGetGuestById } from "@/hooks/useGetGuestById";
import { useUpdateGuest } from "@/hooks/useUpdateGuest";
import { ROOM_PREFERENCE_TYPES } from "../AddBranchDialog";

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  branches: Branch[];
  allLocations: Location[];
  allRooms: Room[];
  nationalities: string[];
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  userId,
  branches,
  allLocations,
  allRooms,
  nationalities,
}: EditUserModalProps) {
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<GuestFormData | null>(null);

  useEffect(() => {
    console.log("userIDDDDDDDD", userId);
  });

  const { data: user, isLoading: isFetching } = useGetGuestById(userId || "");
  const updateGuest = useUpdateGuest();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GuestFormData>({
    defaultValues: {
      users: [
        {
          fullName: "",
          emailAddress: "",
          phoneNumber: "",
          branches: [],
          locations: [],
        },
      ],
      details: [
        {
          dateOfBirth: "",
          gender: "",
          nationality: "",
          language: "",
          numberOfDependents: 0,
          address: "",
          priorityLevel: "",
          assignedRoom: "",
          dental: { name: "", phoneNumber: "", emailAddress: "" },
          emergencyContacts: [
            { fullName: "", relationship: "", phoneNumber: "" },
          ],
          medicalCondition: "",
          allergies: "",
          currentMedications: "",
          dietaryRequirements: [],
          supportServices: [],
          additionalNotes: "",
          roomTypePreference: "",
          signature: "",
        },
      ],
    },
  });

  // Prefill form with user data
  useEffect(() => {
    console.log("Fetched user data:", user);
    if (user) {
      const formData: GuestFormData = {
        users: [
          {
            fullName: user.userId?.fullName || "",
            emailAddress: user.userId?.emailAddress || "",
            phoneNumber: user.userId?.phoneNumber || "",
            branches: user.branch?._id ? [user.branch._id] : [],
            locations:
              user.branch?.locations && user.branch.locations[0]?._id
                ? [user.branch.locations[0]._id]
                : [],
          },
        ],
        details: [
          {
            dateOfBirth: user.dateOfBirth
              ? new Date(user.dateOfBirth).toISOString().split("T")[0]
              : "",
            gender: user.gender || "",
            nationality: user.nationality || "",
            language: user.language || "",
            numberOfDependents: user.numberOfDependents || 0,
            address: user.address || "",
            priorityLevel: user.priorityLevel || "",
            assignedRoom: user.assignedRoom?._id || "",
            dental: {
              name: user.dental?.name || "",
              phoneNumber: user.dental?.phoneNumber || "",
              emailAddress: user.dental?.emailAddress || "",
            },
            emergencyContacts: {
              fullName: user.emergencyContacts?.fullName || "",
              phoneNumber: user.emergencyContacts?.phoneNumber || "",
              emailAddress: user.emergencyContacts?.emailAddress || "",
            },
            medicalCondition: user.medicalCondition || "",
            allergies: user.allergies || "",
            currentMedications: user.currentMedications || "",
            dietaryRequirements: user.dietaryRequirements || [],
            supportServices: user.supportServices || [],
            additionalNotes: user.additionalNotes || "",
            roomTypePreference: user.roomTypePreference || "",
            documents: user.documents || [],
            consentAccuracy: user.consentAccuracy || false,
            consentDataProcessing: user.consentDataProcessing || false,
            consentDataRetention: user.consentDataRetention || false,
            signature: user.signature || "",
          },
        ],
      };
      reset(formData);
      setInitialData(formData);
    }
  }, [user, reset]);

  const watchUsers = watch("users");
  const selectedBranch = watchUsers[0]?.branches[0] || "";
  const selectedLocation = watchUsers[0]?.locations[0] || "";

  const getFilteredLocations = (branchId: string) => {
    return (
      allLocations?.filter((location) => location.branchId === branchId) || []
    );
  };

  const getFilteredRooms = (locationId: string) => {
    return allRooms?.filter((room) => room.location?._id === locationId) || [];
  };

  const filteredLocations = getFilteredLocations(selectedBranch);
  const filteredRooms = getFilteredRooms(selectedLocation);

  useEffect(() => {
    if (selectedBranch) {
      setValue(`users.0.locations`, []);
      setValue(`details.0.assignedRoom`, "");
    }
  }, [selectedBranch, setValue]);

  useEffect(() => {
    if (selectedLocation) {
      setValue(`details.0.assignedRoom`, "");
    }
  }, [selectedLocation, setValue]);

  const onSubmit = (data: GuestFormData) => {
    if (!userId || !initialData) return;

    // Compute changed data
    const changedData: Partial<GuestFormData> = {};
    Object.keys(data).forEach((key) => {
      const section = key as keyof GuestFormData;
      if (
        JSON.stringify(data[section]) !== JSON.stringify(initialData[section])
      ) {
        changedData[section] = data[section];
      }
    });

    updateGuest.mutate(
      { id: userId, data: changedData },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Service user updated successfully",
          });
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update service user",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isFetching) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex justify-center items-center h-32">
            Loading user data...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="users.0.fullName">Full Name</Label>
                <Input
                  id="users.0.fullName"
                  placeholder="Enter full name"
                  {...register("users.0.fullName", {
                    required: "Full name is required",
                  })}
                />
                {errors?.users?.[0]?.fullName && (
                  <p className="text-red-500 text-xs">
                    {errors.users[0].fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="users.0.emailAddress">Email Address</Label>
                <Input
                  id="users.0.emailAddress"
                  type="email"
                  placeholder="user@example.com"
                  {...register("users.0.emailAddress", {
                    required: "Email is required",
                  })}
                />
                {errors?.users?.[0]?.emailAddress && (
                  <p className="text-red-500 text-xs">
                    {errors.users[0].emailAddress.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="users.0.phoneNumber">Phone Number</Label>
                <Input
                  id="users.0.phoneNumber"
                  placeholder="+1234567890"
                  {...register("users.0.phoneNumber", {
                    required: "Phone number is required",
                  })}
                />
                {errors?.users?.[0]?.phoneNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.users[0].phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="users.0.branches">Branches</Label>
                <Controller
                  name="users.0.branches"
                  control={control}
                  rules={{ required: "At least one branch is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange([value])}
                      value={field.value[0] || ""}
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
                {errors?.users?.[0]?.branches && (
                  <p className="text-red-500 text-xs">
                    {errors.users[0].branches.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="users.0.locations">Locations</Label>
                <Controller
                  name="users.0.locations"
                  control={control}
                  rules={{ required: "At least one location is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange([value])}
                      value={field.value[0] || ""}
                      disabled={!selectedBranch}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredLocations.map((location: Location) => (
                          <SelectItem key={location._id} value={location._id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors?.users?.[0]?.locations && (
                  <p className="text-red-500 text-xs">
                    {errors.users[0].locations.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.assignedRoom">Room</Label>
                <Controller
                  name="details.0.assignedRoom"
                  control={control}
                  rules={{ required: "Room selection is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedLocation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredRooms.map((room: Room) => (
                          <SelectItem key={room._id} value={room._id}>
                            {room.roomNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors?.details?.[0]?.assignedRoom && (
                  <p className="text-red-500 text-xs">
                    {errors.details[0].assignedRoom.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.0.dateOfBirth">Date of Birth</Label>
                <Input
                  id="details.0.dateOfBirth"
                  type="date"
                  {...register("details.0.dateOfBirth", {
                    required: "Date of birth is required",
                  })}
                />
                {errors?.details?.[0]?.dateOfBirth && (
                  <p className="text-red-500 text-xs">
                    {errors.details[0].dateOfBirth.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.gender">Gender</Label>
                <Controller
                  name="details.0.gender"
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
                {errors?.details?.[0]?.gender && (
                  <p className="text-red-500 text-xs">
                    {errors.details[0].gender.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.0.nationality">Nationality</Label>
                <Controller
                  name="details.0.nationality"
                  control={control}
                  rules={{ required: "Nationality is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalities.map((nationality) => (
                          <SelectItem key={nationality} value={nationality}>
                            {nationality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors?.details?.[0]?.nationality && (
                  <p className="text-red-500 text-xs">
                    {errors.details[0].nationality.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.language">Language</Label>
                <Input
                  id="details.0.language"
                  placeholder="e.g., English"
                  {...register("details.0.language")}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.0.numberOfDependents">
                  Number of Dependents
                </Label>
                <Input
                  id="details.0.numberOfDependents"
                  type="number"
                  placeholder="0"
                  {...register("details.0.numberOfDependents", {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.address">Address</Label>
                <Input
                  id="details.0.address"
                  placeholder="123 Main Street"
                  {...register("details.0.address")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.priorityLevel">Priority Level</Label>
                <Controller
                  name="details.0.priorityLevel"
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
                {errors?.details?.[0]?.priorityLevel && (
                  <p className="text-red-500 text-xs">
                    {errors.details[0].priorityLevel.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.0.dental.name">
                  Dental Clinic Name
                </Label>
                <Input
                  id="details.0.dental.name"
                  placeholder="Dental Clinic"
                  {...register("details.0.dental.name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.dental.phoneNumber">
                  Dental Phone
                </Label>
                <Input
                  id="details.0.dental.phoneNumber"
                  placeholder="+1111111111"
                  {...register("details.0.dental.phoneNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.dental.emailAddress">
                  Dental Email
                </Label>
                <Input
                  id="details.0.dental.emailAddress"
                  type="email"
                  placeholder="clinic@example.com"
                  {...register("details.0.dental.emailAddress")}
                />
              </div>
            </div>
            <ContactFields index={0} control={control} register={register} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.0.medicalCondition">
                  Medical Conditions
                </Label>
                <Textarea
                  id="details.0.medicalCondition"
                  placeholder="List any medical conditions..."
                  {...register("details.0.medicalCondition")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.allergies">Allergies</Label>
                <Textarea
                  id="details.0.allergies"
                  placeholder="List any allergies..."
                  {...register("details.0.allergies")}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.0.currentMedications">
                  Current Medications
                </Label>
                <Textarea
                  id="details.0.currentMedications"
                  placeholder="List current medications..."
                  {...register("details.0.currentMedications")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.0.dietaryRequirements">
                  Dietary Requirements
                </Label>
                <Controller
                  name="details.0.dietaryRequirements"
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
                            {Object.values(DIETARY_REQUIREMENT_TYPES).map(
                              (type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2">
                          {selectedValues.map((type) => (
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
            <div className="space-y-2">
              <Label htmlFor="details.0.supportServices">
                Support Services
              </Label>
              <Controller
                name="details.0.supportServices"
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
                          {Object.values(SUPPORT_SERVICE_TYPES).map(
                            (service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2">
                        {selectedValues.map((service) => (
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
            <div className="space-y-2">
              <Label htmlFor="details.0.additionalNotes">
                Additional Notes
              </Label>
              <Textarea
                id="details.0.additionalNotes"
                placeholder="Any additional notes..."
                {...register("details.0.additionalNotes")}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.0.roomTypePreference">
                  Room Type Preference
                </Label>
                <Controller
                  name="details.0.roomTypePreference"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ROOM_PREFERENCE_TYPES).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DocumentFields index={0} control={control} register={register} />
            <ConsentFields index={0} register={register} />
            <div className="space-y-2">
              <Label htmlFor="details.0.signature">Signature</Label>
              <Input
                id="details.0.signature"
                placeholder="Enter signature"
                {...register("details.0.signature", {
                  required: "Signature is required",
                })}
              />
              {errors?.details?.[0]?.signature && (
                <p className="text-red-500 text-xs">
                  {errors.details[0].signature.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateGuest.isPending}>
              {updateGuest.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
