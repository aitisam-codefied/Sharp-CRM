"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useGetQRCodes } from "@/hooks/useGetQRCodes";
import { QRCodeTable } from "@/components/qr-scanner/QRCodeTable";
import { useBranches } from "@/hooks/useGetBranches";
import { Badge } from "@/components/ui/badge";
import { useCompanies } from "@/hooks/useCompnay";

interface QRCode {
  _id: string;
  type: string;
  branchId: { _id: string; name: string; address: string };
  code: string;
  createdAt: string;
}

export default function QRScannerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  // const [selectedBranch, setSelectedBranch] = useState("all");
  const { data: qrcodes = [], isPending: isQRCodesPending } = useGetQRCodes();

  const { data: branchData } = useBranches();
  const { data: companyData } = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  // Branches of selected company
  const companyBranches =
    selectedCompany === "all"
      ? []
      : companyData?.find((c: any) => c._id === selectedCompany)?.branches ||
        [];

  // Reset branch when company changes
  useEffect(() => {
    setSelectedBranch("all");
  }, [selectedCompany]);

  //  useEffect(() => {
  //    console.log("branch data", branchData);
  //  });

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

  // Filter QR codes based on search term, type, and branch
  const filteredQRCodes = qrcodes.filter((qr: QRCode) => {
    const matchesSearch = qr.type
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || qr.type === selectedType;

    const matchesBranch =
      selectedBranch === "all" || qr.branchId?._id === selectedBranch;

    return matchesSearch && matchesType && matchesBranch;
  });

  return (
    <DashboardLayout
      title="Multi-Purpose QR Scanner"
      description="Scan QR codes for various system operations"
      actions={<div className="flex gap-2"></div>}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>QR Codes List</CardTitle>
            <CardDescription>
              {selectedBranch === "all"
                ? "All available QR codes from the system"
                : `QR codes for selected branch`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isQRCodesPending ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
                <p className="mt-2"> Loading qr codes...</p>
              </div>
            ) : (
              <>
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
                      {companyData?.map((company: any) => (
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

                <QRCodeTable
                  qrcodes={filteredQRCodes}
                  isLoading={isQRCodesPending}
                />

                {filteredQRCodes.length === 0 && (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">
                      No QR codes found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
