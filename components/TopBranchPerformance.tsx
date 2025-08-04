import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";

const branchPerformance = [
  {
    name: "Manchester",
    occupancy: 95,
    incidents: 1,
    staff: 12,
    status: "excellent",
  },
  {
    name: "Birmingham",
    occupancy: 87,
    incidents: 2,
    staff: 15,
    status: "good",
  },
  {
    name: "London Central",
    occupancy: 92,
    incidents: 0,
    staff: 18,
    status: "excellent",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-800";
    case "good":
      return "bg-blue-100 text-blue-800";
    case "attention":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TopBranchPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Top Branch Performance
        </CardTitle>
        <CardDescription>
          Performance metrics across key branches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {branchPerformance.map((branch, index) => (
            <div
              key={branch.name}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-medium">{branch.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{branch.occupancy}% occupancy</span>
                    <span>{branch.incidents} incidents</span>
                    <span>{branch.staff} staff</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(branch.status)}>
                  {branch.status}
                </Badge>
                <Progress value={branch.occupancy} className="w-32 h-2" />
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View All Branches
        </Button>
      </CardContent>
    </Card>
  );
}
