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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { StyledPhoneInput, validatePhone } from "../StyledFormInput";

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
  const [selectedRoles, setSelectedRoles] = useState<string>(
    staff.roles?.[0] || ""
  );

  const filteredBranches =
    branches?.filter(
      (branch: any) => branch.companyId?._id === selectedCompany
    ) || [];

  // const [selectedBranches, setSelectedBranches] = useState<string[]>(
  //   filteredBranches.some((b: any) => b.name === staff.branch)
  //     ? [staff.branch]
  //     : []
  // );

  const [selectedBranches, setSelectedBranches] = useState<string[]>(() => {
    if (!staff.branchIds || staff.branchIds.length === 0) return [];

    // Staff ke branch IDs ke against filteredBranches ke names nikalo
    return filteredBranches
      .filter((b: any) => staff.branchIds.includes(b._id))
      .map((b: any) => b.name);
  });

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

  function formatDateForInput(dateStr?: string) {
    if (!dateStr) return "";
    // Try native parse
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }

    // Fallback: handle "9th September 2025" like strings
    try {
      const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1"); // remove st/nd/rd/th
      const parsedFallback = new Date(cleaned);
      if (!isNaN(parsedFallback.getTime())) {
        return parsedFallback.toISOString().split("T")[0];
      }
    } catch (e) {
      console.warn("Invalid joinDate format:", dateStr);
    }

    return "";
  }

  const [formData, setFormData] = useState({
    name: staff.name || "",
    email: staff.email || "",
    phone: staff.phone || "",
    joinDate: formatDateForInput(staff.joinDate),
    shiftStart: staff.shiftTimes?.[0]?.start || "",
    shiftEnd: staff.shiftTimes?.[0]?.end || "",
  });

  const statusOptions = ["active", "inactive", "suspended"];
  const [selectedStatus, setSelectedStatus] = useState(
    staff.status || "active"
  );

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setChangedFields((prev) =>
      prev.includes("status") ? prev : [...prev, "status"]
    );
  };

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
  const isGeneralManager = selectedRoles === "Manager";
  const isAssistantManagerOrStaff =
    selectedRoles === "AssistantManager" || selectedRoles === "Staff";

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
        branch: data?.branches,
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
    } else if (formData.name.length > 32) {
      newErrors.name = "Name must not exceed 32 characters";
      isValid = false;
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      newErrors.phone = phoneErr;
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
      let updatedForm = { ...prev };

      if (id === "phone") {
        // sirf digits allow karna
        const onlyNums = value.replace(/\D/g, "");
        updatedForm.phone = onlyNums;
      } else {
        updatedForm[id] = value;
      }

      if (id === "shiftStart" && value) {
        const [hours, minutes] = value.split(":").map(Number);
        const newEnd = new Date();
        newEnd.setHours(hours + 12, minutes);
        const formattedEnd = newEnd
          .toTimeString()
          .split(":")
          .slice(0, 2)
          .join(":");

        updatedForm.shiftEnd = formattedEnd;
        setChangedFields((prev) =>
          prev.includes("shiftEnd") ? prev : [...prev, "shiftEnd"]
        );
      }

      return updatedForm;
    });

    setChangedFields((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRoleChange = (value: string) => {
    setSelectedRoles(value);
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
      ...(changedFields.includes("roles") && { roles: [selectedRoles] }),
      ...(changedFields.includes("branchId") && { branches: branchIds }),
      ...(changedFields.includes("locations") && { locations: locationIds }),
      ...(changedFields.includes("status") && { status: selectedStatus }),
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
      <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, name: value }));
                  setChangedFields((prev) =>
                    prev.includes("name") ? prev : [...prev, "name"]
                  );
                  setErrors((prev) => ({
                    ...prev,
                    name:
                      value.length > 32
                        ? "Name must not exceed 32 characters"
                        : "",
                  }));
                }}
                maxLength={40} // optional UI limit
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
                readOnly
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <StyledPhoneInput
                id="phone"
                value={formData.phone}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, phone: val || "" }));
                  setChangedFields((prev) =>
                    prev.includes("phone") ? prev : [...prev, "phone"]
                  );
                  setErrors((prev) => ({
                    ...prev,
                    phone: validatePhone(val || ""),
                  }));
                }}
                error={errors.phone}
                defaultCountry="GB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                min={getOneMonthAgoDate()}
                value={formData.joinDate}
                onChange={handleInputChange}
                readOnly
              />
              {errors.joinDate && (
                <p className="text-sm text-red-600">{errors.joinDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                readOnly
              />
              {errors.shiftEnd && (
                <p className="text-sm text-red-600">{errors.shiftEnd}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={handleRoleChange}
                value={selectedRoles}
                disabled={
                  updateMutation.isPending || staff.roles?.[0] === "Manager"
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {staff.roles?.[0] === "Manager" && (
                <p className="text-xs text-muted-foreground">
                  Manager role cannot be changed.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={handleStatusChange}
                value={selectedStatus}
                disabled={updateMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch(es)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={selectedRoles.length === 0 || !selectedCompany}
                >
                  {selectedBranches.length > 0
                    ? selectedBranches.join(", ")
                    : "Select branch(es)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[300px] p-0"
                side="bottom"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search branches..." />
                  <CommandEmpty>No branch found.</CommandEmpty>
                  <CommandGroup>
                    {filteredBranches.map((branch: any) => (
                      <CommandItem
                        key={branch._id}
                        onSelect={() => {
                          if (isGeneralManager) {
                            setSelectedBranches((prev) =>
                              prev.includes(branch.name)
                                ? prev.filter((b) => b !== branch.name)
                                : [...prev, branch.name]
                            );
                          } else {
                            setSelectedBranches([branch.name]);
                          }
                          setChangedFields((prev) =>
                            prev.includes("branchId")
                              ? prev
                              : [...prev, "branchId"]
                          );
                          setSelectedLocations([]);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedBranches.includes(branch.name)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {branch.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {isAssistantManagerOrStaff && (
            <div className="space-y-2">
              <Label htmlFor="location">Location(s)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={selectedBranches.length === 0}
                  >
                    {selectedLocations.length > 0
                      ? selectedLocations.join(", ")
                      : "Select location(s)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[300px] p-0"
                  side="bottom"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search locations..." />
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup>
                      {filteredLocations.map((location: any) => (
                        <CommandItem
                          key={location._id}
                          onSelect={() => {
                            if (isAssistantManagerOrStaff) {
                              setSelectedLocations((prev) =>
                                prev.includes(location.name)
                                  ? prev.filter((l) => l !== location.name)
                                  : [...prev, location.name]
                              );
                            } else {
                              setSelectedLocations([location.name]);
                            }
                            setChangedFields((prev) =>
                              prev.includes("locations")
                                ? prev
                                : [...prev, "locations"]
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedLocations.includes(location.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {location.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStaff}
            // disabled={
            //   changedFields.length === 0 ||
            //   !formData.name ||
            //   formData.name.length > 32 ||
            //   !formData.email ||
            //   !formData.phone ||
            //   !!validatePhone(formData.phone) ||
            //   !formData.joinDate ||
            //   selectedRoles.length === 0 ||
            //   selectedBranches.length === 0 ||
            //   !selectedCompany ||
            //   updateMutation.isPending
            // }
            disabled={updateMutation.isPending || changedFields.length === 0}
          >
            {updateMutation.isPending ? "Updating..." : "Update Staff Member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
