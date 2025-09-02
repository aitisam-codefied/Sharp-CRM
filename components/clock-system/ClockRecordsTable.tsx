"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  CheckCircle,
  Timer,
  MapPin,
  Clock,
  Coffee,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ClockRecord } from "@/lib/types";

interface ClockRecordsTableProps {
  clockRecords: ClockRecord[];
  branches: any[];
}

export default function ClockRecordsTable({
  clockRecords,
  branches,
}: ClockRecordsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    console.log("clockRecords", clockRecords);
  }, [clockRecords]);

  const filteredRecords = clockRecords.filter((record: ClockRecord) => {
    const matchesSearch =
      record.staff.fullName
        ?.toLowerCase()
        .includes(searchTerm?.toLowerCase()) ||
      record.staff.username?.toLowerCase().includes(searchTerm?.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || record.branch._id === selectedBranch;
    const matchesDate = selectedDate === "" || record.date === selectedDate;

    return matchesSearch && matchesBranch && matchesDate;
  });

  const getStatusBadge = (
    value: boolean,
    trueText: string,
    falseText: string,
    trueColor: string,
    falseColor: string,
    icon: React.ReactNode
  ) => {
    return (
      <Badge
        className={`${
          value ? trueColor : falseColor
        } flex items-center gap-1 w-fit`}
      >
        {icon}
        {value ? trueText : falseText}
      </Badge>
    );
  };

  const handleManualClockIn = () => {
    toast({
      title: "Manual Clock In",
      description: "Staff member has been manually clocked in.",
    });
  };

  const handleManualClockOut = () => {
    toast({
      title: "Manual Clock Out",
      description: "Staff member has been manually clocked out.",
    });
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or staff ID..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedDate(e.target.value)
          }
          className="w-full"
        />
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                <div className="flex items-center gap-2">
                  <span>{branch.name}</span>-
                  <Badge className="bg-[#F87D7D] text-white">
                    {branch.company}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Branch & Location</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Late</TableHead>
              <TableHead>Early</TableHead>
              <TableHead>On Break</TableHead>
              <TableHead>Disconnected</TableHead>
              {/* <TableHead>Early Departure</TableHead> */}

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record: ClockRecord) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {/* <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {record.staff.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar> */}
                      <div>
                        <div className="font-medium">
                          {record.staff.fullName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {record.branch.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {record.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-mono text-sm">
                        {record.clockIn}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.clockOut ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="font-mono text-sm">
                          {record.clockOut}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">
                          Active
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{record.totalHours}</span>
                      {record.overtime && (
                        <Badge variant="secondary" className="text-xs">
                          OT
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      record.isLate,
                      "Late",
                      "On Time",
                      "bg-red-100 text-red-800",
                      "bg-green-100 text-green-800",
                      record.isLate ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      record.isEarly,
                      "Early",
                      "Normal",
                      "bg-orange-100 text-orange-800",
                      "bg-gray-100 text-gray-800",
                      record.isEarly ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      record.isOnBreak,
                      "On Break",
                      "Working",
                      "bg-yellow-100 text-yellow-800",
                      "bg-green-100 text-green-800",
                      record.isOnBreak ? (
                        <Coffee className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      record.isDisconnected,
                      "Disconnected",
                      "Connected",
                      "bg-purple-100 text-purple-800",
                      "bg-green-100 text-green-800",
                      record.isDisconnected ? (
                        <LogOut className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )
                    )}
                  </TableCell>
                  {/* <TableCell>
                    {getStatusBadge(
                      record.earlyDepartureRequested,
                      record.earlyDepartureApproved ? "Approved" : "Requested",
                      "None",
                      record.earlyDepartureApproved
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800",
                      "bg-gray-100 text-gray-800",
                      record.earlyDepartureRequested ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )
                    )}
                  </TableCell> */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {record.isClockedIn ||
                      record.isOnBreak ||
                      record.isDisconnected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleManualClockOut}
                        >
                          Clock Out
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleManualClockIn}
                        >
                          Manual Entry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center py-6 text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
