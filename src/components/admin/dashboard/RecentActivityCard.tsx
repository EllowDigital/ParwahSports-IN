import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface RecentItem {
  id: string;
  type: "donation" | "volunteer" | "member" | "event";
  title: string;
  subtitle: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface RecentActivityCardProps {
  activity: RecentItem[];
  isLoading: boolean;
}

const typeBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  donation: { label: "Donation", variant: "destructive" },
  volunteer: { label: "Volunteer", variant: "default" },
  member: { label: "Member", variant: "secondary" },
  event: { label: "Event", variant: "outline" },
};

export function RecentActivityCard({ activity, isLoading }: RecentActivityCardProps) {
  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-xs">Latest actions across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activity.map((item, i) => (
              <div key={item.id + item.type}>
                <div className="flex items-start gap-3 py-2.5">
                  <div className={`p-1.5 rounded-lg ${item.bg} shrink-0 mt-0.5`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <Badge variant={typeBadge[item.type]?.variant || "outline"} className="text-[9px] px-1.5 py-0 h-4 shrink-0">
                        {typeBadge[item.type]?.label || item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                    {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                  </span>
                </div>
                {i < activity.length - 1 && <Separator className="ml-9" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
