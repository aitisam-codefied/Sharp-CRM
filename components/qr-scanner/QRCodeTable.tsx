"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import api from "@/lib/axios";
import { CustomPagination } from "../CustomPagination";

interface QRCode {
  _id: string;
  type: string;
  branchId: { name: string; address: string };
  code: string;
  createdAt: string;
  status: boolean;
}

interface QRCodeTableProps {
  qrcodes: QRCode[];
  isLoading: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinal(day)} ${month} ${year}`;
}

export function QRCodeTable({ qrcodes, isLoading }: QRCodeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCodes, setVisibleCodes] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [activeStates, setActiveStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQRId, setSelectedQRId] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 20;
  const totalPages = Math.ceil(qrcodes.length / itemsPerPage);

  const paginatedQRCodes = qrcodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleCodeVisibility = (id: string) => {
    setVisibleCodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openConfirmationModal = (id: string) => {
    setSelectedQRId(id);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setSelectedQRId(null);
  };

  const confirmToggle = async () => {
    if (!selectedQRId) return;

    setIsToggling(true);
    const qrCode = qrcodes.find((qr) => qr._id === selectedQRId);
    if (!qrCode) return;

    const newStatus = !qrCode.status;

    try {
      await api.patch(`/qr-code/${selectedQRId}/status`, { status: newStatus });

      toast({
        title: "Success",
        description: `QR code ${newStatus ? "shown" : "hidden"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update QR code status",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
      closeConfirmationModal();
    }
  };

  if (isLoading || qrcodes.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F87D7D]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F87D7D] text-white rounded-md">
              <TableHead className="text-white font-semibold">
                Modules
              </TableHead>
              <TableHead className="text-white font-semibold">
                Associated With
              </TableHead>
              <TableHead className="text-white font-semibold">Code</TableHead>
              <TableHead className="text-white font-semibold">
                Generated On
              </TableHead>
              {/* <TableHead className="text-white font-semibold">
                Actions
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedQRCodes.map((qr, index) => {
              const isActive = activeStates[qr._id] ?? true;
              return (
                <TableRow
                  key={qr._id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell className="font-medium text-black">
                    {qr.type}
                  </TableCell>
                  <TableCell>
                    {qr.branchId?.name || qr.branchId?.address ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{qr.branchId?.name}</span>
                        <span className="text-xs text-gray-500">
                          {qr.branchId?.address}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not Assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {visibleCodes[qr._id] ? (
                        <>
                          <span className="font-mono">{qr.code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCodeVisibility(qr._id)}
                            className="text-[#F87D7D] hover:text-[#F87D7D]/80"
                          >
                            Hide
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-gray-400">
                            {"•".repeat(qr.code.length)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCodeVisibility(qr._id)}
                            className="text-[#F87D7D] hover:text-[#F87D7D]/80"
                          >
                            Reveal
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(qr.createdAt)}</TableCell>
                  {/* <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmationModal(qr._id)}
                            className="text-[#F87D7D] border-[#F87D7D] hover:bg-[#F87D7D] hover:text-white"
                          >
                            {qr.status === false ? "Show" : "Hide"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {qr.status === false
                            ? "This module will be shown in QR scanner app"
                            : "This module will be hidden from QR scanner app"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <AlertDialog open={isModalOpen} onOpenChange={closeConfirmationModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedQRId &&
              qrcodes.find((qr) => qr._id === selectedQRId)?.status !== false
                ? "This will hide the QR code from the scanner app."
                : "This will show the QR code in the scanner app."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggle}
              disabled={isToggling}
              className="bg-[#F87D7D] hover:bg-[#F87D7D]/90"
            >
              {isToggling ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
