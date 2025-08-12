import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, X } from "lucide-react";
import { GuestFormData, Branch, Location, Room } from "@/lib/types";
import { ContactFields } from "./ContactFields";
import { DocumentFields } from "./DocumentFields";
import { ConsentFields } from "./ConsentFields";
import { ROOM_PREFERENCE_TYPES } from "../AddBranchDialog";
import { Badge } from "../ui/badge";

interface GuestFormProps {
  index: number;
  control: UseFormReturn<GuestFormData>["control"];
  register: UseFormReturn<GuestFormData>["register"];
  errors: UseFormReturn<GuestFormData>["formState"]["errors"];
  watch: UseFormReturn<GuestFormData>["watch"];
  setValue: UseFormReturn<GuestFormData>["setValue"];
  branches: Branch[] | undefined;
  allLocations: Location[] | undefined;
  allRooms: Room[] | undefined;
  nationalities: string[];
  removeUser: () => void;
  showRemoveButton: boolean;
}

export const SUPPORT_SERVICE_TYPES = {
  LEGAL_ADVICE: "Legal Advice",
  MEDICAL_SUPPORT: "Medical Support",
  MENTAL_HEALTH_SUPPORT: "Mental Health Support",
  JOB_TRAINING: "Job Training",
  HOUSING_SUPPORT: "Housing Support",
  LANGUAGE_CLASSES: "Language Classes",
  EDUCATION: "Education",
  BENEFITS_ADVICE: "Benefits Advice",
};

export const DIETARY_REQUIREMENT_TYPES = {
  VEGETARIAN: "Vegetarian",
  VEGAN: "Vegan",
  GLUTEN_FREE: "Gluten Free",
  DAIRY_FREE: "Dairy Free",
  KETOGENIC: "Ketogenic",
  LACTO_VEGAN: "Lacto-Vegan",
  OMNIVORE: "Omnivore",
  HALAL: "Halal",
  OTHER: "Other",
};

export function GuestForm({
  index,
  control,
  register,
  errors,
  watch,
  setValue,
  branches,
  allLocations,
  allRooms,
  nationalities,
  removeUser,
  showRemoveButton,
}: GuestFormProps) {
  const watchUsers = watch("users");
  const selectedBranch = watchUsers[index]?.branches[0] || "";
  const selectedLocation = watchUsers[index]?.locations[0] || "";

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
      setValue(`users.${index}.locations`, []);
      setValue(`details.${index}.assignedRoom`, "");
    }
  }, [selectedBranch, setValue, index]);

  useEffect(() => {
    if (selectedLocation) {
      setValue(`details.${index}.assignedRoom`, "");
    }
  }, [selectedLocation, setValue, index]);

  return (
    <div className="border p-4 rounded-md relative">
      <h3 className="text-lg font-semibold mb-4">Guest {index + 1}</h3>
      {showRemoveButton && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={removeUser}
        >
          <Minus className="h-4 w-4" />
        </Button>
      )}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`users.${index}.fullName`}>Full Name</Label>
          <Input
            id={`users.${index}.fullName`}
            placeholder="Enter full name"
            {...register(`users.${index}.fullName`, {
              required: "Full name is required",
            })}
          />
          {errors?.users?.[index]?.fullName && (
            <p className="text-red-500 text-xs">
              {errors.users[index].fullName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`users.${index}.emailAddress`}>Email Address</Label>
          <Input
            id={`users.${index}.emailAddress`}
            type="email"
            placeholder="user@example.com"
            {...register(`users.${index}.emailAddress`, {
              required: "Email is required",
            })}
          />
          {errors?.users?.[index]?.emailAddress && (
            <p className="text-red-500 text-xs">
              {errors.users[index].emailAddress.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`users.${index}.phoneNumber`}>Phone Number</Label>
          <Input
            id={`users.${index}.phoneNumber`}
            placeholder="+1234567890"
            {...register(`users.${index}.phoneNumber`, {
              required: "Phone number is required",
            })}
          />
          {errors?.users?.[index]?.phoneNumber && (
            <p className="text-red-500 text-xs">
              {errors.users[index].phoneNumber.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`users.${index}.branches`}>Branches</Label>
          <Controller
            name={`users.${index}.branches`}
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
          {errors?.users?.[index]?.branches && (
            <p className="text-red-500 text-xs">
              {errors.users[index].branches.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`users.${index}.locations`}>Locations</Label>
          <Controller
            name={`users.${index}.locations`}
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
          {errors?.users?.[index]?.locations && (
            <p className="text-red-500 text-xs">
              {errors.users[index].locations.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.assignedRoom`}>Room</Label>
          <Controller
            name={`details.${index}.assignedRoom`}
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
          {errors?.details?.[index]?.assignedRoom && (
            <p className="text-red-500 text-xs">
              {errors.details[index].assignedRoom.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.dateOfBirth`}>Date of Birth</Label>
          <Input
            id={`details.${index}.dateOfBirth`}
            type="date"
            {...register(`details.${index}.dateOfBirth`, {
              required: "Date of birth is required",
            })}
          />
          {errors?.details?.[index]?.dateOfBirth && (
            <p className="text-red-500 text-xs">
              {errors.details[index].dateOfBirth.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.gender`}>Gender</Label>
          <Controller
            name={`details.${index}.gender`}
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
          {errors?.details?.[index]?.gender && (
            <p className="text-red-500 text-xs">
              {errors.details[index].gender.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.nationality`}>Nationality</Label>
          <Controller
            name={`details.${index}.nationality`}
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
          {errors?.details?.[index]?.nationality && (
            <p className="text-red-500 text-xs">
              {errors.details[index].nationality.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.language`}>Language</Label>
          <Input
            id={`details.${index}.language`}
            placeholder="e.g., English"
            {...register(`details.${index}.language`)}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.numberOfDependents`}>
            Number of Dependents
          </Label>
          <Input
            id={`details.${index}.numberOfDependents`}
            type="number"
            placeholder="0"
            {...register(`details.${index}.numberOfDependents`, {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.address`}>Address</Label>
          <Input
            id={`details.${index}.address`}
            placeholder="123 Main Street"
            {...register(`details.${index}.address`)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.priorityLevel`}>
            Priority Level
          </Label>
          <Controller
            name={`details.${index}.priorityLevel`}
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
          {errors?.details?.[index]?.priorityLevel && (
            <p className="text-red-500 text-xs">
              {errors.details[index].priorityLevel.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.dental.name`}>
            Dental Clinic Name
          </Label>
          <Input
            id={`details.${index}.dental.name`}
            placeholder="Dental Clinic"
            {...register(`details.${index}.dental.name`)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.dental.phoneNumber`}>
            Dental Phone
          </Label>
          <Input
            id={`details.${index}.dental.phoneNumber`}
            placeholder="+1111111111"
            {...register(`details.${index}.dental.phoneNumber`)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.dental.emailAddress`}>
            Dental Email
          </Label>
          <Input
            id={`details.${index}.dental.emailAddress`}
            type="email"
            placeholder="clinic@example.com"
            {...register(`details.${index}.dental.emailAddress`)}
          />
        </div>
      </div>
      <ContactFields index={index} control={control} register={register} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.medicalCondition`}>
            Medical Conditions
          </Label>
          <Textarea
            id={`details.${index}.medicalCondition`}
            placeholder="List any medical conditions..."
            {...register(`details.${index}.medicalCondition`)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.allergies`}>Allergies</Label>
          <Textarea
            id={`details.${index}.allergies`}
            placeholder="List any allergies..."
            {...register(`details.${index}.allergies`)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.currentMedications`}>
            Current Medications
          </Label>
          <Textarea
            id={`details.${index}.currentMedications`}
            placeholder="List current medications..."
            {...register(`details.${index}.currentMedications`)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.dietaryRequirements`}>
            Dietary Requirements
          </Label>

          <Controller
            name={`details.${index}.dietaryRequirements`}
            control={control}
            render={({ field }) => {
              const selectedValues: string[] = field.value || [];

              return (
                <div className="space-y-2">
                  {/* Dropdown for selecting dietary requirements */}
                  <Select
                    onValueChange={(value) => {
                      let updatedValues = [...selectedValues];

                      if (updatedValues.includes(value)) {
                        // Remove if already selected
                        updatedValues = updatedValues.filter(
                          (v) => v !== value
                        );
                      } else {
                        // Add if not selected
                        updatedValues.push(value);
                      }

                      field.onChange(updatedValues);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dietary requirements" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DIETARY_REQUIREMENT_TYPES).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Show selected items as badges */}
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
      <div className="space-y-2 mt-4">
        <Label htmlFor={`details.${index}.supportServices`}>
          Support Services
        </Label>
        <Controller
          name={`details.${index}.supportServices`}
          control={control}
          render={({ field }) => {
            const selectedValues: string[] = field.value || [];

            return (
              <div className="space-y-2">
                {/* Multi-select trigger */}
                <Select
                  onValueChange={(value) => {
                    let updatedValues = [...selectedValues];

                    if (updatedValues.includes(value)) {
                      updatedValues = updatedValues.filter((v) => v !== value);
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
                    {Object.values(SUPPORT_SERVICE_TYPES).map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Display selected items as badges */}
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
      <div className="space-y-2 mt-4">
        <Label htmlFor={`details.${index}.additionalNotes`}>
          Additional Notes
        </Label>
        <Textarea
          id={`details.${index}.additionalNotes`}
          placeholder="Any additional notes..."
          {...register(`details.${index}.additionalNotes`)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`details.${index}.roomTypePreference`}>
            Room Type Preference
          </Label>
          <Controller
            name={`details.${index}.roomTypePreference`}
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
      <DocumentFields index={index} control={control} register={register} />
      <ConsentFields index={index} register={register} />
      <div className="space-y-2 mt-4">
        <Label htmlFor={`details.${index}.signature`}>Signature</Label>
        <Input
          id={`details.${index}.signature`}
          placeholder="Enter signature"
          {...register(`details.${index}.signature`, {
            required: "Signature is required",
          })}
        />
        {errors?.details?.[index]?.signature && (
          <p className="text-red-500 text-xs">
            {errors.details[index].signature.message}
          </p>
        )}
      </div>
    </div>
  );
}
