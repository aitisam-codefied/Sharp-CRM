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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Calendar, Edit, CheckCircle, X } from "lucide-react";
import BranchCard from "./BranchCard";
import AddBranchForCompanyDialog from "./AddBranchForCompanyDialog";
import { useUpdateCompany } from "@/hooks/useUpdateCompany";
import { useToast } from "@/hooks/use-toast";
import { getCompanyById } from "@/hooks/useGetCompanyById";

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
  isEditable,
  onClose,
  onCompanyUpdate,
}: {
  company: Company | null;
  isOpen: boolean;
  isEditable: boolean;
  onClose: () => void;
  onCompanyUpdate: (updatedCompany: Company) => void;
}) {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCompanyName, setEditingCompanyName] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const { toast } = useToast();

  const updateCompanyMutation = useUpdateCompany(
    companyData?._id!,
    (updatedCompany) => {
      setCompanyData((prev) => {
        if (!prev) return updatedCompany;
        return {
          ...prev,
          name: updatedCompany.name, // update only the name
        };
      });

      setCompanyName(updatedCompany.name); // reflect in input
      onCompanyUpdate(updatedCompany); // propagate update to parent
    }
  );

  useEffect(() => {
    if (!company) return;

    setIsLoading(true);

    setCompanyData((prev) => {
      // Avoid resetting if the ID matches and name hasn’t changed
      if (prev && prev._id === company._id && prev.name === company.name) {
        return prev;
      }
      return company;
    });

    setCompanyName((prevName) => {
      if (prevName === company.name) {
        return prevName;
      }
      return company.name || "";
    });

    setEditingCompanyName(false);
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
        amenities: string[];
      }>;
    }>;
  }) => {
    // console.log("New branch created:", newBranch);
    // console.log("ID:", newBranch._id);
    if (companyData) {
      const updatedCompany = {
        ...companyData,
        branches: [...companyData.branches, newBranch],
      };
      setCompanyData(updatedCompany);
      onCompanyUpdate(updatedCompany);
    }
  };

  // Handle branch deletion
  const handleBranchDelete = (branchId: string) => {
    if (companyData) {
      const updatedCompany = {
        ...companyData,
        branches: companyData.branches.filter(
          (branch) => branch._id !== branchId
        ),
      };
      setCompanyData(updatedCompany);
      onCompanyUpdate(updatedCompany);
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
      onCompanyUpdate(updatedCompany);
    }
  };

  const handleSaveCompanyName = () => {
    if (!companyData || !companyName) return;

    updateCompanyMutation.mutate(
      { name: companyName },
      {
        onSuccess: (updatedCompany) => {
          // update state (already handled in your hook callback)
          setEditingCompanyName(false); // ✅ EXIT EDIT MODE IMMEDIATELY HERE
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
          <DialogHeader className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <DialogTitle className="text-xl">
              Loading Company Details...
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!companyData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <DialogTitle className="text-xl text-red-600">Error</DialogTitle>
            <p className="text-gray-600 mt-2">
              No company data available. Please try again.
            </p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl 2xl:max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-2xl">
        <DialogHeader className="p-6 -m-6 mb-2 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building className="h-6 w-6" />
            </div>
            <div className="flex-1">
              {isEditable && editingCompanyName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-white/95 border-2 border-[#F87D7D]/50 text-gray-900 placeholder:text-gray-500 text-lg font-semibold focus:outline-none rounded-lg w-[40%]"
                    placeholder="Enter company name"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveCompanyName}
                    disabled={updateCompanyMutation.isPending}
                    className="h-10 w-10 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg"
                  >
                    {updateCompanyMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingCompanyName(false);
                      setCompanyName(companyData.name);
                    }}
                    className="h-10 w-10 bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="font-bold">
                    {companyName || "Unnamed Company"}
                  </div>
                  {isEditable && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCompanyName(true)}
                      className="h-8 w-8 hover:bg-amber-100 hover:text-amber-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              <div className="text-gray-500 text-sm font-normal capitalize">
                {companyData.type} Company
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 p-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company Name
              </Label>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {companyData.name || "N/A"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created Date
              </Label>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {companyData.createdAt
                  ? new Date(companyData.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Total Branches
              </Label>
              <p className="text-3xl font-bold mt-2">
                {companyData.branches?.length || 0}
              </p>
            </div>
          </div>

          {isEditable && (
            <div className="flex justify-between items-center">
              <div></div>
              <AddBranchForCompanyDialog
                companyId={companyData._id}
                existingBranches={companyData.branches || []}
                onBranchCreated={handleBranchCreated}
              />
            </div>
          )}

          <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                Branches Overview
                <Badge
                  variant="outline"
                  className="border-[#F87D7D]/50 text-[#F87D7D] bg-[#F87D7D]/10 font-semibold"
                >
                  {companyData.branches?.length || 0} Total
                </Badge>
              </h3>
            </div>

            <div className="space-y-6">
              {companyData.branches && companyData.branches.length > 0 ? (
                companyData.branches.map((branch) => (
                  <div
                    key={branch._id}
                    className="transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    <BranchCard
                      branch={branch}
                      companyId={companyData._id}
                      onBranchUpdate={handleBranchUpdate}
                      isEditable={isEditable}
                      onClose={onClose}
                      onBranchDelete={handleBranchDelete}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No branches available</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add your first branch to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
