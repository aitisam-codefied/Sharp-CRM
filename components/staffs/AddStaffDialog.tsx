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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [selectedRole, setSelectedRole] = useState<string>(""); // 🔹 Only one role
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
  });

  const roles = ["Manager", "AssistantManager", "Staff"];
  const isManager = selectedRole === "Manager";
  const isAssistantManager = selectedRole === "AssistantManager";
  const isStaff = selectedRole === "Staff";

  const filteredBranches =
    branches?.filter(
      (branch) => !selectedCompany || branch.companyId?._id === selectedCompany
    ) || [];

  // useEffect(() => {
  //   console.log("filteredBranches", filteredBranches);
  // });

  const allLocations =
    branches?.flatMap((branch) =>
      branch.locations.map((loc) => ({
        ...loc,
        branchId: branch._id, // attach branchId manually
      }))
    ) || [];

  // console.log("allLocations", allLocations);
  // console.log("selectedBranches", selectedBranches);

  const filteredLocations =
    allLocations.filter((location) => {
      if (selectedBranches.length === 0) return true;
      return selectedBranches.includes(
        branches?.find((b) => b._id === location.branchId)?.name || ""
      );
    }) || [];

  // useEffect(() => {
  //   console.log("filteredlocations", filteredLocations);
  // });

  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: (data) => {
      toast({
        title: "Staff Member Added",
        description: `Staff member ${
          data.data?.fullName || "new staff"
        } added.`,
      });
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Staff",
        description:
          error.response?.data?.details ||
          error.message ||
          "Failed to add staff member.",
        variant: "destructive",
      });
    },
  });

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email.trim());

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "", joinDate: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      valid = false;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Valid email is required";
      valid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    }
    if (!formData.joinDate) {
      newErrors.joinDate = "Join date is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [id]: value };

      if (id === "shiftStart" && value) {
        const [h, m] = value.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        d.setHours(d.getHours() + 12);

        updated.shiftEnd = `${String(d.getHours()).padStart(2, "0")}:${String(
          d.getMinutes()
        ).padStart(2, "0")}`;
      }
      return updated;
    });

    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setSelectedBranches([]);
    setSelectedLocations([]);
  };

  const handleBranchChange = (value: string) => {
    if (isManager) {
      // Manager → multi-select branches
      setSelectedBranches((prev) =>
        prev.includes(value)
          ? prev.filter((b) => b !== value)
          : [...prev, value]
      );
    } else {
      // Assistant Manager or Staff → only one branch
      setSelectedBranches([value]);
    }
    setSelectedLocations([]);
  };

  const handleLocationChange = (value: string) => {
    if (isStaff || isAssistantManager) {
      // ✅ Staff & Assistant Manager → multi-select
      setSelectedLocations((prev) =>
        prev.includes(value)
          ? prev.filter((loc) => loc !== value)
          : [...prev, value]
      );
    } else {
      // ✅ Manager → single location (if needed later)
      setSelectedLocations([value]);
    }
  };

  const resetForm = () => {
    setSelectedRole("");
    setSelectedBranches([]);
    setSelectedLocations([]);
    setSelectedCompany(user?.companies?.[0]?._id || "");
    setFormData({
      name: "",
      email: "",
      phone: "",
      joinDate: "",
      shiftStart: "",
      shiftEnd: "",
    });
    setErrors({ name: "", email: "", phone: "", joinDate: "" });
  };

  const handleAddStaff = () => {
    if (!validateForm()) return;

    const branchIds = selectedBranches
      .map((branchName) => {
        const branch = filteredBranches.find((b) => b.name === branchName);
        return branch ? branch._id : null;
      })
      .filter(Boolean);

    const locationIds = selectedLocations
      .map((locName) => {
        const loc = filteredLocations.find((l) => l.name === locName);
        return loc ? loc._id : null;
      })
      .filter(Boolean);

    const backendData = {
      companyId: selectedCompany,
      fullName: formData.name,
      emailAddress: formData.email,
      phoneNumber: formData.phone,
      joinDate: formData.joinDate,
      start: formData.shiftStart,
      end: formData.shiftEnd,
      roles: [selectedRole],
      branches: branchIds,
      locations: locationIds,
    };

    createMutation.mutate(backendData);
  };

  const getOneMonthAgoDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  };

  return (
    <Dialog
      open={isAddDialogOpen}
      onOpenChange={(o) => {
        setIsAddDialogOpen(o);
        if (!o) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" /> Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Enter details for the new staff member
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Company dropdown */}
          {companies?.length > 1 && (
            <div className="space-y-2">
              <Label>Company</Label>
              <Select
                onValueChange={(val) => {
                  setSelectedCompany(val);
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
                  {companies?.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone & Join Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Phone Number</Label>
              <Input
                id="phone"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.phone}
                onChange={(e) => {
                  // sirf digits allow karne ke liye
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({ ...prev, phone: onlyNums }));
                  setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div>
              <Label>Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleInputChange}
                min={getOneMonthAgoDate()}
              />
              {errors.joinDate && (
                <p className="text-sm text-red-600">{errors.joinDate}</p>
              )}
            </div>
          </div>

          {/* Shift Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Shift Start</Label>
              <Input
                id="shiftStart"
                type="time"
                step="60"
                value={formData.shiftStart}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Shift End</Label>
              <Input
                id="shiftEnd"
                type="time"
                step="60"
                value={formData.shiftEnd}
                readOnly
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branch selection */}
          {selectedRole && (
            <div>
              <Label>Branch{isManager ? "(es)" : ""}</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedBranches.length > 0
                      ? selectedBranches.join(", ")
                      : "Select branches"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search branches..." />
                    <CommandEmpty>No branch found.</CommandEmpty>
                    <CommandGroup>
                      {filteredBranches.map((b) => (
                        <CommandItem
                          key={b._id}
                          onSelect={() => {
                            if (isManager) {
                              setSelectedBranches((prev) =>
                                prev.includes(b.name)
                                  ? prev.filter((v) => v !== b.name)
                                  : [...prev, b.name]
                              );
                            } else {
                              setSelectedBranches([b.name]); // single select for non-managers
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedBranches.includes(b.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {b.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Location selection (only Staff) */}
          {(isStaff || isAssistantManager) && selectedBranches.length > 0 && (
            <div>
              <Label>Location(s)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedLocations.length > 0
                      ? selectedLocations.join(", ")
                      : "Select locations"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search locations..." />
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup>
                      {filteredLocations.map((loc) => (
                        <CommandItem
                          key={loc._id}
                          onSelect={() => {
                            setSelectedLocations((prev) =>
                              prev.includes(loc.name)
                                ? prev.filter((v) => v !== loc.name)
                                : [...prev, loc.name]
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedLocations.includes(loc.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {loc.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddStaff}
            disabled={
              !formData.name ||
              !validateEmail(formData.email) ||
              !formData.phone ||
              !formData.joinDate ||
              !selectedRole ||
              selectedBranches.length === 0 ||
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
