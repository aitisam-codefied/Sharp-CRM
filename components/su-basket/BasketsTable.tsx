import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Search, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Basket } from "@/hooks/useGetBaskets";

interface BasketsTableProps {
  baskets: Basket[];
}

export const BasketsTable = ({ baskets }: BasketsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();

  const branches = [
    "All Branches",
    ...new Set(baskets.map((basket) => basket.branchId?.name).filter(Boolean)),
  ];
  const statuses = [
    "all",
    "Pending",
    "Completed",
    "Active",
    "Draft",
    "On Hold",
  ];

  const filteredBaskets = baskets.filter((basket) => {
    const matchesSearch =
      basket.guestId.userId.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      basket.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch =
      selectedBranch === "all" || basket.branchId?.name === selectedBranch;
    const matchesStatus =
      selectedStatus === "all" || basket.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "on hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewBasket = (basketId: string) => {
    toast({
      title: "View Basket",
      description: `Opening basket ${basketId}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Service User Baskets
        </CardTitle>
        <CardDescription>
          Manage and track service user baskets across all branches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search baskets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {/* <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem
                  key={branch ?? "Not Assigned"}
                  value={branch ?? "Not Assigned"}
                >
                  {branch ?? "Not Assigned"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Basket Details</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Key Metrics</TableHead>
                <TableHead>Assignment Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBaskets.map((basket) => (
                <TableRow key={basket._id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {basket.guestId.userId.fullName}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {basket.notes}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Items: {basket.totalItems}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {basket.branchId?.name || "Not Assigned"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs font-medium">
                        {Math.round(
                          (basket.deliveredItems / (basket.totalItems || 1)) *
                            100
                        )}
                        % Complete
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {basket.deliveredItems}/{basket.totalItems} items
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(basket.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        By: {basket.staffId?.fullName || "Not Assigned"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge className={getStatusColor(basket.status)}>
                        {basket.status.charAt(0).toUpperCase() +
                          basket.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBasket(basket._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredBaskets.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No baskets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or create a new basket.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
