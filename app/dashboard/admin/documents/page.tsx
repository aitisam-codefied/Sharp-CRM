// pages/DocumentsPage.tsx
"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FileText, Download, Unlock, Lock, Folder, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatsCard from "@/components/SOP-Documents/StatsCard";
import DocumentFilters from "@/components/SOP-Documents/DocumentFilters";
import DocumentTable from "@/components/SOP-Documents/DocumentTable";
import MandatoryDocuments from "@/components/SOP-Documents/MandatoryDocuments";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSOPDocuments } from "@/hooks/useGetSOPDocuments";
import { useBranches } from "@/hooks/useGetBranches";
import { Document } from "@/lib/types";
import NewDocumentDialog from "@/components/SOP-Documents/NewDocumentDialog";
import { API_HOST } from "@/lib/axios";
import { useCompanies } from "@/hooks/useCompnay";

interface Stats {
  totalDocuments: number;
  activeDocuments: number;
  mandatoryDocuments: number;
  draftDocuments: number;
}

interface Branch {
  id: string;
  name: string;
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const { data, isLoading, error } = useSOPDocuments();
  const { data: branchData } = useBranches();
  const { data: companyData } = useCompanies();

  const companyBranches =
    selectedCompany !== "all"
      ? companyData?.find((c: any) => c._id === selectedCompany)?.branches || []
      : [];

  useEffect(() => {
    setSelectedBranch("all");
  }, [selectedCompany]);

  // branch list
  const branches = companyBranches.map((b: any) => ({
    id: b._id,
    name: b.name,
  }));

  const allBranches =
    branchData?.map((branch: any) => ({
      id: branch._id,
      name: branch.name,
      company: branch.companyId.name,
    })) || [];

  const documents = data?.data || [];

  // useEffect(() => {
  //   console.log("documents", documents);
  // });

  const categories: string[] = [
    "emergency",
    "safeguarding",
    "policy",
    "procedure",
    "manual",
    "form",
    "template",
    "other",
  ];

  // const branches = allBranches.map((b) => b.name);
  // const branches = Array.from(new Set(allBranches.map((b) => b.name)));

  const statusOptions: string[] = [
    "active",
    "draft",
    "archived",
    "under_review",
  ];

  const accessLevels: string[] = [
    "all_staff",
    "managers_only",
    "admin_only",
    "branch_specific",
  ];

  const filteredDocuments: Document[] = documents.filter((doc: any) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag: any) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;

    const matchesBranch =
      selectedBranch === "all" || doc.branchId === selectedBranch;

    const matchesStatus =
      selectedStatus === "all" || doc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesBranch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "safeguarding":
        return "bg-purple-100 text-purple-800";
      case "policy":
        return "bg-blue-100 text-blue-800";
      case "form":
        return "bg-green-100 text-green-800";
      case "procedure":
        return "bg-orange-100 text-orange-800";
      case "manual":
        return "bg-yellow-100 text-yellow-800";
      case "template":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessLevelIcon = (accessLevel: string): React.ReactNode => {
    return accessLevel === "all_staff" ? (
      <Unlock className="h-4 w-4" />
    ) : (
      <Lock className="h-4 w-4" />
    );
  };

  const handleNewDocument = (): void => {
    toast({
      title: "Document Uploaded",
      description:
        "New document has been successfully uploaded and categorized.",
    });
    setIsNewDocumentOpen(false);
  };

  const handleDownloadDocument = (docId: string): void => {
    const doc = documents.find((d: any) => d.id === docId); // use id, not _id

    if (doc?.documentFile) {
      const link = document.createElement("a");
      link.href = `${API_HOST}${doc.documentFile}`; // use API_HOST + saved string
      link.download = doc.title || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `Downloading ${doc.title}`,
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Document not found or missing file URL",
        variant: "destructive",
      });
    }
  };

  const getStats = (): Stats => {
    const totalDocuments = documents.length;
    const activeDocuments = filteredDocuments.filter(
      (d) => d.status === "active"
    ).length;
    const mandatoryDocuments = filteredDocuments.filter(
      (d) => d.mandatory
    ).length;
    const draftDocuments = filteredDocuments.filter(
      (d) => d.status === "draft"
    ).length;

    return {
      totalDocuments,
      activeDocuments,
      mandatoryDocuments,
      draftDocuments,
    };
  };

  const stats: Stats = getStats();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBranch, selectedStatus]);

  return (
    <DashboardLayout
      title="Standard Operating Procedures"
      description="Manage organizational documents, policies, and procedures"
      actions={
        <div className="flex gap-2">
          <NewDocumentDialog
            isNewDocumentOpen={isNewDocumentOpen}
            setIsNewDocumentOpen={setIsNewDocumentOpen}
            handleNewDocument={handleNewDocument}
            categories={categories}
            branches={allBranches}
            accessLevels={accessLevels}
          />
        </div>
      }
    >
      <div className="space-y-6">
        {error ? (
          <div className="text-center py-8 text-red-600">
            Error loading documents: {(error as Error).message}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <StatsCard
                title="Total Documents"
                value={stats.totalDocuments}
                icon={<FileText className="h-8 w-8 text-blue-600" />}
              />
              <StatsCard
                title="Active Documents"
                value={stats.activeDocuments}
                icon={<Folder className="h-8 w-8 text-green-600" />}
                color="text-green-600"
              />
              <StatsCard
                title="Mandatory Reading"
                value={stats.mandatoryDocuments}
                icon={<Lock className="h-8 w-8 text-orange-600" />}
                color="text-orange-600"
              />
              <StatsCard
                title="Draft Documents"
                value={stats.draftDocuments}
                icon={<Edit className="h-8 w-8 text-yellow-600" />}
                color="text-yellow-600"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="h-5 w-5" />
                  Document Library
                </CardTitle>
                <CardDescription className="text-sm">
                  Centralized repository of all organizational documents and
                  procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedCompany={selectedCompany} // ✅ new
                  setSelectedCompany={setSelectedCompany}
                  selectedBranch={selectedBranch}
                  setSelectedBranch={setSelectedBranch}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  categories={categories}
                  companies={companyData || []}
                  branches={branches}
                  statusOptions={statusOptions}
                />

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
                    <p className="mt-2"> Loading Document data...</p>
                  </div>
                ) : (
                  <>
                    <DocumentTable
                      filteredDocuments={paginatedDocuments}
                      getStatusColor={getStatusColor}
                      getCategoryColor={getCategoryColor}
                      getAccessLevelIcon={getAccessLevelIcon}
                      handleDownloadDocument={handleDownloadDocument}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                    {paginatedDocuments.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">
                          No documents found
                        </h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search criteria or upload a new
                          document.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <MandatoryDocuments
              filteredDocuments={paginatedDocuments}
              getStatusColor={getStatusColor}
              getCategoryColor={getCategoryColor}
              getAccessLevelIcon={getAccessLevelIcon}
              handleDownloadDocument={handleDownloadDocument}
              stats={stats}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
