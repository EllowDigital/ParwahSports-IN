import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  href: string;
  color: string;
  bg: string;
  description: string;
  isLoading: boolean;
}

export function MetricCard({ title, value, icon: Icon, href, color, bg, description, isLoading }: MetricCardProps) {
  return (
    <Link to={href} className="group">
      <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 h-full">
        <CardContent className="p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-20 mb-1" />
          ) : (
            <div className="text-xl lg:text-2xl font-bold text-foreground">{value}</div>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
