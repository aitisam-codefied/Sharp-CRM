"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServiceUser, Branch, Room } from "@/lib/types";
import { BasicInfoSection } from "./BasicInfoSection";
import { GuestDetailsSection } from "./GuestDetailsSection";

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
  console.log("user data", user);
  // console.log("Branches:", branches);
  // console.log("Nationalities:", nationalities);
  // console.log("All rooms:", allRooms);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service User</DialogTitle>
        </DialogHeader>
        <BasicInfoSection user={user} onClose={() => onOpenChange(false)} />
        <GuestDetailsSection
          user={user}
          branches={branches}
          nationalities={nationalities}
          onClose={() => onOpenChange(false)}
        />
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
