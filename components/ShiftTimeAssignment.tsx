"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUsersByShiftTimes } from "@/hooks/useGetUsersByShiftTimes";
import { useUpdateUserShiftTimes } from "@/hooks/useUpdateUserShiftTimes";
import { useToast } from "@/hooks/use-toast";
import { Clock, Edit, Loader2, AlertCircle } from "lucide-react";

export default function ShiftTimeAssignment() {
  const { data, isLoading, isError } = useGetUsersByShiftTimes();
  const updateMutation = useUpdateUserShiftTimes();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");

  const handleAssignTime = (user: any) => {
    setSelectedUser(user);
    setShiftStart("");
    setShiftEnd("");
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!shiftStart || !shiftEnd) {
      toast({
        title: "Validation Error",
        description: "Please provide both start and end times",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(
      {
        userId: selectedUser._id,
        data: {
          start: shiftStart,
          end: shiftEnd,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Shift times assigned successfully for ${selectedUser.fullName}`,
          });
          setIsDialogOpen(false);
          setSelectedUser(null);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.error ||
              error.message ||
              "Failed to assign shift times",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Staff Shift Time Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-600">
              Loading staff members...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Staff Shift Time Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading staff members. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  const users = data.users || [];

  // Don't show the section at all if there are no users
  if (users.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-white">
                  Staff Shift Time Assignment
                  <AlertCircle className="h-4 w-4 text-yellow-300 animate-pulse" />
                </CardTitle>
                <p className="text-xs sm:text-sm text-red-100 mt-1">
                  ⚠️ Important: {data.totalCount} staff member
                  {data.totalCount !== 1 ? "s" : ""} need shift time assignment
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-white text-pink-500 font-bold px-3 pt-1"
            >
              Action Required
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border-2 border-red-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-50 hover:bg-red-50">
                  <TableHead className="font-semibold text-red-700">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-red-700">
                    Role
                  </TableHead>
                  <TableHead className="font-semibold text-red-700">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-red-700">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-red-700">
                    Branch
                  </TableHead>
                  <TableHead className="text-right font-semibold text-red-700">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={user._id}
                    className={`hover:bg-red-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-red-50/30"
                    }`}
                  >
                    <TableCell>
                      <div className="font-medium text-sm capitalize text-gray-900">
                        {user.fullName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <Badge
                            key={role._id}
                            variant="outline"
                            className="text-xs border-red-300 text-red-700 bg-red-50"
                          >
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {user.emailAddress}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {user.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {user.branch.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleAssignTime(user)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white border-0"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Assign Shift Time
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assign Time Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Shift Times</DialogTitle>
            <DialogDescription>
              Set shift start and end times for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shiftStart">Shift Start Time</Label>
              <Input
                id="shiftStart"
                type="time"
                value={shiftStart}
                onChange={(e) => {
                  const startTime = e.target.value;
                  setShiftStart(startTime);

                  // Auto-calculate end time (12 hours later)
                  if (startTime) {
                    const [hours, minutes] = startTime.split(":").map(Number);
                    const endDate = new Date();
                    endDate.setHours(hours + 12, minutes, 0, 0);
                    const endTime = `${String(endDate.getHours()).padStart(
                      2,
                      "0"
                    )}:${String(endDate.getMinutes()).padStart(2, "0")}`;
                    setShiftEnd(endTime);
                  }
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shiftEnd">Shift End Time</Label>
              <Input
                id="shiftEnd"
                type="time"
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedUser(null);
              }}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateMutation.isPending || !shiftStart || !shiftEnd}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Times"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
