// src/components/in-transit/Filters.tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedBranch: string;
  selectedCompany: string; // ✅ add
  setSelectedCompany: (value: string) => void; // ✅ add
  setSelectedBranch: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  companies: any[]; // ✅ add
  branches: { id: string; name: string }[];
  statusOptions: string[];
}

export default function Filters({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  selectedBranch,
  selectedCompany,
  setSelectedCompany,
  setSelectedBranch,
  selectedStatus,
  setSelectedStatus,
  companies,
  branches,
  statusOptions,
}: FiltersProps) {
  return (
    // <div
    //   className={`grid gap-4 mb-6 ${
    //     selectedCompany !== "all"
    //       ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
    //       : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    //   }`}
    // >
    <div className="grid gap-4 mb-6 grid-cols-1 sm:grid-cols-2">
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

      {/* Company */}
      {/* <Select value={selectedCompany} onValueChange={setSelectedCompany}>
        <SelectTrigger>
          <SelectValue placeholder="All Companies" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>
          {companies.map((company: any) => (
            <SelectItem key={company._id} value={company._id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

      {/* Branch (only if company selected) */}
      {/* {selectedCompany !== "all" && (
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger>
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )} */}

      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
