"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { GuestFormData, Branch, Location, Room } from "@/lib/types";
import { useCreateGuest } from "@/hooks/useCreateGuest";
import { useBranches } from "@/hooks/useGetBranches";
import { useLocations } from "@/hooks/useGetLocations";
import { useRooms } from "@/hooks/useGetRooms";
import { Plus } from "lucide-react";
import { GuestForm } from "./GuestForm";

interface NewUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  nationalities: string[];
  onSubmit: () => void;
}

const defaultUser = {
  fullName: "",
  emailAddress: "",
  phoneNumber: "",
  branches: [],
  locations: [],
};

const defaultDetails = {
  dateOfBirth: "",
  gender: "",
  nationality: "",
  language: "",
  numberOfDependents: 0,
  dental: { name: "", phoneNumber: "", emailAddress: "" },
  address: "",
  emergencyContacts: [{ fullName: "", relationship: "", phoneNumber: "" }],
  medicalCondition: "",
  allergies: "",
  currentMedications: "",
  additionalNotes: "",
  dietaryRequirements: [],
  supportServices: [],
  priorityLevel: "",
  documents: [{ type: "", url: "" }],
  roomTypePreference: "",
  assignedRoom: "",
  consentAccuracy: false,
  consentDataProcessing: false,
  consentDataRetention: false,
  signature: "",
};

export function NewUserDialog({
  isOpen,
  setIsOpen,
  nationalities,
  onSubmit,
}: NewUserDialogProps) {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateGuest();
  const { data: branches } = useBranches();
  const { data: allLocations } = useLocations();
  const { data: allRooms } = useRooms();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GuestFormData>({
    defaultValues: {
      areThereMultipleGuests: false,
      users: [defaultUser],
      details: [defaultDetails],
    },
  });

  const {
    fields: userFields,
    append: appendUser,
    remove: removeUser,
  } = useFieldArray({
    control,
    name: "users",
  });

  const {
    fields: detailsFields,
    append: appendDetails,
    remove: removeDetails,
  } = useFieldArray({
    control,
    name: "details",
  });

  const onFormSubmit = (data: GuestFormData) => {
    data.areThereMultipleGuests = data.users.length > 1;
    console.log("Submitted form data:", data);
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Service user(s) added successfully.",
        });
        reset();
        setIsOpen(false);
        onSubmit();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to add service user(s). Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Service User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service User(s)</DialogTitle>
          <DialogDescription>
            Register new service user(s) in the system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-6 py-4">
          {userFields.map((user, index) => (
            <GuestForm
              key={user.id}
              index={index}
              control={control}
              register={control.register}
              errors={control.formState?.errors}
              watch={watch}
              setValue={setValue}
              branches={branches}
              allLocations={allLocations}
              allRooms={allRooms}
              nationalities={nationalities}
              removeUser={() => {
                removeUser(index);
                removeDetails(index);
              }}
              showRemoveButton={userFields.length > 1}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              appendUser(defaultUser);
              appendDetails(defaultDetails);
            }}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Guest
          </Button>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Add Service User(s)"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
