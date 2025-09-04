// src/components/in-transit/UsersTable.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { InTransitUser } from "@/hooks/useGetInTransitUsers";

interface UsersTableProps {
  filteredUsers: InTransitUser[];
  handleViewUser: (userId: string) => void;
  handleMarkArrived: (userId: string) => void;
}

export default function UsersTable({
  filteredUsers,
  handleViewUser,
  handleMarkArrived,
}: UsersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "requested":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "in_transit":
        return <Truck className="h-4 w-4" />;
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />;
      case "arrived":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service User</TableHead>
            <TableHead>Contact Details</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Emergency Details</TableHead>
            <TableHead>Special Requirements</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead className="text-right">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="font-medium">{user.language}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.nationality} • {user.gender} • Age {user.age}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    {user.contactNumber}
                  </div>
                  <div className="flex items-center text-xs">{user.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Room {user.assignedRoom}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {user.emergencyContact ? (
                  <div className="flex flex-col gap-2 mx-auto">
                    <div className="text-[11px] px-2 py-1">
                      Name:{" "}
                      <Badge className="bg-orange-200 text-orange-900">
                        {" "}
                        {user.emergencyContact.name}
                      </Badge>
                    </div>
                    <div className="text-[11px] px-2 py-1">
                      Relation:{" "}
                      <Badge className="bg-blue-200 text-blue-900">
                        {user.emergencyContact.relation}
                      </Badge>
                    </div>
                    <div className="text-[11px] px-2 py-1">
                      Phone:{" "}
                      <Badge className="bg-green-200 text-green-900">
                        {user.emergencyContact.phone}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No emergency contact
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  {user.specialRequirements.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {user.specialRequirements.map((req: any) => (
                        <Badge key={req} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs">No Dietary Requirments Specified</p>
                  )}
                  {(user.medicalCondition ||
                    user.allergies ||
                    user.currentMedications) && (
                    <div className="flex flex-col gap-2 text-xs">
                      {user.medicalCondition && (
                        <div className="flex items-center gap-2">
                          <strong className="text-red-600">Condition:</strong>
                          <div className="flex flex-wrap gap-1">
                            {user.medicalCondition
                              .split(",")
                              .map((condition, idx) => (
                                <Badge
                                  key={idx}
                                  variant="destructive"
                                  className="text-[10px]"
                                >
                                  {condition.trim()}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}

                      {user.allergies && (
                        <div className="flex items-center gap-2">
                          <strong className="text-yellow-600">
                            Allergies:
                          </strong>
                          <div className="flex flex-wrap gap-1">
                            {user.allergies.split(",").map((allergy, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {allergy.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.currentMedications && (
                        <div className="flex items-center gap-2">
                          <strong className="text-blue-600">Medication:</strong>
                          <div className="flex flex-wrap gap-1">
                            {user.currentMedications
                              .split(",")
                              .map((med, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {med.trim()}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(user.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(user.status)}
                    {user.status
                      .replace("_", " ")
                      .replace(/\b\w/g, (l: any) => l.toUpperCase())}
                  </div>
                </Badge>
              </TableCell>
              {/* <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewUser(user.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {user.status !== "arrived" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkArrived(user.id)}
                    >
                      Mark Arrived
                    </Button>
                  )}
                </div>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
