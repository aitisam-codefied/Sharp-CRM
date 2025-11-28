"use client";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Star, Eye, Edit, Trash2, Check, Copy, Info, ChevronRight } from "lucide-react";
import { DisplayFeedback } from "@/hooks/useGetFoodFeedback";
import { useEffect, useMemo, useState, useRef } from "react";
import { CustomPagination } from "../CustomPagination";
import Link from "next/link";

interface Props {
  filteredFeedback: any[];
  getRatingColor: (rating: number) => string;
  getMealTypeColor: (mealType: string) => string;
}

// Component to check if text is truncated and show icon
const CommentWithIcon = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Create a hidden clone element to measure full text height
        const clone = textRef.current.cloneNode(true) as HTMLElement;
        clone.style.position = "absolute";
        clone.style.visibility = "hidden";
        clone.style.height = "auto";
        clone.style.maxHeight = "none";
        clone.style.webkitLineClamp = "unset";
        clone.style.display = "block";
        clone.style.width = textRef.current.offsetWidth + "px";
        
        document.body.appendChild(clone);
        const fullHeight = clone.offsetHeight;
        document.body.removeChild(clone);
        
        // Get the actual clamped height
        const clampedHeight = textRef.current.offsetHeight;
        
        // If full height is greater than clamped height, text is truncated
        setIsTruncated(fullHeight > clampedHeight + 2); // +2 for rounding/line-height differences
      }
    };
    
    // Check after DOM is rendered
    const timeoutId = setTimeout(checkTruncation, 0);
    
    // Recheck on window resize
    window.addEventListener("resize", checkTruncation);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkTruncation);
    };
  }, [text]);

  return (
    <>
      <p
        ref={textRef}
        className="text-sm line-clamp-1 text-blue-600 group-hover:text-blue-800 transition-colors flex-1"
      >
        {text}
      </p>
      {isTruncated && (
        <Info className="h-3.5 w-3.5 text-blue-600 group-hover:text-blue-800 transition-colors flex-shrink-0" />
      )}
    </>
  );
};

export const FeedbackTable = ({
  filteredFeedback,
  getRatingColor,
  getMealTypeColor,
}: Props) => {
  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedPortId, setCopiedPortId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // useEffect(() => {
  //   console.log("object", filteredFeedback);
  // });

  const sortedFeedback = useMemo(() => {
    return [...filteredFeedback].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return dateB - dateA; // latest pehle
    });
  }, [filteredFeedback]);

  // 🔹 Total Pages
  const totalPages = Math.ceil(sortedFeedback.length / itemsPerPage);

  // 🔹 Current Page Data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedFeedback.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredFeedback]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resident</TableHead>
              <TableHead>Port Number</TableHead>
              <TableHead>Meal Details</TableHead>
              {/* <TableHead>Overall Rating</TableHead> */}
              <TableHead>Comments</TableHead>
              <TableHead>Staff</TableHead>
              {/* <TableHead className="">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((feedback) => (
              <TableRow key={feedback?.id}>
                <TableCell>
                  <div>
                    <Link
                      href={`/service-users?highlight=${feedback?.guestId?.userId?.fullName}`}
                      className="hover:underline cursor-pointer"
                    >
                      <div className="font-medium capitalize">
                        {feedback?.guestId?.userId?.fullName}
                      </div>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {feedback?.branchId?.name} •{" "}
                      {feedback?.guestId?.familyRooms[0]?.locationId?.name} •
                      Room{" "}
                      {feedback?.guestId?.familyRooms[0]?.roomId?.roomNumber}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    <div>{feedback?.guestId?.userId?.portNumber}</div>
                    <div>
                      {feedback?.guestId?.userId?.portNumber && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              feedback?.guestId?.userId?.portNumber
                            );
                            setCopiedPortId(feedback._id); // jis user ka copy kiya uska id set
                            setTimeout(() => setCopiedPortId(null), 2000); // 2 sec baad reset
                          }}
                          className="text-gray-500 hover:text-black transition-colors"
                        >
                          {copiedPortId === feedback._id ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(
                        feedback?.details[feedback?.details.length - 1]
                          ?.weekStartDate
                      )}{" "}
                      -{" "}
                      {formatDate(
                        feedback?.details[feedback?.details.length - 1]
                          ?.weekEndDate
                      )}
                    </div>
                  </div>
                </TableCell>
                {/* <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span
                      className={`font-bold ${getRatingColor(
                        feedback?.details[feedback?.details.length - 1]
                          ?.overallRating
                      )}`}
                    >
                      {
                        feedback?.details[feedback?.details.length - 1]
                          ?.overallRating
                      }
                    </span>
                  </div>
                </TableCell> */}
                <TableCell>
                  {(() => {
                    const comments =
                      feedback?.details[feedback?.details.length - 1]
                        ?.comments || "";
                    const isAutoGenerated =
                      comments.includes(
                        "Initial food feedback created automatically"
                      );
                    const hasComments = comments && !isAutoGenerated;

                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex items-center gap-1 max-w-xs cursor-pointer group">
                            {hasComments ? (
                              <CommentWithIcon text={comments} />
                            ) : (
                              <p className="text-sm text-blue-600 group-hover:text-blue-800 transition-colors">
                                No Comments Provided
                              </p>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          className="max-w-md whitespace-pre-line"
                          side="top"
                          align="start"
                        >
                          <div className="space-y-1">
                            <h4 className="font-semibold text-sm mb-2">
                              Comments
                            </h4>
                            {hasComments ? (
                              <div className="text-sm">
                                {comments
                                  .split("\n")
                                  .map((line: string, index: number) => (
                                    <div key={index} className="mb-1">
                                      {line}
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No Comments Provided
                              </p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })()}
                </TableCell> 
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {feedback?.staffId?.fullName
                      ? feedback?.staffId?.fullName
                      : "No Staff Assigned"}
                  </div>
                </TableCell>
                {/* <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};
