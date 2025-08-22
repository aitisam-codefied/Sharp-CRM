"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null; // agar ek hi page ho to pagination mat dikhao

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={`${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#F87D7D] hover:text-white hover:bg-[#F87D7D]"
            } border border-[#F87D7D] rounded-md`}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              className={`${
                currentPage === page
                  ? "bg-[#F87D7D] text-white"
                  : "text-[#F87D7D] hover:bg-[#F87D7D] hover:text-white"
              } border border-[#F87D7D] rounded-md`}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={`${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#F87D7D] hover:text-white hover:bg-[#F87D7D]"
            } border border-[#F87D7D] rounded-md`}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
