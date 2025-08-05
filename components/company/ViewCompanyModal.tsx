"use client";
import { useState, useEffect } from "react";
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
import AddBranchForCompanyDialog from "./AddBranchForCompanyDialog";

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
  onCompanyUpdate,
}: {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onCompanyUpdate: (updatedCompany: Company) => void;
}) {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync companyData with company prop
  useEffect(() => {
    setIsLoading(true);
    setCompanyData(company);
    setIsLoading(false);
  }, [company]);

  // Update company data when a new branch is created
  const handleBranchCreated = (newBranch: {
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
  }) => {
    if (companyData) {
      const updatedCompany = {
        ...companyData,
        branches: [...companyData.branches, newBranch],
      };
      setCompanyData(updatedCompany);
      onCompanyUpdate(updatedCompany); // Notify parent of the update
    }
  };

  // Update company data when a branch is updated
  const handleBranchUpdate = (updatedBranch: {
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
  }) => {
    if (companyData) {
      const updatedCompany = {
        ...companyData,
        branches: companyData.branches.map((branch) =>
          branch._id === updatedBranch._id ? updatedBranch : branch
        ),
      };
      setCompanyData(updatedCompany);
      onCompanyUpdate(updatedCompany); // Notify parent of the update
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <p>Loading company details...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!companyData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p>No company data available. Please try again.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {companyData.name || "Unnamed Company"} - Company Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Company Name
              </Label>
              <p className="text-lg font-semibold">
                {companyData.name || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Created Date
              </Label>
              <p className="text-lg">
                {companyData.createdAt
                  ? new Date(companyData.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <AddBranchForCompanyDialog
                companyId={companyData._id}
                onBranchCreated={handleBranchCreated}
              />
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Branches ({companyData.branches?.length || 0})
              </h3>
            </div>
            <div className="space-y-4">
              {companyData.branches && companyData.branches.length > 0 ? (
                companyData.branches.map((branch) => (
                  <BranchCard
                    key={branch._id}
                    branch={branch}
                    companyId={companyData._id}
                    onBranchUpdate={handleBranchUpdate}
                    onClose={onClose}
                  />
                ))
              ) : (
                <p>No branches available.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
