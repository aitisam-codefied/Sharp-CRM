import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document } from "@/lib/types";
import { Calendar, User, FileText, Download, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentDetailsModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  getStatusColor: (status: string) => string;
  getCategoryColor: (category: string) => string;
  getAccessLevelIcon: (accessLevel: string) => React.ReactNode;
  handleDownloadDocument: (docId: string) => void;
}

export default function DocumentDetailsModal({
  document,
  isOpen,
  onClose,
  getStatusColor,
  getCategoryColor,
  getAccessLevelIcon,
  handleDownloadDocument,
}: DocumentDetailsModalProps) {
  const { toast } = useToast();

  if (!document) return null;

  const handlePreview = () => {
    window.open(document.fileUrl, "_blank");
    toast({
      title: "Opening Preview",
      description: `Previewing document: ${document.title}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[500px] overflow-y-auto bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            {document.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detailed information about the selected document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-gray-800">{document.description}</p>
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <Badge
                variant="outline"
                className={`mt-1 ${getCategoryColor(document.category)}`}
              >
                {document.category.charAt(0).toUpperCase() +
                  document.category.slice(1)}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge
                variant="outline"
                className={`mt-1 ${getStatusColor(document.status)}`}
              >
                {document.status
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            </div>
          </div>

          {/* Branch and Access Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Branch</h3>
              <p className="mt-1 text-gray-800">{document.branch}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Access Level
              </h3>
              <div className="flex items-center mt-1 text-gray-800">
                {getAccessLevelIcon(document.accessLevel)}
                <span className="ml-2">
                  {document.accessLevel
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>
            </div>
          </div>

          {/* Version and Updates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Version</h3>
              <p className="mt-1 text-gray-800">{document.version}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Last Updated
              </h3>
              <div className="flex items-center mt-1 text-gray-800">
                <Calendar className="h-4 w-4 mr-2" />
                {document.updatedAt}
              </div>
            </div>
          </div>

          {/* Created By and File Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <div className="flex items-center mt-1 text-gray-800">
                <User className="h-4 w-4 mr-2" />
                {document.createdBy}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">File Info</h3>
              <p className="mt-1 text-gray-800">
                {document.fileSize} • {document.fileType}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tags</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {document.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Mandatory Status */}
          {document.mandatory && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Requirement</h3>
              <Badge variant="destructive" className="mt-1">
                Mandatory Reading
              </Badge>
            </div>
          )}

          {/* Download Count */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Usage</h3>
            <p className="mt-1 text-gray-800">
              {document.downloadCount} downloads
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
