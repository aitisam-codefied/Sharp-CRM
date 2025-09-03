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
  if (totalPages <= 1) return null;

  // Function to generate pages with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all pages if ≤ 5
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      // Show "..." if currentPage > 3
      if (currentPage > 3) pages.push("...");

      // Show currentPage - 1, currentPage, currentPage + 1
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      // Show "..." if currentPage < totalPages - 2
      if (currentPage < totalPages - 2) pages.push("...");

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination className="mt-4 w-full overflow-x-auto">
      <PaginationContent className="flex gap-1 text-sm sm:text-base">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={`px-2 sm:px-3 py-1 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#F87D7D] hover:text-white hover:bg-[#F87D7D]"
            } border border-[#F87D7D] rounded-md text-xs sm:text-sm`}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {/* Page Numbers with Ellipsis */}
        {getPageNumbers().map((page, idx) => (
          <PaginationItem key={idx}>
            {page === "..." ? (
              <span className="px-2 sm:px-3 py-1 text-gray-500">...</span>
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
                className={`px-2 sm:px-3 py-1 ${
                  currentPage === page
                    ? "bg-[#F87D7D] text-white"
                    : "text-[#F87D7D] hover:bg-[#F87D7D] hover:text-white"
                } border border-[#F87D7D] rounded-md text-xs sm:text-sm`}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
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
            className={`px-2 sm:px-3 py-1 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#F87D7D] hover:text-white hover:bg-[#F87D7D]"
            } border border-[#F87D7D] rounded-md text-xs sm:text-sm`}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
