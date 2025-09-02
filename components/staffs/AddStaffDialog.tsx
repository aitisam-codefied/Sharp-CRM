"use client";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import api from "@/lib/axios";
import { useCompanies } from "@/hooks/useCompnay";
import { useBranches } from "@/hooks/useGetBranches";
import { useLocations } from "@/hooks/useGetLocations";

const createStaff = async (staffData: any) => {
  const response = await api.post("/user/create", staffData);
  return response.data;
};

export default function AddStaffDialog() {
  const { user } = useAuth();
  const { data: companies } = useCompanies();
  const { data: branches } = useBranches();
  const { data: locations } = useLocations();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(
    user?.companies?.[0]?._id || ""
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    shiftStart: "",
    shiftEnd: "",
  });
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

  const filteredBranches =
    branches?.filter(
      (branch) => !selectedCompany || branch.companyId?._id === selectedCompany
    ) || [];

  const filteredLocations =
    locations?.filter((location) => {
      if (selectedBranches.length === 0) {
        return true; // Show all locations if no branches selected
      }
      const selectedBranchIds = filteredBranches
        .filter((b) => selectedBranches.includes(b.name))
        .map((b) => b._id);
      // console.log("selectedBranchIds:", selectedBranchIds);
      // console.log("location.branchId:", location.branchId);
      return selectedBranchIds.includes(location.branchId);
    }) || [];

  // useEffect(() => {
  //   console.log("selectedBranches:", selectedBranches);
  //   console.log("filteredBranches:", filteredBranches);
  //   console.log("locations:", locations);
  //   console.log("filteredLocations:", filteredLocations);
  // }, [selectedBranches, filteredBranches, locations, filteredLocations]);

  // useEffect(() => {
  //   console.log("locationssss", filteredLocations);
  // });

  // useEffect(() => {
  //   console.log("Raw locations data:", JSON.stringify(locations, null, 2));
  // }, [locations]);

  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: (data) => {
      toast({
        title: "Staff Member Added",
        description: `Staff member ${
          data.data?.fullName || "new staff"
        } has been successfully added.`,
      });
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Staff",
        description:
          error.response?.data?.error ||
          error.message ||
          "Failed to add staff member. Please try again.",
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

    setFormData((prev) => {
      let updatedForm = { ...prev, [id]: value };

      // 🔹 If shiftStart is updated, auto-set shiftEnd = shiftStart + 12 hours
      if (id === "shiftStart" && value) {
        const [hours, minutes] = value.split(":").map(Number);
        const newDate = new Date();
        newDate.setHours(hours, minutes, 0, 0);
        newDate.setHours(newDate.getHours() + 12);

        // Format back to HH:mm
        const newHours = String(newDate.getHours()).padStart(2, "0");
        const newMinutes = String(newDate.getMinutes()).padStart(2, "0");

        updatedForm.shiftEnd = `${newHours}:${newMinutes}`;
      }

      return updatedForm;
    });

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

  const resetForm = () => {
    setSelectedRoles([]);
    setSelectedBranches([]);
    setSelectedLocations([]);
    setSelectedCompany(user?.companies?.[0]?._id || "");
    setFormData({ name: "", email: "", phone: "", joinDate: "" });
    setErrors({ name: "", email: "", phone: "", joinDate: "" });
  };

  const handleAddStaff = () => {
    if (!validateForm()) return;

    const branchIds = selectedBranches
      .map((branchName) => {
        const branch = filteredBranches.find((b) => b.name === branchName);
        return branch ? branch._id : null;
      })
      .filter((id) => id !== null);

    const locationIds = selectedLocations
      .map((locationName) => {
        const location = filteredLocations.find(
          (loc) => loc.name === locationName
        );
        return location ? location._id : null;
      })
      .filter((id) => id !== null);

    const backendData = {
      companyId: selectedCompany,
      fullName: formData.name,
      emailAddress: formData.email,
      phoneNumber: formData.phone,
      joinDate: formData.joinDate,
      start: formData.shiftStart,
      end: formData.shiftEnd,
      roles: selectedRoles,
      branches: branchIds,
      locations: locationIds,
    };
    console.log("backendData", backendData);

    createMutation.mutate(backendData);
  };

  const getOneMonthAgoDate = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return now.toISOString().split("T")[0];
  };

  return (
    <Dialog
      open={isAddDialogOpen}
      onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Enter the details for the new staff member
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {companies?.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedCompany(value);
                  setSelectedBranches([]);
                  setSelectedLocations([]);
                }}
                value={selectedCompany}
                disabled={createMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company) => (
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
                disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
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
                value={formData.joinDate}
                onChange={handleInputChange}
                disabled={createMutation.isPending}
                min={getOneMonthAgoDate()}
              />
              {errors.joinDate && (
                <p className="text-sm text-red-600">{errors.joinDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shiftStart">Shift Start Time</Label>{" "}
              <Input
                id="shiftStart"
                type="time"
                step="60"
                value={formData.shiftStart || ""}
                onChange={handleInputChange}
                disabled={createMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shiftEnd">Shift End Time</Label>
              <Input
                id="shiftEnd"
                type="time"
                step="60"
                value={formData.shiftEnd || ""}
                onChange={handleInputChange}
                disabled={createMutation.isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role(s)</Label>
              <Select
                onValueChange={handleRoleChange}
                value=""
                disabled={createMutation.isPending}
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
                disabled={
                  selectedRoles.length === 0 ||
                  (companies?.length > 1 && !selectedCompany) ||
                  createMutation.isPending
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
                  {filteredBranches.map((branch) => (
                    <SelectItem key={branch._id} value={branch.name}>
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
          </div>
          {isAssistantManagerOrStaff && (
            <div className="space-y-2">
              <Label htmlFor="location">Location(s)</Label>
              <Select
                onValueChange={handleLocationChange}
                value=""
                disabled={
                  selectedBranches.length === 0 || createMutation.isPending
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
                  {filteredLocations.map((location) => (
                    <SelectItem key={location._id} value={location.name}>
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
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddStaff}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.phone ||
              !formData.joinDate ||
              selectedRoles.length === 0 ||
              selectedBranches.length === 0 ||
              (companies?.length > 1 && !selectedCompany) ||
              createMutation.isPending
            }
          >
            {createMutation.isPending ? "Adding..." : "Add Staff Member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
