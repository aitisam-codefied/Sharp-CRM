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

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resident</TableHead>
              <TableHead>Branch & Room</TableHead>
              <TableHead>Dietary Requirements</TableHead>
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
                  <div className="flex flex-wrap gap-1">
                    {resident.dietary.length > 0 ? (
                      resident.dietary.map((diet: any) => (
                        <Badge key={diet} variant="outline" className="text-xs">
                          {diet}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        None
                      </span>
                    )}
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
                        <div>{resident.meals.breakfast.time}</div>
                        <div>{resident.meals.breakfast.staff}</div>
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
                        <div>{resident.meals.lunch.time}</div>
                        <div>{resident.meals.lunch.staff}</div>
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
                        <div>{resident.meals.dinner.time}</div>
                        <div>{resident.meals.dinner.staff}</div>
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
