"use client";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanyBranchFilterProps {
  companies: any[];
  onChange: (companyId: string | null, branchId: string | null) => void;
}

export default function CompanyBranchFilter({
  companies,
  onChange,
}: CompanyBranchFilterProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const branches = useMemo(() => {
    if (!selectedCompany) return [];
    const company = companies.find((c) => c._id === selectedCompany);
    return company?.branches || [];
  }, [selectedCompany, companies]);

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value === "all" ? null : value);
    setSelectedBranch(null); // reset branch when company changes
    onChange(value === "all" ? null : value, null);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value === "all" ? null : value);
    onChange(selectedCompany, value === "all" ? null : value);
  };

  return (
    <div className="flex gap-4">
      {/* Company Dropdown */}
      <Select
        value={selectedCompany || "all"}
        onValueChange={handleCompanyChange}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select Company" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>
          {companies.map((company) => (
            <SelectItem key={company._id} value={company._id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Branch Dropdown */}
      {selectedCompany && (
        <Select
          value={selectedBranch || "all"}
          onValueChange={handleBranchChange}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch: any) => (
              <SelectItem key={branch._id} value={branch._id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
