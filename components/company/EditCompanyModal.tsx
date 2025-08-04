"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateCompany, Company } from "@/hooks/useUpdateCompany";

export default function EditCompanyModal({
  company,
  isOpen,
  onClose,
  onSave,
}: {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCompany: Company) => void;
}) {
  const [editData, setEditData] = useState<Company | null>(
    company ? { ...company } : null
  );

  useEffect(() => {
    setEditData(company ? { ...company } : null);
  }, [company]);

  const updateCompanyMutation = useUpdateCompany(onSave);

  const handleSaveEdit = () => {
    if (!editData || !editData._id) return;

    updateCompanyMutation.mutate(editData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        {editData ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                placeholder="Enter company name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updateCompanyMutation.isPending}
              >
                {updateCompanyMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No company data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
