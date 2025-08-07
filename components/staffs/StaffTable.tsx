"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useDeleteStaff } from "@/hooks/useDeleteStaff";
import api from "@/lib/axios";
import EditStaffDialog from "./EditStaffDialog";
import { useBranches } from "@/hooks/useGetBranches";

const fetchStaffMembers = async () => {
  const response = await api.get("/user/list");
  return response.data;
};

export default function StaffTable() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [editStaff, setEditStaff] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<any | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["staffList"],
    queryFn: fetchStaffMembers,
  });

  useEffect(() => {
    console.log("user table data", data?.users);
  });

  const { mutate: deleteStaffMutation, isPending: isDeleting } =
    useDeleteStaff();

  const roles = ["Manager", "AssistantManager", "Staff"];
  const {
    data: branchData,
    isLoading: isBranchLoading,
    isError: isBranchError,
  } = useBranches();

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
    })) || [];

  const branches = allBranches.map((b) => b.name);

  // useEffect(() => {
  //   console.log("branchesssss", branches);
  // });

  const staffMembers =
    data?.users?.map((staff: any) => ({
      id: staff._id,
      name: staff.fullName,
      email: staff.emailAddress,
      phone: staff.phoneNumber,
      roles: staff.roles?.map((r: any) => r.name) || [],
      locations:
        Array.isArray(staff.locations) && staff.locations.length > 0
          ? staff.locations.map((l: any) => l.name)
          : [],
      branch:
        Array.isArray(staff.branchId) && staff.branchId.length > 0
          ? staff.branchId
              .map((b: any) => b.name || "Assigned Branch Has Been Deleted")
              .join(", ")
          : "Assigned Branch Has Been Deleted",
      companyId:
        Array.isArray(staff.companies) && staff.companies.length > 0
          ? staff.companies[0]._id
          : null,
      company:
        Array.isArray(staff.companies) && staff.companies.length > 0
          ? staff.companies.map((b: any) => b.name).join(", ")
          : "Unknown",
      status: staff.status.toLowerCase(),
      joinDate: new Date(staff.joinDate).toISOString().split("T")[0],
      lastLogin: staff.updatedAt
        ? new Date(staff.updatedAt).toLocaleString()
        : "N/A",
    })) || [];

  const filteredStaff = staffMembers.filter((staff: any) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranches.length === 0 ||
      selectedBranches.includes("all") ||
      selectedBranches.includes(staff.branch);
    const matchesRole =
      selectedRoles.length === 0 ||
      selectedRoles.includes("all") ||
      staff.roles.some((role: string) => selectedRoles.includes(role));
    const matchesStatus =
      selectedStatus === "all" || staff.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Manager":
        return "bg-blue-100 text-blue-800";
      case "Staff":
        return "bg-purple-100 text-purple-800";
      case "AssistantManager":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditStaff = (staff: any) => {
    setEditStaff(staff);
  };

  const handleUpdateStaff = (id: string, data: any) => {
    queryClient.setQueryData(["staffList"], (oldData: any) => ({
      ...oldData,
      users: oldData.users.map((s: any) =>
        s._id === id
          ? {
              ...s,
              fullName: data.fullName,
              emailAddress: data.emailAddress,
              phoneNumber: data.phoneNumber,
              joinDate: data.joinDate,
              roles: data.roles.map((role: string) => ({ name: role })),
              branchId: data.branchId.map((branchId: string) => {
                const branch = allBranches.find((b: any) => b.id === branchId);
                return { _id: branchId, name: branch?.name || "Unknown" };
              }),
              locations: data.locations.map((locId: string) => {
                const branch = user?.companies
                  ?.flatMap((c: any) => c.branches || [])
                  ?.find((b: any) =>
                    b.locations?.some((l: any) => l._id === locId)
                  );

                const location = branch?.locations?.find(
                  (l: any) => l._id === locId
                );
                return location?.name || "Unknown";
              }),
              companies: [
                {
                  _id: data.companyId,
                  name:
                    user?.companies?.find(
                      (company: any) => company._id === data.companyId
                    )?.name || "Unknown",
                },
              ],
            }
          : s
      ),
    }));

    // ✅ THIS LINE TRIGGERS RE-RUN OF `staffMembers` transformation
    queryClient.invalidateQueries({ queryKey: ["staffList"] });

    setEditStaff(null);
  };

  const handleDeleteStaff = (staff: any) => {
    setDeletingStaff(staff);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingStaff) return;
    deleteStaffMutation(deletingStaff.id, {
      onSuccess: () => {
        toast({
          title: "Staff deleted",
          description: `Staff member ${deletingStaff.name} was deleted successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: ["staffList"] });
        setDeleteDialogOpen(false);
        setDeletingStaff(null);
      },
      onError: () => {
        toast({
          title: "Error deleting staff",
          description: "Something went wrong while deleting the staff member.",
          variant: "destructive",
        });
        setDeleteDialogOpen(false);
        setDeletingStaff(null);
      },
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Directory
          </CardTitle>
          <CardDescription>
            Manage and monitor staff across all branches
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="text-center py-8 text-red-600">
              Error loading staff members: {error?.message || "Unknown error"}
            </div>
          )}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Loading staff members...</p>
            </div>
          )}
          {!isLoading && !isError && (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedBranches[0] || "all"}
                  onValueChange={(value) => setSelectedBranches([value])}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch._id} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedRoles[0] || "all"}
                  onValueChange={(value) => setSelectedRoles([value])}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role & Branch</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff: any) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-medium text-md capitalize">
                                {staff.name}
                              </div>
                              {staff.company && (
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 capitalize">
                                  {staff.company}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex flex-col gap-1">
                              {staff.roles.map((role: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  className={`w-fit ${getRoleColor(role)}`}
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center text-sm">
                                <MapPin className="h-3 w-3 mr-1" />
                                {staff.branch.includes(
                                  "Assigned Branch Has Been Deleted"
                                ) ? (
                                  <span className="text-red-600 font-semibold">
                                    {staff.branch}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    {staff.branch}
                                  </span>
                                )}
                              </div>
                              {staff.branch.includes(
                                "Assigned Branch Has Been Deleted"
                              ) && (
                                <div>
                                  <Button
                                    variant="default"
                                    className="text-xs bg-red-400 text-white px-2 h-auto"
                                    onClick={() => handleEditStaff(staff)}
                                  >
                                    Assign Branch
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {staff.email}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {staff.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${getStatusColor(
                              staff.status
                            )}`}
                          >
                            {staff.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {staff.lastLogin}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStaff(staff)}
                              disabled={isDeleting}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStaff(staff)}
                              className="text-red-600 hover:text-red-700"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredStaff.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No staff members found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or add a new staff
                    member.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {editStaff && (
        <EditStaffDialog
          staff={editStaff}
          isOpen={!!editStaff}
          onClose={() => setEditStaff(null)}
          onUpdate={handleUpdateStaff}
        />
      )}

      {/*  Delete staff Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              staff member "{deletingStaff?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingStaff(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
