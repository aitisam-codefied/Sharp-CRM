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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CustomPagination = ({ currentPage, totalPages, onPageChange }: any) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
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
};

export default function MealsTable({
  residents,
  handleMealToggle,
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
                    <Checkbox
                      id={`${resident.id}-breakfast`}
                      checked={resident.meals.breakfast.marked}
                      onCheckedChange={(checked) =>
                        handleMealToggle(resident.id, "breakfast", checked)
                      }
                    />
                    {resident.meals.breakfast.marked && (
                      <div className="text-xs text-muted-foreground">
                        <div>{resident.meals.breakfast.time}</div>
                        <div>{resident.meals.breakfast.staff}</div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${resident.id}-lunch`}
                      checked={resident.meals.lunch.marked}
                      onCheckedChange={(checked) =>
                        handleMealToggle(resident.id, "lunch", checked)
                      }
                    />
                    {resident.meals.lunch.marked && (
                      <div className="text-xs text-muted-foreground">
                        <div>{resident.meals.lunch.time}</div>
                        <div>{resident.meals.lunch.staff}</div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${resident.id}-dinner`}
                      checked={resident.meals.dinner.marked}
                      onCheckedChange={(checked) =>
                        handleMealToggle(resident.id, "dinner", checked)
                      }
                    />
                    {resident.meals.dinner.marked && (
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
