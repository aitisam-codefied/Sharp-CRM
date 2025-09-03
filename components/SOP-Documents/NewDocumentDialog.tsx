"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Upload } from "lucide-react";
import { useCreateSOPDocument } from "@/hooks/useCreateSOPDocument";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

interface Branch {
  id: string;
  name: string;
  company: string;
}

interface NewDocumentDialogProps {
  isNewDocumentOpen: boolean;
  setIsNewDocumentOpen: (open: boolean) => void;
  handleNewDocument: () => void;
  categories: string[];
  branches: Branch[];
  accessLevels: string[];
}

export default function NewDocumentDialog({
  isNewDocumentOpen,
  setIsNewDocumentOpen,
  handleNewDocument,
  categories,
  branches,
  accessLevels,
}: NewDocumentDialogProps) {
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [branchId, setBranchId] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [tags, setTags] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useCreateSOPDocument();
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setVersion("");
    setDescription("");
    setCategory("");
    setBranchId("");
    setAccessLevel("");
    setTags("");
    setIsMandatory(false);
    setEffectiveDate("");
    setPriority("");
    setDepartment("");
    setNotes("");
    setFile(null);
  };

  const handleUpload = () => {
    if (!file || !title || !category || !accessLevel) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("version", version);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("accessLevel", accessLevel);
    formData.append("isMandatoryReading", isMandatory ? "true" : "false");
    if (branchId) formData.append("branchId", branchId);
    if (effectiveDate)
      formData.append("effectiveDate", `${effectiveDate}T00:00:00.000Z`);
    if (priority) formData.append("priority", priority);
    if (department) formData.append("department", department);
    if (notes) formData.append("notes", notes);

    mutate(formData, {
      onSuccess: () => {
        resetForm();
        handleNewDocument();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to upload document.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={isNewDocumentOpen} onOpenChange={setIsNewDocumentOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogDescription>
            Add a new SOP document to the system
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Document File</Label>
            <label
              htmlFor="file"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer block"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Click to upload</p>
              <p className="text-xs text-gray-400">
                PDF, DOC, DOCX, PNG up to 10MB
              </p>
            </label>

            {/* Hidden file input */}
            <Input
              id="file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            {file && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Selected:</span> {file.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                placeholder="e.g., v1.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const display = cat.charAt(0).toUpperCase() + cat.slice(1);
                    return (
                      <SelectItem key={cat} value={display}>
                        {display}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select onValueChange={setBranchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      <div className="flex items-center gap-2">
                        <span>{branch.name}</span>-
                        <Badge className="bg-[#F87D7D] text-white">
                          {branch.company}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select onValueChange={setAccessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  {accessLevels.map((level) => {
                    const display = level
                      .replace(/_/g, " ")
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ");
                    return (
                      <SelectItem key={level} value={display}>
                        {display}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mandatory"
              checked={isMandatory}
              onCheckedChange={(checked) => setIsMandatory(!!checked)}
            />
            <Label htmlFor="mandatory">Mark as mandatory reading</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsNewDocumentOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isPending}>
            {isPending ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
