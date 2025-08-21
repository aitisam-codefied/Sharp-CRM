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
import React from "react";

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

interface DocumentTableProps {
  filteredDocuments: Document[];
  getStatusColor: (status: string) => string;
  getCategoryColor: (category: string) => string;
  getAccessLevelIcon: (accessLevel: string) => React.ReactNode;
  handleViewDocument: (docId: string) => void;
  handleDownloadDocument: (docId: string) => void;
}

export default function DocumentTable({
  filteredDocuments,
  getStatusColor,
  getCategoryColor,
  getAccessLevelIcon,
  handleViewDocument,
  handleDownloadDocument,
}: DocumentTableProps) {
  return (
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
                    {doc.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge className={getCategoryColor(doc.category)}>
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
                    <Calendar className=" b-3 w-3 mr-1" />
                    {doc.lastUpdated}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {doc.updatedBy}
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
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
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
                <Badge className={getStatusColor(doc.status)}>
                  {doc.status
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDocument(doc.id)}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDocument(doc.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
