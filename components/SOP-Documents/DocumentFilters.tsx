import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface DocumentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedCompany: string; // ✅ add
  setSelectedCompany: (value: string) => void; // ✅ add
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  categories: string[];
  companies: any[]; // ✅ add
  branches: { id: string; name: string }[];
  statusOptions: string[];
}

export default function DocumentFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  selectedCompany,
  setSelectedCompany,
  setSelectedCategory,
  selectedBranch,
  setSelectedBranch,
  selectedStatus,
  setSelectedStatus,
  categories,
  companies,
  branches,
  statusOptions,
}: DocumentFiltersProps) {
  return (
    <div
      className={`grid gap-4 mb-6 ${
        selectedCompany !== "all"
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
      }`}
    >
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category */}
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Company */}
      <Select value={selectedCompany} onValueChange={setSelectedCompany}>
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
      </Select>

      {/* Branch (only if company selected) */}
      {selectedCompany !== "all" && (
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
      )}

      {/* Status */}
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger>
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
