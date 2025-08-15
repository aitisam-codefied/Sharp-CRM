// src/components/BranchList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useBranches } from "@/hooks/useGetBranches";
import { useState } from "react";

interface Branch {
  _id: string;
  name: string;
  companyId: { name: string };
}

interface BranchListProps {
  onBranchSelect: (branchId: string | null) => void; // Callback to pass selected branch ID
}

export function BranchList({ onBranchSelect }: BranchListProps) {
  const { data: branches = [] } = useBranches();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null); // Track selected branch, null for "ALL"

  const handleBranchClick = (branchId: string | null) => {
    setSelectedBranch(branchId);
    onBranchSelect(branchId); // Notify parent of selection
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* ALL Button */}
      <Button
        variant={selectedBranch === null ? "default" : "outline"}
        className={`flex items-center justify-center gap-2 px-6 py-8 border rounded-lg shadow-sm transition-colors duration-200 ${
          selectedBranch === null
            ? "bg-[#F87D7D] text-white"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => handleBranchClick(null)}
      >
        <span
          className={`font-semibold ${
            selectedBranch === null ? "text-white" : "text-gray-900"
          }`}
        >
          ALL
        </span>
      </Button>

      {branches.map((branch: Branch) => (
        <Button
          key={branch._id}
          variant={selectedBranch === branch._id ? "default" : "outline"}
          className={`flex items-center justify-center gap-2 px-6 py-8 border rounded-lg shadow-sm transition-colors duration-200 ${
            selectedBranch === branch._id
              ? "bg-[#F87D7D] text-white"
              : "bg-white hover:bg-gray-50"
          }`}
          onClick={() => handleBranchClick(branch._id)}
        >
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              selectedBranch === branch._id
                ? "bg-white text-[#F87D7D]"
                : "text-white bg-[#F87D7D]"
            }`}
          >
            {branch.companyId.name}
          </span>
          <span className="text-gray-400">-</span>
          <span
            className={`font-semibold ${
              selectedBranch === branch._id ? "text-white" : "text-gray-900"
            }`}
          >
            {branch.name}
          </span>
        </Button>
      ))}
    </div>
  );
}
