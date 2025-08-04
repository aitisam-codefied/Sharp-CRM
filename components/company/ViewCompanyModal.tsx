"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Building, MapPin } from "lucide-react";
import BranchCard from "./BranchCard";

interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Array<{
    _id: string;
    name: string;
    address: string;
    locations: Array<{
      _id: string;
      name: string;
      rooms: Array<{
        _id: string;
        roomNumber: string;
        type: string;
        capacity: number;
        amenities: string[];
      }>;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ViewCompanyModal({
  company,
  isOpen,
  onClose,
}: {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {company?.name} - Company Details
          </DialogTitle>
        </DialogHeader>
        {company && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Company Name
                </Label>
                <p className="text-lg font-semibold">{company.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Created Date
                </Label>
                <p className="text-lg">
                  {new Date(company.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Branches ({company.branches.length})
              </h3>
              <div className="space-y-4">
                {company.branches.map((branch) => (
                  <BranchCard
                    key={branch._id}
                    branch={branch}
                    companyId={company._id}
                    onBranchUpdate={(updatedBranch) => {
                      // Update company state if needed
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
