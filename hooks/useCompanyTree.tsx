import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TreeDataNode } from "antd"; // For tree structure compatibility
import api from "@/lib/axios";

interface LocationNode extends TreeDataNode {
  title: string;
  key: string;
}

interface LocationsNode extends TreeDataNode {
  title: "Locations";
  key: string;
  children: LocationNode[];
}

interface StaffNode extends TreeDataNode {
  title: string; // e.g., "Staff Members: 2"
  key: string;
}

interface BranchNode extends TreeDataNode {
  title: string;
  key: string;
  children: [LocationsNode, StaffNode];
}

export interface CompanyNode extends TreeDataNode {
  title: string;
  key: string;
  children: BranchNode[];
  status: string;
  residents: number;
  health: string;
}

interface Metadata {
  totalCompanies: number;
  totalBranches: number;
  generatedAt: string;
}

interface CompanyTreeResponse {
  success: boolean;
  data: CompanyNode[];
  metadata: Metadata;
}

export const useCompanyTree = (tenantId: string) => {
  return useQuery<CompanyTreeResponse>({
    queryKey: ["companyTree", tenantId],
    queryFn: async () => {
      const response = await api.get<CompanyTreeResponse>(
        `/analytics/company-tree?tenantId=${tenantId}`
      );
      return response.data;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    enabled: !!tenantId,
  });
};
