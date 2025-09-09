// components/SOP-Documents/DocumentTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Eye, Download, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Document } from "@/lib/types";
import DocumentDetailsModal from "./DocumentDetailsModal";
import { CustomPagination } from "@/components/CustomPagination";

interface DocumentTableProps {
  filteredDocuments: Document[];
  getStatusColor: (status: string) => string;
  getCategoryColor: (category: string) => string;
  getAccessLevelIcon: (accessLevel: string) => React.ReactNode;
  handleDownloadDocument: (docId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DocumentTable({
  filteredDocuments,
  getStatusColor,
  getCategoryColor,
  getAccessLevelIcon,
  handleDownloadDocument,
  currentPage,
  totalPages,
  onPageChange,
}: DocumentTableProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("documents", filteredDocuments);
  }, [filteredDocuments]);

  const handleOpenModal = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Details</TableHead>
              <TableHead>Category & Branch</TableHead>
              <TableHead>Version & Updates</TableHead>
              <TableHead>Access & Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      {doc.title}
                      {doc.mandatory && (
                        <Badge variant="destructive" className="text-xs">
                          Mandatory
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {doc.description}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.map((tag: any) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge
                      variant="outline"
                      className={getCategoryColor(doc.category)}
                    >
                      {doc.category.charAt(0).toUpperCase() +
                        doc.category.slice(1)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {doc.branch}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{doc.version}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {doc.updatedAt}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {doc.createdBy}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      {getAccessLevelIcon(doc.accessLevel)}
                      <span className="ml-1">
                        {doc.accessLevel
                          .replace("_", " ")
                          .replace(/\b\w/g, (l: any) => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {doc.downloadCount} downloads
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {doc.fileSize} • {doc.fileType}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(doc.status)}
                  >
                    {doc.status
                      .replace("_", " ")
                      .replace(/\b\w/g, (l: any) => l.toUpperCase())}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadDocument(doc.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredDocuments.length >= 10 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

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
