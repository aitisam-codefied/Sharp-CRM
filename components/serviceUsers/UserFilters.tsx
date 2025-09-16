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

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedNationality: string;
  setSelectedNationality: (value: string) => void;
  companies: { _id: string; name: string }[];
  branches: { _id: string; name: string; companyId: string }[];
  statusOptions: string[];
  nationalities: string[];
}

export function UserFilters({
  searchTerm,
  setSearchTerm,
  selectedBranch,
  selectedCompany,
  setSelectedCompany,
  setSelectedBranch,
  selectedStatus,
  setSelectedStatus,
  selectedNationality,
  setSelectedNationality,
  companies,
  branches,
  statusOptions,
  nationalities,
}: UserFiltersProps) {
  // console.log("companies", companies);
  // console.log("branchesssssssssss", branches);

  return (
    <div
      className={`grid gap-4 mb-6 ${
        selectedCompany !== "all"
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
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

      {/* Company Dropdown */}
      <Select
        value={selectedCompany}
        onValueChange={(val) => {
          setSelectedCompany(val);
          setSelectedBranch("all"); // reset branch on company change
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Companies" />
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

      {/* Branch Dropdown (dependent on company) */}
      {/* <Select
        value={selectedBranch}
        onValueChange={setSelectedBranch}
        disabled={selectedCompany === "all"}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Branches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Branches</SelectItem>
          {branches.map((branch) => (
            <SelectItem key={branch._id} value={branch.name}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

      {/* Branch (only if company selected) */}
      {selectedCompany !== "all" && (
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger>
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch._id} value={branch.name}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Nationality */}
      <Select
        value={selectedNationality}
        onValueChange={setSelectedNationality}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Nationalities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Nationalities</SelectItem>
          {nationalities.map((nationality) => (
            <SelectItem key={nationality} value={nationality}>
              {nationality}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
