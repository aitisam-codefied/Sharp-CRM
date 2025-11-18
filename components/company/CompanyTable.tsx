"use client";
import { useEffect, useState } from "react";
import { useCompanies } from "@/hooks/useCompnay"; // Fixed typo: useCompany
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Building, Edit, Trash2, Eye, TrendingUp } from "lucide-react";
import ViewCompanyModal from "./ViewCompanyModal";
import DeleteCompanyDialog from "./DeleteCompanyDialog";

interface Company {
  _id: string;
  name: string;
  type: string;
  branches: Array<{
    _id: string;
    name: string;
    address: string;
    locations: Array<{
      _id: string;
      name: string;
      rooms: Array<{
        _id: string;
        roomNumber: string;
        type: string;
        amenities: string[];
      }>;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyTable() {
  const { data: companiesData = [], isLoading, isError } = useCompanies();
  const [companies, setCompanies] = useState<Company[]>(companiesData);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

  // Sync companies state with fetched data
  useEffect(() => {
    setCompanies(companiesData);
  }, [companiesData]);

  useEffect(() => {
    console.log("companies", companiesData);
  });

  // Handle company updates (e.g., when a branch or company name is updated)
  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company._id === updatedCompany._id ? updatedCompany : company
      )
    );
  };

  const getCompanyStats = (company: Company) => {
    const totalBranches = company.branches?.length;
    const totalLocations = company.branches?.reduce(
      (acc, branch) => acc + branch.locations?.length,
      0
    );
    const totalRooms = company.branches?.reduce(
      (acc, branch) =>
        acc +
        branch.locations?.reduce(
          (locAcc, location) => locAcc + location.rooms?.length,
          0
        ),
      0
    );

    return { totalBranches, totalLocations, totalRooms };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium text-gray-600">
            Loading companies...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-lg font-medium text-red-600">
            Error loading companies
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Please try refreshing the page
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gray-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-md sm:text-xl">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Building className="h-6 w-6" />
            </div>
            Companies Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            {companies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No companies registered</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start by adding your first company.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Company Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Branches
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Floors
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Total Rooms
                    </TableHead>

                    <TableHead className="font-semibold text-gray-700">
                      Created
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => {
                    const stats = getCompanyStats(company);
                    return (
                      <TableRow
                        key={company._id}
                        className="hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f87d7d] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {company?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {company.name}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {company.type}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 font-medium"
                          >
                            {stats.totalBranches}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 font-medium"
                          >
                            {stats.totalLocations}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300 font-medium"
                          >
                            {stats.totalRooms}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {new Date(company.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCompany(company);
                                setIsEditable(false);
                                setViewModalOpen(true);
                              }}
                              className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCompany(company);
                                setIsEditable(true);
                                setViewModalOpen(true);
                              }}
                              className="h-8 w-8 hover:bg-amber-100 hover:text-amber-600 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeletingCompany(company);
                                setDeleteDialogOpen(true);
                              }}
                              className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <ViewCompanyModal
        company={selectedCompany}
        isOpen={viewModalOpen}
        isEditable={isEditable}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedCompany(null);
          setIsEditable(false);
        }}
        onCompanyUpdate={handleCompanyUpdate}
      />

      <DeleteCompanyDialog
        company={deletingCompany}
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingCompany(null);
        }}
      />
    </>
  );
}
