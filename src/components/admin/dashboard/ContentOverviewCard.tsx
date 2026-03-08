import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContentStat {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  color: string;
  bg: string;
}

interface ContentOverviewCardProps {
  contentCards: ContentStat[];
  isLoading: boolean;
}

export function ContentOverviewCard({ contentCards, isLoading }: ContentOverviewCardProps) {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Content Overview
            </CardTitle>
            <CardDescription className="text-xs mt-1">All your managed content at a glance</CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("table")}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "card" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {contentCards.map((stat) => (
              <Link key={stat.title} to={stat.href} className="group">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-accent/30 transition-all">
                  <div className={`p-1.5 rounded-lg ${stat.bg} shrink-0`}>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    {isLoading ? (
                      <Skeleton className="h-5 w-8" />
                    ) : (
                      <div className="text-lg font-bold text-foreground leading-none">{stat.value}</div>
                    )}
                    <p className="text-[10px] text-muted-foreground truncate">{stat.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-medium">Content</TableHead>
                  <TableHead className="text-xs font-medium text-right">Count</TableHead>
                  <TableHead className="text-xs font-medium text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentCards.map((stat) => (
                  <TableRow key={stat.title} className="hover:bg-accent/30">
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${stat.bg} shrink-0`}>
                          <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{stat.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 text-right">
                      {isLoading ? (
                        <Skeleton className="h-5 w-8 ml-auto" />
                      ) : (
                        <span className="text-sm font-bold text-foreground">{stat.value}</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 text-right">
                      <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
                        <Link to={stat.href}>Manage →</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
