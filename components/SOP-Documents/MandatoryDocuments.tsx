"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Eye } from "lucide-react";
import { Document } from "@/lib/types";
import { useState } from "react";
import DocumentDetailsModal from "./DocumentDetailsModal";

interface Stats {
  mandatoryDocuments: number;
}

interface MandatoryDocumentsProps {
  filteredDocuments: Document[];
  getStatusColor: (status: string) => string;
  getCategoryColor: (category: string) => string;
  getAccessLevelIcon: (accessLevel: string) => React.ReactNode;
  handleDownloadDocument: (docId: string) => void;
  stats: Stats;
}

export default function MandatoryDocuments({
  filteredDocuments,
  getStatusColor,
  getCategoryColor,
  getAccessLevelIcon,
  handleDownloadDocument,
  stats,
}: MandatoryDocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(3); // 👈 initially show 3

  const handleOpenModal = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  // Filter only mandatory documents
  const mandatoryDocs = filteredDocuments.filter((doc) => doc.mandatory);

  // Docs currently visible
  const visibleDocs = mandatoryDocs?.slice(0, visibleCount);

  return (
    <>
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Mandatory Reading Documents
          </CardTitle>
          <CardDescription className="text-orange-600">
            {stats.mandatoryDocuments} documents require mandatory reading by
            all staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {visibleDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg"
              >
                <div>
                  <p className="font-medium text-orange-900">{doc.title}</p>
                  <p className="text-sm text-orange-600">{doc.description}</p>
                  <p className="text-xs text-orange-500">
                    {doc.category.charAt(0).toUpperCase() +
                      doc.category?.slice(1)}{" "}
                    • {doc.version} • Updated {doc.updatedAt}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenModal(doc)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Read Now
                </Button>
              </div>
            ))}
          </div>

          {visibleCount < mandatoryDocs.length && (
            <div className="flex justify-center mt-4">
              <Button
                className="text-[#F87D7D] hover:text-white hover:bg-[#F87D7D] border border-[#F87D7D]"
                variant="ghost"
                onClick={() => setVisibleCount((prev) => prev + 3)}
              >
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentDetailsModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getStatusColor={getStatusColor}
        getCategoryColor={getCategoryColor}
        getAccessLevelIcon={getAccessLevelIcon}
        handleDownloadDocument={handleDownloadDocument}
      />
    </>
  );
}
