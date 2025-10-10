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
import { Star, Eye, Edit, Trash2 } from "lucide-react";
import { DisplayFeedback } from "@/hooks/useGetFoodFeedback";
import { useEffect, useMemo, useState } from "react";
import { CustomPagination } from "../CustomPagination";

interface Props {
  filteredFeedback: any[];
  getRatingColor: (rating: number) => string;
  getMealTypeColor: (mealType: string) => string;
}

export const FeedbackTable = ({
  filteredFeedback,
  getRatingColor,
  getMealTypeColor,
}: Props) => {
  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
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
              <TableHead>Meal Details</TableHead>
              <TableHead>Overall Rating</TableHead>
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
                    <div className="font-medium capitalize">
                      {feedback?.guestId?.userId?.fullName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {feedback?.branchId?.name} •{" "}
                      {feedback?.guestId?.familyRooms[0]?.locationId?.name} •
                      Room{" "}
                      {feedback?.guestId?.familyRooms[0]?.roomId?.roomNumber}
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
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <p className="text-sm line-clamp-2 max-w-xs">
                    {feedback?.details[feedback?.details.length - 1]?.comments
                      ? feedback?.details[feedback?.details.length - 1]
                          ?.comments
                      : "No Comments Provided"}
                  </p>
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
