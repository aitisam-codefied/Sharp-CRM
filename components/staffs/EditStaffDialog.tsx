"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import api from "@/lib/axios";

const updateStaff = async ({
  id,
  staffData,
}: {
  id: string;
  staffData: any;
}) => {
  const response = await api.patch(`/user/${id}`, staffData);
  return response.data;
};

export default function EditStaffDialog({
  staff,
  isOpen,
  onClose,
  onUpdate,
}: {
  staff: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCompany, setSelectedCompany] = useState(
    user?.companies?.find((c: any) =>
      c.branches?.some((b: any) => b.name === staff.branch)
    )?._id ||
      user?.companies?.[0]?._id ||
      ""
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(staff.roles);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    staff.branch,
  ]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    joinDate: staff.joinDate,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
  });

  const roles = ["Manager", "AssistantManager", "Staff"];
  const isGeneralManager = selectedRoles.includes("Manager");
  const isAssistantManagerOrStaff = selectedRoles.some(
    (role) => role === "AssistantManager" || role === "Staff"
  );

  const allBranches =
    user?.companies
      ?.filter(
        (company: any) => !selectedCompany || company._id === selectedCompany
      )
      ?.flatMap((company: any) => company.branches || [])
      ?.map((branch: any) => ({
        id: branch._id,
        name: branch.name,
        locations:
          branch.locations?.map((loc: any) => ({
            id: loc._id,
            name: loc.name,
          })) || [],
      })) || [];

  const branches = Array.from(
    new Set(allBranches.map((branch: any) => branch.name))
  );

  const locations = allBranches
    .filter((branch: any) => selectedBranches.includes(branch.name))
    .flatMap(
      (branch: any) => branch.locations.map((loc: any) => loc.name) || []
    );

  const updateMutation = useMutation({
    mutationFn: updateStaff,
    onSuccess: (data) => {
      toast({
        title: "Staff Member Updated",
        description: `Staff member ${
          data.data?.fullName || "staff"
        } has been successfully updated.`,
      });
      onUpdate(staff.id, data.data);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Staff",
        description:
          error.response?.data?.error ||
          "Failed to update staff member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "", joinDate: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }
    if (!formData.joinDate) {
      newErrors.joinDate = "Join date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRoleChange = (value: string) => {
    setSelectedRoles((prev) =>
      prev.includes(value)
        ? prev.filter((role) => role !== value)
        : [...prev, value]
    );
    setSelectedBranches([]);
    setSelectedLocations([]);
  };

  const handleBranchChange = (value: string) => {
    if (isGeneralManager) {
      setSelectedBranches((prev) =>
        prev.includes(value)
          ? prev.filter((branch) => branch !== value)
          : [...prev, value]
      );
    } else {
      setSelectedBranches([value]);
    }
    setSelectedLocations([]);
  };

  const handleLocationChange = (value: string) => {
    if (isAssistantManagerOrStaff) {
      setSelectedLocations((prev) =>
        prev.includes(value)
          ? prev.filter((loc) => loc !== value)
          : [...prev, value]
      );
    } else {
      setSelectedLocations([value]);
    }
  };

  const handleUpdateStaff = () => {
    if (!validateForm()) return;

    const branchIds = selectedBranches
      .map((branchName) => {
        const branch = allBranches.find((b: any) => b.name === branchName);
        return branch ? branch.id : null;
      })
      .filter((id) => id !== null);

    const locationIds = selectedLocations
      .map((locationName) => {
        const branch = allBranches.find((b: any) =>
          b.locations.some((loc: any) => loc.name === locationName)
        );
        const location = branch?.locations.find(
          (loc: any) => loc.name === locationName
        );
        return location ? location.id : null;
      })
      .filter((id) => id !== null);

    const backendData = {
      companyId: selectedCompany,
      fullName: formData.name,
      emailAddress: formData.email,
      phoneNumber: formData.phone,
      joinDate: formData.joinDate,
      roles: selectedRoles,
      branchId: branchIds,
      locations: locationIds,
    };

    updateMutation.mutate({ id: staff.id, staffData: backendData });
  };

  const getOneMonthAgoDate = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return now.toISOString().split("T")[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update the details for the staff member
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {user?.companies?.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedCompany(value);
                  setSelectedBranches([]);
                  setSelectedLocations([]);
                }}
                value={selectedCompany}
                disabled={updateMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {user?.companies?.map((company: any) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role(s)</Label>
              <Select
                onValueChange={handleRoleChange}
                value=""
                disabled={updateMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedRoles.length > 0
                        ? selectedRoles.join(", ")
                        : "Select role(s)"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role)}
                          readOnly
                          className="mr-2"
                        />
                        {role}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch(es)</Label>
              <Select
                onValueChange={handleBranchChange}
                value=""
                disabled={
                  selectedRoles.length === 0 ||
                  (user?.companies?.length > 1 && !selectedCompany) ||
                  updateMutation.isPending
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedBranches.length > 0
                        ? selectedBranches.join(", ")
                        : "Select branch(es)"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(branch)}
                          readOnly
                          className="mr-2"
                          disabled={!isGeneralManager}
                        />
                        {branch}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
                min={getOneMonthAgoDate()}
              />
              {errors.joinDate && (
                <p className="text-sm text-red-600">{errors.joinDate}</p>
              )}
            </div>
          </div>
          {isAssistantManagerOrStaff && (
            <div className="space-y-2">
              <Label htmlFor="location">Location(s)</Label>
              <Select
                onValueChange={handleLocationChange}
                value=""
                disabled={
                  selectedBranches.length === 0 || updateMutation.isPending
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedLocations.length > 0
                        ? selectedLocations.join(", ")
                        : "Select location(s)"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location)}
                          readOnly
                          className="mr-2"
                        />
                        {location}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStaff}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.phone ||
              !formData.joinDate ||
              selectedRoles.length === 0 ||
              selectedBranches.length === 0 ||
              (user?.companies?.length > 1 && !selectedCompany) ||
              updateMutation.isPending
            }
          >
            {updateMutation.isPending ? "Updating..." : "Update Staff Member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
