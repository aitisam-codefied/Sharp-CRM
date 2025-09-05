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

interface Staff {
  _id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  type: string;
  branches: string[];
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setEditModalOpen(true);
  };

  const handleChangeStatus = (staff: Staff) => {
    if (staff.status !== "active" && staff.status !== "inactive") return;
    setSelectedStaff(staff);
    setStatusModalOpen(true);
  };

  const handleDelete = (staff: Staff) => {
    setSelectedStaff(staff);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    console.log("doctorssssss", staff);
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Registered On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((staffItem) => (
            <TableRow key={staffItem._id}>
              <TableCell>
                <div>
                  <div className="font-medium">{staffItem.fullName}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{staffItem.emailAddress}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{staffItem.phoneNumber}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">{staffItem.type}</span>
              </TableCell>
              <TableCell>
                <div className="text-sm">{formatDate(staffItem.createdAt)}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className={getStatusColor(staffItem.status)}
                  >
                    {staffItem.status}
                  </Badge>
                  {(staffItem.status === "active" ||
                    staffItem.status === "inactive") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleChangeStatus(staffItem)}
                    >
                      <Pencil className="h-1 w-1" />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(staffItem._id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(staffItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(staffItem)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                </div>
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
            staffId={selectedStaff._id}
            currentStatus={selectedStaff.status as "active" | "inactive"}
          />
          <DeleteMedicalStaffModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            staffId={selectedStaff._id}
            staffName={selectedStaff.fullName}
          />
        </>
      )}
    </div>
  );
}
