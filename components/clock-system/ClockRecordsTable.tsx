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
import { Badge } from "@/components/ui/badge";
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
import { CustomPagination } from "@/components/CustomPagination";
import { useCompanies } from "@/hooks/useCompnay";

interface ClockRecordsTableProps {
  clockRecords: ClockRecord[];
  branches: any[];
}

export default function ClockRecordsTable({
  clockRecords,
  branches,
}: ClockRecordsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { data: comapnayData } = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  // Branches of selected company
  const companyBranches =
    selectedCompany === "all"
      ? []
      : comapnayData?.find((c: any) => c._id === selectedCompany)?.branches ||
        [];

  // Reset branch when company changes
  useEffect(() => {
    setSelectedBranch("all");
  }, [selectedCompany]);

  // useEffect(() => {
  //   console.log("comapnies list", comapnayData);
  // });

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const { toast } = useToast();

  useEffect(() => {
    console.log("clockRecords", clockRecords);
  }, [clockRecords]);

  // Reset pagination to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch, selectedDate]);

  // Filter logic update
  const filteredRecords = clockRecords.filter((record: ClockRecord) => {
    const matchesSearch =
      record.staff?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.staff?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    // ✅ company ka filter hata diya
    const matchesBranch =
      selectedBranch === "all" || record.branch._id === selectedBranch;

    const matchesDate = selectedDate === "" || record.date === selectedDate;

    return matchesSearch && matchesBranch && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + recordsPerPage
  );

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
        variant="outline"
        className={`${
          value ? trueColor : falseColor
        } flex items-center gap-1 w-fit`}
      >
        {icon}
        {value ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <div>
      {/* Filters */}
      <div
        className={`grid gap-4 mb-6 ${
          selectedCompany !== "all"
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Company Select */}
        <Select
          value={selectedCompany}
          onValueChange={(val) => setSelectedCompany(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {comapnayData?.map((company: any) => (
              <SelectItem key={company._id} value={company._id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Branch Select (only show if company selected) */}
        {selectedCompany !== "all" && (
          <Select
            value={selectedBranch}
            onValueChange={(val) => setSelectedBranch(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {companyBranches.map((branch: any) => (
                <SelectItem key={branch._id} value={branch._id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Branch & Location</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Arrived</TableHead>
              {/* <TableHead>Early</TableHead> */}
              {/* <TableHead>On Break</TableHead> */}
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record: ClockRecord) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="font-medium">{record?.staff?.fullName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {record?.branch?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {record?.location}
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
                        <Badge variant="outline" className="text-xs">
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
                  {/* <TableCell>
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
                  </TableCell> */}
                  {/* <TableCell>
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
                  </TableCell> */}
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

      {/* Pagination */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
