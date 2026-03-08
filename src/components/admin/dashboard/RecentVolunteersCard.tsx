import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ArrowRight, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface RecentVolunteer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  area_of_interest: string;
  status: string;
  created_at: string;
}

interface RecentVolunteersCardProps {
  volunteers: RecentVolunteer[];
  isLoading: boolean;
}

const statusStyle: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  approved: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  rejected: "bg-red-500/10 text-red-700 border-red-200",
};

export function RecentVolunteersCard({ volunteers, isLoading }: RecentVolunteersCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Recent Volunteers
            </CardTitle>
            <CardDescription className="text-xs mt-1">Latest volunteer applications</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
            <Link to="/admin/volunteers">View all <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : volunteers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="w-7 h-7 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No volunteer applications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {volunteers.map((v) => (
              <div
                key={v.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                  {v.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground truncate">{v.full_name}</p>
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 shrink-0 ${statusStyle[v.status] || ""}`}>
                      {v.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{v.area_of_interest}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Mail className="w-2.5 h-2.5" /> {v.email}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
