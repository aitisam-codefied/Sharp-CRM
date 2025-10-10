import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Calendar, Clock } from "lucide-react";
import api from "@/lib/axios";

const fetchStaffMembers = async () => {
  const response = await api.get("/user/list");
  return response.data;
};

export default function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["staffList"],
    queryFn: fetchStaffMembers,
  });

  console.log("data", data);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Staff</p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : data?.totalCount || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Staff</p>
              <p className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : data?.users?.filter(
                      (user: any) => user?.status === "Active"
                    ).length || 0}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div>
            <p className="text-sm text-muted-foreground">Inactive Staff</p>
            <p className="text-2xl font-bold">
              {isLoading
                ? "..."
                : data?.users?.filter(
                    (user: any) => user?.status === "Inactive"
                  ).length || 0}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
