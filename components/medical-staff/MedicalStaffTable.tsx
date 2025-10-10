"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Pencil } from "lucide-react";
import { EditMedicalStaffModal } from "@/components/medical-staff/EditMedicalStaffModal";
import { ChangeStatusModal } from "@/components/medical-staff/ChangeStatusModal";
import { DeleteMedicalStaffModal } from "@/components/medical-staff/DeleteMedicalStaffModal";
import { CustomPagination } from "../CustomPagination";
import { RoleWrapper } from "@/lib/RoleWrapper";
import { useAuth } from "../providers/auth-provider";

interface Staff {
  _id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  type: string;
  branches: any[];
  status: string;
  createdAt: any;
}

interface MedicalStaffTableProps {
  staff: Staff[];
  getStatusColor: (status: string) => string;
  handleViewDetails: (id: string) => void;
}

export function MedicalStaffTable({
  staff,
  getStatusColor,
  handleViewDetails,
}: MedicalStaffTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
    });
  };

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setEditModalOpen(true);
  };

  const handleChangeStatus = (staff: Staff) => {
    if (staff?.status !== "Active" && staff?.status !== "Inactive") return;
    setSelectedStaff(staff);
    setStatusModalOpen(true);
  };

  const handleDelete = (staff: Staff) => {
    setSelectedStaff(staff);
    setDeleteModalOpen(true);
  };

  // useEffect(() => {
  //   console.log("doctorssssss", staff);
  // });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Registered On</TableHead>
              <TableHead>Status</TableHead>
              {RoleWrapper(
                user?.roles[0]?.name,
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((staffItem) => (
              <TableRow className="text-xs" key={staffItem?._id}>
                <TableCell>
                  <div>
                    <div className="font-medium capitalize">
                      {staffItem?.fullName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-xs capitalize bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full w-fit">
                      {staffItem?.branches[0]?.companyId?.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {/* Email clickable */}
                  <div className="font-medium">
                    <a
                      href={`mailto:${staffItem?.emailAddress}`}
                      className="hover:underline"
                    >
                      {staffItem?.emailAddress}
                    </a>
                  </div>

                  {/* Phone clickable */}
                  <div className="font-medium mt-1">
                    <a
                      href={`tel:${staffItem?.phoneNumber}`}
                      className="hover:underline"
                    >
                      {staffItem?.phoneNumber}
                    </a>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="font-medium">{staffItem?.type}</span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(staffItem?.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className={getStatusColor(staffItem?.status)}
                    >
                      {staffItem?.status}
                    </Badge>
                    {RoleWrapper(
                      user?.roles[0]?.name || "",
                      <div>
                        {(staffItem?.status === "Active" ||
                          staffItem?.status === "Inactive") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChangeStatus(staffItem)}
                          >
                            <Pencil className="h-1 w-1" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {RoleWrapper(
                    user?.roles[0]?.name || "",
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(staffItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedStaff && (
          <>
            <EditMedicalStaffModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              staff={selectedStaff}
            />
            <ChangeStatusModal
              isOpen={statusModalOpen}
              onClose={() => setStatusModalOpen(false)}
              staffId={selectedStaff?._id}
              currentStatus={selectedStaff?.status as "Active" | "Inactive"}
            />
            <DeleteMedicalStaffModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              staffId={selectedStaff?._id}
              staffName={selectedStaff?.fullName}
            />
          </>
        )}
      </div>
    </>
  );
}
