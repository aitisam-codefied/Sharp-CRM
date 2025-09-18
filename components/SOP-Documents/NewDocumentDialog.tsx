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
import { useCompanies } from "@/hooks/useCompnay";

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
  const [titleError, setTitleError] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [category, setCategory] = useState("");
  const [branchId, setBranchId] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [tags, setTags] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useCreateSOPDocument();
  const { toast } = useToast();
  const { data: companyData } = useCompanies();

  // New states
  const [selectedCompany, setSelectedCompany] = useState("");

  // Filtered branches
  const filteredBranches = selectedCompany
    ? branches.filter((b) => b.company === selectedCompany)
    : [];

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
    setTitleError("");
    setDescriptionError("");
    setTagsError("");
    setDepartmentError("");
    setNotesError("");
  };

  const handleUpload = () => {
    if (!file || !title || !category || !accessLevel) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const normalizedVersion = version.replace(/^V/, "v");

    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("version", normalizedVersion);
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
            error?.response?.data?.details || "Failed to upload document.",
          variant: "destructive",
        });
      },
    });
  };

  const hasErrors =
    !!titleError ||
    !!descriptionError ||
    !!departmentError ||
    !!tagsError ||
    !!notesError;

  return (
    <Dialog open={isNewDocumentOpen} onOpenChange={setIsNewDocumentOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs sm:text-sm" size="sm">
          <Plus className="h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
            </label>

            {/* Hidden file input */}
            <Input
              id="file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            {file && (
              <div className="mt-3">
                {file.type.startsWith("image/") ? (
                  <div className="border rounded-lg p-2 bg-gray-50 flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="max-h-40 object-contain rounded-md shadow-md"
                    />
                    <p className="text-xs text-gray-500 mt-2">{file.name}</p>
                  </div>
                ) : (
                  <p className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md font-medium inline-block">
                    {file.name}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                  if (value.length > 50) {
                    setTitleError("Title cannot exceed 50 characters."); // ✅ set error
                  } else {
                    setTitleError(""); // ✅ clear error
                  }
                }}
              />
              {titleError && (
                <p className="text-sm text-red-500">{titleError}</p> // ✅ error message
              )}
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

          {/* description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document..."
              value={description}
              onChange={(e) => {
                const value = e.target.value;
                setDescription(value);
                setDescriptionError(
                  value.length > 500
                    ? "Description cannot exceed 500 characters."
                    : ""
                );
              }}
            />
            {descriptionError && (
              <p className="text-sm text-red-500">{descriptionError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                onValueChange={(val) => {
                  setSelectedCompany(val);
                  setBranchId(""); // reset branch jab company change ho
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {/* companyData se companies show karo */}
                  {companyData?.map((company: any) => (
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={branchId}
                onValueChange={setBranchId}
                disabled={!selectedCompany} // disable jab tak company select na ho
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      <div className="flex items-center gap-2">
                        <span>{branch.name}</span>
                      </div>
                    </SelectItem>
                  ))}
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

          {/* department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              placeholder="Enter department"
              value={department}
              onChange={(e) => {
                const value = e.target.value;
                setDepartment(value);
                setDepartmentError(
                  value.length > 200
                    ? "Department cannot exceed 200 characters."
                    : ""
                );
              }}
            />
            {departmentError && (
              <p className="text-sm text-red-500">{departmentError}</p>
            )}
          </div>

          {/* tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => {
                const value = e.target.value;
                setTags(value);
                setTagsError(
                  value.length > 300 ? "Tags cannot exceed 300 characters." : ""
                );
              }}
            />
            {tagsError && <p className="text-sm text-red-500">{tagsError}</p>}
          </div>

          {/* notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => {
                const value = e.target.value;
                setNotes(value);
                setNotesError(
                  value.length > 500
                    ? "Notes cannot exceed 500 characters."
                    : ""
                );
              }}
            />
            {notesError && <p className="text-sm text-red-500">{notesError}</p>}
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
          <Button
            onClick={handleUpload}
            disabled={isPending || hasErrors} // ✅ disable if error
          >
            {isPending ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
