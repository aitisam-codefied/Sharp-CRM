"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetReports } from "@/hooks/useGetReports";
import { Tree } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const moduleName = (module: string) => {
  const name = module
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase();
  return name?.charAt(0)?.toUpperCase() + name?.slice(1);
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const { toast } = useToast();

  // Fetch data using the hook
  const { data: reports = [], isLoading, error } = useGetReports();

  useEffect(() => {
    console.log("reportss", reports);
  });

  // Dynamically get unique branches from reports
  const branches = [
    "All Branches",
    ...Array.from(
      new Set(reports.map((report: any) => report.branchId.name))
    ).sort(),
  ];

  // Filter reports based on search term and branch
  const filteredReports = reports?.filter((report: any) => {
    const matchesSearch =
      report?.branchId?.name
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      report?.branchId?.address
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase());
    const matchesBranch =
      selectedBranch === "All Branches" ||
      report?.branchId?.name === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const handleDownloadReport = (report: any) => {
    const doc = new jsPDF("p", "mm", "a4");

    // PDF Title
    doc.setFontSize(18);
    doc.text(`Branch Report`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Branch: ${report?.branchId?.name}`, 14, 30);
    doc.text(`Address: ${report?.branchId?.address}`, 14, 37);
    doc.text(`Period: ${report?.month}/${report?.year}`, 14, 44);
    doc.text(`Generated At: ${formatDate(report?.generatedAt)}`, 14, 51);

    let y = 65; // starting y position

    const drawCard = (title: string, data: any) => {
      let startY = y;
      let innerY = startY + 15; // card content start
      const colX = 20;

      // pehle calculate kar lo total height (jitni lines draw hongi)
      let lineCount = 0;
      Object.entries(data || {}).forEach(([k, v]) => {
        if (typeof v === "object" && v !== null) {
          lineCount++; // for bold heading
          Object.entries(v).forEach(() => {
            lineCount++; // nested keys
          });
        } else {
          lineCount++;
        }
      });

      const cardHeight = lineCount * 5 + 20; // each line = 5px + title bar + padding

      // Page break agar current card fit nahi ho raha
      if (startY + cardHeight > 280) {
        doc.addPage();
        startY = 20;
        innerY = startY + 15;
      }

      // Card border
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, startY, 180, cardHeight, 3, 3);

      // Title background
      doc.setFillColor(248, 125, 125); // #F87D7D
      doc.roundedRect(14, startY, 180, 8, 3, 3, "F");

      // Title text
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), 19, startY + 6);

      // Reset text color for body
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);

      // Draw content
      Object.entries(data || {}).forEach(([k, v]) => {
        if (typeof v === "object" && v !== null) {
          doc.setFont(undefined, "bold");
          doc.text(moduleName(k) + ":", colX, innerY);
          doc.setFont(undefined, "normal");
          innerY += 5;
          Object.entries(v).forEach(([nk, nv]) => {
            doc.text(`${moduleName(nk)}: ${String(nv)}`, colX + 5, innerY);
            innerY += 5;
          });
        } else {
          doc.text(`${moduleName(k)}: ${String(v)}`, colX, innerY);
          innerY += 5;
        }
      });

      // Update Y for next card
      y = startY + cardHeight + 10;
    };

    // Loop through each section in report.data
    Object.entries(report?.data || {}).forEach(([section, sectionData]) => {
      drawCard(moduleName(section), sectionData);

      // Page break check between cards
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(
      `Report_${report?.branchId?.name}_${report?.month}_${report?.year}.pdf`
    );
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const convertToTreeData = (data: any, parentKey = ""): any[] => {
    return Object.entries(data || {}).map(([key, value]) => {
      const nodeKey = parentKey ? `${parentKey}-${key}` : key;

      if (typeof value === "object" && value !== null) {
        return {
          title: moduleName(key), // just the section name
          key: nodeKey,
          children: convertToTreeData(value, nodeKey), // recurse deeper
        };
      }

      return {
        title: `${key}: ${String(value)}`, // leaf metric
        key: nodeKey,
      };
    });
  };

  return (
    <DashboardLayout
      title="Reports"
      description="Comprehensive reports and analytics across all operational areas"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="p-5">
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports by branch or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F87D7D] mx-auto"></div>
                <p className="mt-2">Loading Reports...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading reports: {error.message}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or generate a new report.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Branch & Period</TableHead>
                      <TableHead>Key Metrics</TableHead>
                      <TableHead>Generation Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report: any) => (
                      <TableRow key={report?._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {report?.branchId?.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {report?.branchId?.address}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Period: {report?.month}/{report?.year}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="max-h-40 overflow-y-auto">
                            <Tree
                              treeData={convertToTreeData(report?.data)}
                              defaultExpandAll={false}
                              showLine
                            />
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(report?.generatedAt)}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReport(report)}
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
