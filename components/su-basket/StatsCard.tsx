import { Card, CardContent } from "@/components/ui/card";
import { Package, User, Clock } from "lucide-react";
import { Basket } from "@/hooks/useGetBaskets";

interface StatsCardsProps {
  baskets: Basket[];
}

export const StatsCard = ({ baskets }: StatsCardsProps) => {
  const getStats = () => {
    const totalBaskets = baskets.length;
    const activeBaskets = baskets.filter((b) => b.isActive).length;
    const completedBaskets = baskets.filter(
      (b) => b.status === "Completed"
    ).length;
    const totalItems = baskets.reduce(
      (sum, basket) => sum + basket.totalItems,
      0
    );

    return { totalBaskets, activeBaskets, completedBaskets, totalItems };
  };

  const stats = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Baskets</p>
              <p className="text-2xl font-bold">{stats.totalBaskets}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Baskets</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.activeBaskets}
              </p>
            </div>
            <User className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.completedBaskets}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.totalItems}
              </p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
