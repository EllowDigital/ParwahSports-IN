import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  href: string;
  color: string;
  bg: string;
  description: string;
  isLoading: boolean;
  trend?: { value: string; up: boolean };
}

export function MetricCard({ title, value, icon: Icon, href, color, bg, description, isLoading, trend }: MetricCardProps) {
  return (
    <Link to={href} className="group">
      <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full overflow-hidden relative">
        <div className={`absolute top-0 left-0 right-0 h-1 ${bg} opacity-60`} />
        <CardContent className="p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${bg} ring-1 ring-border/30`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mb-1" />
          ) : (
            <div className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{value}</div>
          )}
          <p className="text-xs font-medium text-muted-foreground mt-1">{title}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-muted-foreground/70">{description}</p>
            {trend && (
              <span className={`text-[10px] font-medium flex items-center gap-0.5 ${trend.up ? "text-emerald-600" : "text-red-500"}`}>
                <TrendingUp className={`w-3 h-3 ${!trend.up ? "rotate-180" : ""}`} />
                {trend.value}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
