"use client";
import { useEffect, useState } from "react";
import { useCompanies } from "@/hooks/useCompnay"; // Fix typo: should be useCompany
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
import { Building, Edit, Trash2, Eye } from "lucide-react";
import ViewCompanyModal from "./ViewCompanyModal";
import EditCompanyModal from "./EditCompanyModal";
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
        capacity: number;
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
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Sync companies state with fetched data
  useEffect(() => {
    setCompanies(companiesData);
  }, [companiesData]);

  // Handle company updates (e.g., when a branch is added)
  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company._id === updatedCompany._id ? updatedCompany : company
      )
    );
  };

  const getCompanyStats = (company: Company) => {
    const totalBranches = company.branches.length;
    const totalLocations = company.branches.reduce(
      (acc, branch) => acc + branch.locations.length,
      0
    );
    const totalRooms = company.branches.reduce(
      (acc, branch) =>
        acc +
        branch.locations.reduce(
          (locAcc, location) => locAcc + location.rooms.length,
          0
        ),
      0
    );
    const totalCapacity = company.branches.reduce(
      (acc, branch) =>
        acc +
        branch.locations.reduce(
          (locAcc, location) =>
            locAcc +
            location.rooms.reduce(
              (roomAcc, room) => roomAcc + room.capacity,
              0
            ),
          0
        ),
      0
    );

    return { totalBranches, totalLocations, totalRooms, totalCapacity };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading companies...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading companies</div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Companies Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Branches</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Total Rooms</TableHead>
                <TableHead>Total Capacity</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => {
                const stats = getCompanyStats(company);
                return (
                  <TableRow key={company._id}>
                    <TableCell className="font-medium">
                      {company.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stats.totalBranches}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stats.totalLocations}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stats.totalRooms}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stats.totalCapacity}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(company.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCompany(company);
                            setViewModalOpen(true);
                          }}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCompany(company);
                            setEditModalOpen(true);
                          }}
                          className="h-8 w-8"
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
                          className="h-8 w-8 text-red-600 hover:text-red-700"
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
        </CardContent>
      </Card>

      <ViewCompanyModal
        company={selectedCompany}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedCompany(null);
        }}
        onCompanyUpdate={handleCompanyUpdate}
      />

      <EditCompanyModal
        company={editingCompany}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingCompany(null);
        }}
        onSave={(updatedCompany) => {
          setCompanies((prev) =>
            prev.map((company) =>
              company._id === updatedCompany._id ? updatedCompany : company
            )
          );
          setEditModalOpen(false);
          setEditingCompany(null);
        }}
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
