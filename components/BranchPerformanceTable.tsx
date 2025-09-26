"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";

import { useCompanyTree, type CompanyNode } from "@/hooks/useCompanyTree";
import TreeDemo from "./Tree";
import { useAuth } from "./providers/auth-provider";

export default function CompanyPerformanceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all-status");

  const { user } = useAuth();
  const tenantId = user?.tenantId || "";
  const { data, isLoading, error } = useCompanyTree(tenantId);

  const companyData: CompanyNode[] = data?.data || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const itemsPerPage = 5;

  const filteredData = companyData?.filter((company) => {
    const matchesSearch =
      searchTerm === "" ||
      company?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase());

    const matchesStatus =
      selectedStatus === "all-status" ||
      company?.status?.toLowerCase() === selectedStatus?.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Building2 className="h-5 w-5" />
          Company Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Company</TableHead>
                <TableHead>Information</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Residents</TableHead>
                <TableHead>Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : currentData?.map((company) => (
                    <TableRow key={company?.key}>
                      <TableCell>
                        <div className="font-medium capitalize">
                          {company?.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <TreeDemo
                          treeData={[
                            {
                              title: "Branches",
                              key: `${company?.key}-branches`,
                              children: company?.children,
                            },
                          ]}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            company?.status?.toLowerCase() === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {company?.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{company?.residents}</TableCell>
                      <TableCell>
                        <div
                          className={
                            company?.health === "OK"
                              ? "bg-green-100 text-green-700 border-green-300 w-full sm:w-fit px-2 py-1 rounded-none lg:rounded-full text-xs sm:text-sm"
                              : "bg-orange-100 text-orange-700 border-orange-300 w-full sm:w-fit px-2 py-1 rounded-none lg:rounded-full text-xs sm:text-sm"
                          }
                        >
                          {company?.health}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
