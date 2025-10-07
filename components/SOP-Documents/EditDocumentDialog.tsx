"use client";

import { useState, useEffect } from "react";
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
import { Upload } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useCompanies } from "@/hooks/useCompnay";
import { Document } from "@/lib/types";
import { useUpdateSOPDocument } from "@/hooks/useUpdateSOPDocument";

interface Branch {
  id: string;
  name: string;
  company: string;
}

interface EditDocumentDialogProps {
  isEditDocumentOpen: boolean;
  setIsEditDocumentOpen: (open: boolean) => void;
  document: Document;
  categories: string[];
  branches: Branch[];
  accessLevels: string[];
}

function incrementVersion(version: string): string {
  if (!version.startsWith("v")) return "v1.1"; // Fallback if invalid
  const [major, minor] = version.slice(1).split(".").map(Number);
  return `v${major}.${minor + 1}`;
}

export default function EditDocumentDialog({
  isEditDocumentOpen,
  setIsEditDocumentOpen,
  document,
  categories,
  branches,
  accessLevels,
}: EditDocumentDialogProps) {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [category, setCategory] = useState("");
  const [branchId, setBranchId] = useState<string[]>([]);
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

  const [existingFile, setexistingFile] = useState("");

  const { mutate, isPending } = useUpdateSOPDocument();
  const { toast } = useToast();
  const { data: companyData } = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState("");

  const filteredBranches = selectedCompany
    ? branches.filter((b) => b.company === selectedCompany)
    : [];

  useEffect(() => {
    if (document) {
      setTitle(document.title || "");
      setexistingFile(document.originalFileName || "");
      setDescription(document.description || "");
      setCategory(
        document.category.charAt(0).toUpperCase() + document.category.slice(1)
      );
      setAccessLevel(
        document.accessLevel
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())
      );
      setTags(document.tags?.join(", ") || "");
      setIsMandatory(document.mandatory || false);
      if (document.effectiveDate) {
        const parsedDate = new Date(document.effectiveDate);
        if (!isNaN(parsedDate.getTime())) {
          const formatted = parsedDate.toISOString().split("T")[0];
          setEffectiveDate(formatted);
        } else {
          setEffectiveDate("");
        }
      } else {
        setEffectiveDate("");
      }
      setPriority(document.priority || "");
      setDepartment(document.department || "");
      setNotes(document.notes || "");
      setSelectedCompany(document.company || "");

      // Set branchIds if available, else all for company
      const allBranchIds = branches
        .filter((b) => b.company === document.company)
        .map((b) => b.id);
      setBranchId(document.branchIds || allBranchIds);
    }
  }, [document, branches]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
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
    setSelectedCompany("");
    setBranchId([]);
  };

  const handleUpdate = () => {
    if (!title || !category || !accessLevel) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let updateData: FormData | Record<string, any>;

    if (file) {
      // Use FormData if file changed
      updateData = new FormData();
      updateData.append("document", file);
    } else {
      // Use JSON if no file
      updateData = {};
    }

    // Common fields
    const commonFields = {
      title,
      description,
      category,
      accessLevel,
      isMandatoryReading: isMandatory,
      effectiveDate: effectiveDate
        ? `${effectiveDate}T00:00:00.000Z`
        : undefined,
      priority: priority || undefined,
      department: department || undefined,
      notes: notes || undefined,
    };

    if (updateData instanceof FormData) {
      Object.entries(commonFields).forEach(([key, value]) => {
        if (value !== undefined) updateData.append(key, value);
      });
      updateData.append("tags", tags); // String for FormData
      branchId.forEach((id) => updateData.append("branchId[]", id));
    } else {
      Object.assign(updateData, commonFields);
      updateData.tags = tags ? tags.split(",").map((t) => t.trim()) : [];
      updateData.branchId = branchId;
    }

    mutate(
      { id: document.id, updateData },
      {
        onSuccess: () => {
          resetForm();
          setIsEditDocumentOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.details || "Failed to update document.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const hasErrors =
    !!titleError ||
    !!descriptionError ||
    !!departmentError ||
    !!tagsError ||
    !!notesError;

  const currentVersion = document.version || "v1.0";
  const nextVersion = incrementVersion(currentVersion);

  return (
    <Dialog open={isEditDocumentOpen} onOpenChange={setIsEditDocumentOpen}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white">
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>Update the SOP document details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-xs">
            <span className="text-lg font-mono bg-yellow-100 text-bold text-yellow-800 px-2 py-1 w-fit rounded-xl">
              {currentVersion}
            </span>{" "}
            will be updated to{" "}
            <span className="text-lg font-mono bg-green-100 text-bold text-green-800 px-2 py-1 w-fit rounded-xl">
              {nextVersion}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">
              Document File (Optional - Upload to replace)
            </Label>
            <label
              htmlFor="file"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer block"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Click to upload new file</p>
              <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
            </label>

            <Input
              id="file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            {file ? (
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
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Current file unchanged{" "}
                <span>{existingFile ? `- ${existingFile}` : ""}</span>
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
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
                    setTitleError("Title cannot exceed 50 characters.");
                  } else {
                    setTitleError("");
                  }
                }}
              />
              {titleError && (
                <p className="text-sm text-red-500">{titleError}</p>
              )}
            </div>
          </div>
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
              <Select value={category} onValueChange={setCategory}>
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
              <Select value={accessLevel} onValueChange={setAccessLevel}>
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
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Select
              value={selectedCompany}
              onValueChange={(val) => {
                setSelectedCompany(val);
                const allBranchIds = branches
                  .filter((b) => b.company === val)
                  .map((b) => b.id);
                setBranchId(allBranchIds);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companyData?.map((company: any) => (
                  <SelectItem key={company.id} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
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
          <Button
            variant="outline"
            onClick={() => setIsEditDocumentOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isPending || hasErrors}>
            {isPending ? "Updating..." : "Update Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
