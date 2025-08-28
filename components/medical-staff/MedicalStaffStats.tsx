import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, UserCheck, UserPlus } from "lucide-react";

interface MedicalStaffStatsProps {
  filteredStaff: any[]; // Replace 'any' with your MedicalStaff type
}

export function MedicalStaffStats({ filteredStaff }: MedicalStaffStatsProps) {
  const getStats = () => {
    const totalStaff = filteredStaff.length;
    const activeStaff = filteredStaff.filter((s) => s.status === "active").length;
    const onLeaveStaff = filteredStaff.filter((s) => s.status === "on-leave").length;
    return { totalStaff, activeStaff, onLeaveStaff };
  };

  const stats = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Staff</p>
              <p className="text-2xl font-bold">{stats.totalStaff}</p>
            </div>
            <Stethoscope className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Staff</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeStaff}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.onLeaveStaff}</p>
            </div>
            <UserPlus className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}