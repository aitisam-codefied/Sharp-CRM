"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CheckCircle, Clock } from "lucide-react";
import { useEffect } from "react";
import { CustomPagination } from "../CustomPagination";

export default function MealsTable({
  residents,
  currentPage,
  onPageChange,
}: any) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(residents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResidents = residents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    console.log("residents", residents);
  });

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resident</TableHead>
              <TableHead>Branch & Room</TableHead>

              <TableHead>Breakfast</TableHead>
              <TableHead>Lunch</TableHead>
              <TableHead>Dinner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResidents.map((resident: any) => (
              <TableRow key={resident.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{resident.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{resident.branch}</div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-2">
                    {resident.meals.breakfast.marked === true ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs"> Delivered</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 text-red-600" />
                        <span className="text-xs">Not Delivered</span>
                      </>
                    )}
                    <br />
                    {resident.meals.breakfast.marked === true && (
                      <div className="text-xs text-muted-foreground">
                        <div>{formatDate(resident.meals.breakfast.time)}</div>
                      </div>
                    )}

                    {resident.meals.breakfast.marked === false &&
                      resident.meals.breakfast.reasonIfNotTaken && (
                        <div className="text-xs bg-green-100 text-green-800 px-3 py-1 w-fit rounded-xl">
                          {resident.meals.breakfast.reasonIfNotTaken
                            ? resident.meals.breakfast.reasonIfNotTaken
                            : "No reason provided"}
                        </div>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {resident.meals.lunch.marked === true ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs"> Delivered</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 text-red-600" />
                        <span className="text-xs">Not Delivered</span>
                      </>
                    )}
                    {resident.meals.lunch.marked === true && (
                      <div className="text-xs text-muted-foreground">
                        <div>{formatDate(resident.meals.lunch.time)}</div>
                      </div>
                    )}

                    {resident.meals.lunch.marked === false &&
                      resident.meals.lunch.reasonIfNotTaken && (
                        <div className="text-xs bg-green-100 text-green-800 px-3 py-1 w-fit rounded-xl">
                          {resident.meals.lunch.reasonIfNotTaken
                            ? resident.meals.lunch.reasonIfNotTaken
                            : "No reason provided"}
                        </div>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {resident.meals.dinner.marked === true ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs"> Delivered</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 text-red-600" />
                        <span className="text-xs">Not Delivered</span>
                      </>
                    )}
                    {resident.meals.dinner.marked === true && (
                      <div className="text-xs text-muted-foreground">
                        <div>{formatDate(resident.meals.dinner.time)}</div>
                      </div>
                    )}

                    {resident.meals.dinner.marked === false &&
                      resident.meals.dinner.reasonIfNotTaken && (
                        <div className="text-xs bg-green-100 text-green-800 px-3 py-1 w-fit rounded-xl">
                          {resident.meals.dinner.reasonIfNotTaken
                            ? resident.meals.dinner.reasonIfNotTaken
                            : "No reason provided"}
                        </div>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
