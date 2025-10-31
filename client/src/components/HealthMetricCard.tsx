import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface HealthMetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  timestamp?: string;
  txStatus?: "pending" | "confirmed" | "failed";
}

export function HealthMetricCard({
  title,
  value,
  unit,
  icon: Icon,
  timestamp,
  txStatus,
}: HealthMetricCardProps) {
  const getStatusBadge = () => {
    if (!txStatus) return null;
    
    switch (txStatus) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600 text-xs">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
    }
  };

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold" data-testid={`metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value} <span className="text-lg text-muted-foreground">{unit}</span>
          </div>
          <div className="flex items-center justify-between">
            {timestamp && (
              <p className="text-xs text-muted-foreground" data-testid="metric-timestamp">
                {timestamp}
              </p>
            )}
            {getStatusBadge()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
