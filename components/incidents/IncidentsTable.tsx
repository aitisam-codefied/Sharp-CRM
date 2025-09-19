// IncidentsTable.tsx
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
import { Eye, Edit, MapPin, User } from "lucide-react";

interface UIIncident {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  reportedBy: string;
  assignedTo: string;
  branch: string;
  location: string;
  residentInvolved: string;
  dateReported: string;
  timeReported: string;
  dateResolved: string | null;
  timeResolved: string | null;
  category: string;
  actionsTaken: string;
}

interface IncidentsTableProps {
  incidents: UIIncident[];
  getSeverityColor: (severity: string) => string;
  getStatusColor: (status: string) => string;
  getCategoryColor: (category: string) => string;
  handleViewIncident: (incidentId: string) => void;
}

export default function IncidentsTable({
  incidents,
  getSeverityColor,
  getStatusColor,
  getCategoryColor,
  handleViewIncident,
}: IncidentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="">
            <TableHead>Incident Details</TableHead>
            <TableHead>Location & Resident</TableHead>
            <TableHead>Severity & Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reported</TableHead>
            {/* <TableHead className="text-right">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{incident.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {incident.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {incident.branch}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {incident.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-3 w-3 mr-1" />
                    {incident.residentInvolved}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-start gap-2 capitalize">
                  <Badge
                    variant="outline"
                    className={getSeverityColor(incident.severity)}
                  >
                    {incident.severity}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getCategoryColor(incident.category)}
                  >
                    {incident.category}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    getStatusColor(incident.status) + "capitalize w-fit"
                  }
                >
                  {incident.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm">{incident.dateReported}</div>
                  <div className="text-sm text-muted-foreground">
                    {incident.timeReported}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    by {incident.reportedBy}
                  </div>
                </div>
              </TableCell>
              {/* <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewIncident(incident.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
