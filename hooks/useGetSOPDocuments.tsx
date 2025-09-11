// hooks/useSOPDocuments.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Document } from "@/lib/types";

interface SOPDocumentsResponse {
  data: any[]; // Raw API response for documents
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

interface SOPDocumentsResult {
  data: Document[];
  total: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  // ordinal suffix logic
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month} ${year}`;
}

export const useSOPDocuments = (page: number, limit: number = 5) => {
  return useQuery<SOPDocumentsResult>({
    queryKey: ["sopDocuments", page, limit],
    queryFn: async () => {
      const response = await api.get("/sop/list", {
        params: { page, limit }, // Only send page and limit
      });

      const apiDocs = response.data.data;
      const total = response.data.pagination.totalDocuments;

      const documents: Document[] = apiDocs.map((apiDoc: any) => ({
        id: apiDoc._id,
        title: apiDoc.title,
        description: apiDoc.description,
        version: apiDoc.version,
        category: apiDoc.category.toLowerCase(),
        tags: apiDoc.tags,
        accessLevel: apiDoc.accessLevel.toLowerCase().replace(" ", "_"),
        isMandatoryReading: apiDoc.isMandatoryReading,
        mandatory: apiDoc.isMandatoryReading,
        branch: apiDoc.branchId ? apiDoc.branchId.name : "All Branches",
        status: apiDoc.status.toLowerCase(),
        downloadCount: apiDoc.downloadCount,
        viewCount: apiDoc.viewCount,
        createdBy: apiDoc.createdBy.fullName,
        effectiveDate: formatDate(apiDoc.effectiveDate),
        priority: apiDoc.priority,
        department: apiDoc.department,
        notes: apiDoc.notes,
        createdAt: formatDate(apiDoc.createdAt),
        updatedAt: formatDate(apiDoc.updatedAt),
        fileSize: apiDoc.documentFile.sizeFormatted,
        fileType: apiDoc.documentFile.extension?.slice(1).toUpperCase(),
        fileUrl: `${apiDoc.documentFile.fileAccess?.basePath}${apiDoc.documentFile.publicUrl}`,
        documentFile: apiDoc.documentFile.downloadUrl,
      }));

      return { data: documents, total };
    },
  });
};
