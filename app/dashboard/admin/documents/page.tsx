"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FileText, Download, Unlock, Lock, Folder, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatsCard from "@/components/SOP-Documents/StatsCard";
import DocumentFilters from "@/components/SOP-Documents/DocumentFilters";
import DocumentTable from "@/components/SOP-Documents/DocumentTable";
import MandatoryDocuments from "@/components/SOP-Documents/MandatoryDocuments";
import NewDocumentDialog from "@/components/SOP-Documents/NewDocumentDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  version: string;
  lastUpdated: string;
  updatedBy: string;
  branch: string;
  status: string;
  accessLevel: string;
  fileSize: string;
  fileType: string;
  downloadCount: number;
  tags: string[];
  mandatory: boolean;
}

interface Stats {
  totalDocuments: number;
  activeDocuments: number;
  mandatoryDocuments: number;
  draftDocuments: number;
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const documents: Document[] = [
    {
      id: "DOC001",
      title: "Emergency Evacuation Procedures",
      category: "emergency",
      description:
        "Step-by-step emergency evacuation procedures for all branches",
      version: "v2.1",
      lastUpdated: "2024-01-10",
      updatedBy: "Sarah Johnson",
      branch: "All Branches",
      status: "active",
      accessLevel: "all_staff",
      fileSize: "2.4 MB",
      fileType: "PDF",
      downloadCount: 45,
      tags: ["emergency", "safety", "evacuation"],
      mandatory: true,
    },
    {
      id: "DOC002",
      title: "Safeguarding Policy and Procedures",
      category: "safeguarding",
      description:
        "Comprehensive safeguarding policy including reporting procedures",
      version: "v3.0",
      lastUpdated: "2024-01-08",
      updatedBy: "Emma Wilson",
      branch: "All Branches",
      status: "active",
      accessLevel: "managers_only",
      fileSize: "5.2 MB",
      fileType: "PDF",
      downloadCount: 28,
      tags: ["safeguarding", "policy", "protection"],
      mandatory: true,
    },
    {
      id: "DOC003",
      title: "Meal Service Guidelines",
      category: "operations",
      description:
        "Guidelines for meal preparation, service, and dietary requirements",
      version: "v1.5",
      lastUpdated: "2024-01-05",
      updatedBy: "David Brown",
      branch: "Manchester",
      status: "active",
      accessLevel: "all_staff",
      fileSize: "1.8 MB",
      fileType: "PDF",
      downloadCount: 67,
      tags: ["meals", "dietary", "service"],
      mandatory: false,
    },
    {
      id: "DOC004",
      title: "Incident Reporting Form Template",
      category: "forms",
      description:
        "Standard template for incident reporting across all branches",
      version: "v2.0",
      lastUpdated: "2024-01-12",
      updatedBy: "Lisa Chen",
      branch: "All Branches",
      status: "active",
      accessLevel: "all_staff",
      fileSize: "0.5 MB",
      fileType: "DOCX",
      downloadCount: 89,
      tags: ["incident", "reporting", "template"],
      mandatory: true,
    },
    {
      id: "DOC005",
      title: "Staff Training Manual - Welfare Checks",
      category: "training",
      description:
        "Comprehensive training manual for conducting welfare checks",
      version: "v1.2",
      lastUpdated: "2023-12-20",
      updatedBy: "Ahmed Hassan",
      branch: "All Branches",
      status: "draft",
      accessLevel: "trainers_only",
      fileSize: "8.7 MB",
      fileType: "PDF",
      downloadCount: 12,
      tags: ["training", "welfare", "manual"],
      mandatory: false,
    },
    {
      id: "DOC006",
      title: "Room Inspection Checklist",
      category: "maintenance",
      description:
        "Monthly room inspection checklist and maintenance procedures",
      version: "v1.0",
      lastUpdated: "2024-01-15",
      updatedBy: "Maria Garcia",
      branch: "Birmingham",
      status: "active",
      accessLevel: "maintenance_staff",
      fileSize: "0.8 MB",
      fileType: "PDF",
      downloadCount: 23,
      tags: ["maintenance", "inspection", "rooms"],
      mandatory: true,
    },
  ];

  const categories: string[] = [
    "emergency",
    "safeguarding",
    "operations",
    "forms",
    "training",
    "maintenance",
    "policies",
  ];
  const branches: string[] = [
    "All Branches",
    "Manchester",
    "Birmingham",
    "London Central",
    "Liverpool",
    "Leeds",
  ];
  const statusOptions: string[] = [
    "active",
    "draft",
    "archived",
    "under_review",
  ];
  const accessLevels: string[] = [
    "all_staff",
    "managers_only",
    "trainers_only",
    "maintenance_staff",
    "admin_only",
  ];

  const filteredDocuments: Document[] = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    const matchesBranch =
      selectedBranch === "all" || doc.branch === selectedBranch;
    const matchesStatus =
      selectedStatus === "all" || doc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesBranch && matchesStatus;
  });

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
      case "operations":
        return "bg-blue-100 text-blue-800";
      case "forms":
        return "bg-green-100 text-green-800";
      case "training":
        return "bg-orange-100 text-orange-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "policies":
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

  const handleViewDocument = (docId: string): void => {
    toast({
      title: "View Document",
      description: `Opening document ${docId}`,
    });
  };

  const handleDownloadDocument = (docId: string): void => {
    toast({
      title: "Download Started",
      description: `Downloading document ${docId}`,
    });
  };

  const getStats = (): Stats => {
    const totalDocuments = filteredDocuments.length;
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

  return (
    <DashboardLayout
      title="Standard Operating Procedures"
      description="Manage organizational documents, policies, and procedures"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
          <NewDocumentDialog
            isNewDocumentOpen={isNewDocumentOpen}
            setIsNewDocumentOpen={setIsNewDocumentOpen}
            handleNewDocument={handleNewDocument}
            categories={categories}
            branches={branches}
            accessLevels={accessLevels}
          />
        </div>
      }
    >
      <div className="space-y-6">
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
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Library
            </CardTitle>
            <CardDescription>
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
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              categories={categories}
              branches={branches}
              statusOptions={statusOptions}
            />

            <DocumentTable
              filteredDocuments={filteredDocuments}
              getStatusColor={getStatusColor}
              getCategoryColor={getCategoryColor}
              getAccessLevelIcon={getAccessLevelIcon}
              handleViewDocument={handleViewDocument}
              handleDownloadDocument={handleDownloadDocument}
            />

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or upload a new document.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <MandatoryDocuments
          filteredDocuments={filteredDocuments}
          handleViewDocument={handleViewDocument}
          stats={stats}
        />
      </div>
    </DashboardLayout>
  );
}
