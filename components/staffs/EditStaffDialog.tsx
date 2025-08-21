"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useCompanies } from "@/hooks/useCompnay";
import { useBranches } from "@/hooks/useGetBranches";
import { useLocations } from "@/hooks/useGetLocations";
import api from "@/lib/axios";

const updateStaff = async ({
  id,
  staffData,
}: {
  id: string;
  staffData: any;
}) => {
  console.log("Sending staff update:", staffData);
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [] } = useCompanies();
  const { data: branches = [] } = useBranches();
  const { data: locations = [] } = useLocations();

  const [selectedCompany, setSelectedCompany] = useState(
    staff.companyId || companies?.[0]?._id || ""
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    staff.roles || []
  );

  const filteredBranches =
    branches?.filter(
      (branch: any) => branch.companyId?._id === selectedCompany
    ) || [];

  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    filteredBranches.some((b: any) => b.name === staff.branch)
      ? [staff.branch]
      : []
  );

  const filteredLocations =
    locations?.filter((location: any) => {
      const selectedBranchIds = filteredBranches
        .filter((b: any) => selectedBranches.includes(b.name))
        .map((b: any) => b?._id);
      return selectedBranchIds.includes(location.branchId);
    }) || [];

  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    staff.locations || []
  );

  useEffect(() => {
    console.log("Staff prop:", staff);
  }, [staff]);

  const [formData, setFormData] = useState({
    name: staff.name || "",
    email: staff.email || "",
    phone: staff.phone || "",
    joinDate: staff.joinDate || "",
    shiftStart: staff.shiftTimes?.[0]?.start || "",
    shiftEnd: staff.shiftTimes?.[0]?.end || "",
  });

  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    shiftStart: "",
    shiftEnd: "",
  });

  const roles = ["Manager", "AssistantManager", "Staff"];
  const isGeneralManager = selectedRoles.includes("Manager");
  const isAssistantManagerOrStaff = selectedRoles.some(
    (role) => role === "AssistantManager" || role === "Staff"
  );

  const updateMutation = useMutation({
    mutationFn: updateStaff,
    onSuccess: (data) => {
      toast({
        title: "Staff Member Updated",
        description: `Staff member ${
          data?.fullName || formData.name || "staff"
        } has been successfully updated.`,
      });

      const updatedData = {
        id: data?._id,
        fullName: data?.fullName,
        emailAddress: data?.emailAddress,
        phoneNumber: data?.phoneNumber,
        joinDate: data?.joinDate,
        start: data?.shiftStart,
        end: data?.shiftEnd,
        roles: data?.roles,
        branch: data?.branchId,
        locations: data?.locations,
        company: data?.companyId || "",
      };

      onUpdate(data?._id, updatedData);
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      onClose();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to update staff member. Please try again.";
      toast({
        title: "Error",
        description: message,
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
    setChangedFields((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRoleChange = (value: string) => {
    setSelectedRoles((prev) =>
      prev.includes(value)
        ? prev.filter((role) => role !== value)
        : [...prev, value]
    );
    setChangedFields((prev) =>
      prev.includes("roles") ? prev : [...prev, "roles"]
    );
    setSelectedBranches([]);
    setSelectedLocations([]);
  };

  const handleBranchChange = (value: string) => {
    if (isGeneralManager) {
      setSelectedBranches((prev) =>
        prev.includes(value)
          ? prev.filter((b) => b !== value)
          : [...prev, value]
      );
    } else {
      setSelectedBranches([value]);
    }
    setChangedFields((prev) =>
      prev.includes("branchId") ? prev : [...prev, "branchId"]
    );
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
    setChangedFields((prev) =>
      prev.includes("locations") ? prev : [...prev, "locations"]
    );
  };

  const handleUpdateStaff = () => {
    if (!validateForm()) return;

    const branchIds = selectedBranches
      .map((branchName) => {
        const branch = filteredBranches.find((b: any) => b.name === branchName);
        return branch ? branch._id : null;
      })
      .filter(Boolean);

    const locationIds = selectedLocations
      .map((locationName) => {
        const location = filteredLocations.find(
          (l: any) => l.name === locationName
        );
        return location ? location?._id : null;
      })
      .filter(Boolean);

    const backendData = {
      ...(changedFields.includes("companyId") && {
        companyId: [selectedCompany],
      }),
      ...(changedFields.includes("name") && { fullName: formData.name }),
      ...(changedFields.includes("email") && { emailAddress: formData.email }),
      ...(changedFields.includes("phone") && { phoneNumber: formData.phone }),
      ...(changedFields.includes("joinDate") && {
        joinDate: formData.joinDate,
      }),
      ...(changedFields.includes("shiftStart") && {
        start: formData.shiftStart,
      }),
      ...(changedFields.includes("shiftEnd") && {
        end: formData.shiftEnd,
      }),
      ...(changedFields.includes("roles") && { roles: selectedRoles }),
      ...(changedFields.includes("branchId") && { branchId: branchIds }),
      ...(changedFields.includes("locations") && { locations: locationIds }),
    };

    if (Object.keys(backendData).length === 0) {
      toast({
        title: "No Changes",
        description: "No fields were modified.",
      });
      return;
    }

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
          {companies?.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedCompany(value);
                  setChangedFields((prev) =>
                    prev.includes("companyId") ? prev : [...prev, "companyId"]
                  );
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
                  {companies.map((company: any) => (
                    <SelectItem key={company?._id} value={company?._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
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
                value={formData.email}
                onChange={handleInputChange}
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
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                min={getOneMonthAgoDate()}
                value={formData.joinDate}
                onChange={handleInputChange}
              />
              {errors.joinDate && (
                <p className="text-sm text-red-600">{errors.joinDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shiftStart">Shift Start</Label>
              <Input
                id="shiftStart"
                type="time"
                value={formData.shiftStart}
                onChange={handleInputChange}
              />
              {errors.shiftStart && (
                <p className="text-sm text-red-600">{errors.shiftStart}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shiftEnd">Shift End</Label>
              <Input
                id="shiftEnd"
                type="time"
                value={formData.shiftEnd}
                onChange={handleInputChange}
              />
              {errors.shiftEnd && (
                <p className="text-sm text-red-600">{errors.shiftEnd}</p>
              )}
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="branch">Branch(es)</Label>
            <Select
              onValueChange={handleBranchChange}
              value=""
              disabled={selectedRoles.length === 0 || !selectedCompany}
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
                {filteredBranches.map((branch: any) => (
                  <SelectItem key={branch?._id} value={branch.name}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(branch.name)}
                        readOnly
                        className="mr-2"
                        disabled={!isGeneralManager}
                      />
                      {branch.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAssistantManagerOrStaff && (
            <div className="space-y-2">
              <Label htmlFor="location">Location(s)</Label>
              <Select
                onValueChange={handleLocationChange}
                value=""
                disabled={selectedBranches.length === 0}
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
                  {filteredLocations.map((location: any) => (
                    <SelectItem key={location?._id} value={location.name}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location.name)}
                          readOnly
                          className="mr-2"
                        />
                        {location.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
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
              !selectedCompany ||
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
