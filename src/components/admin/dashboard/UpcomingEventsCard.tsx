import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, ArrowRight, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UpcomingEvent {
  id: string;
  title: string;
  event_date: string;
  location: string | null;
  status: string | null;
  is_featured: boolean | null;
}

interface UpcomingEventsCardProps {
  events: UpcomingEvent[];
  isLoading: boolean;
}

export function UpcomingEventsCard({ events, isLoading }: UpcomingEventsCardProps) {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Events
            </CardTitle>
            <CardDescription className="text-xs mt-1">Next scheduled events</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5 mr-1">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="icon"
                className="h-6 w-6"
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="w-3 h-3" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="icon"
                className="h-6 w-6"
                onClick={() => setViewMode("table")}
              >
                <List className="w-3 h-3" />
              </Button>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
              <Link to="/admin/events">View all <ArrowRight className="w-3 h-3" /></Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="w-7 h-7 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming events</p>
          </div>
        ) : viewMode === "card" ? (
          <div className="space-y-2">
            {events.map((event) => (
              <Link
                key={event.id}
                to="/admin/events"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-accent/30 transition-all group"
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0 text-center">
                  <span className="text-[10px] font-medium text-primary uppercase leading-none">
                    {format(new Date(event.event_date), "MMM")}
                  </span>
                  <span className="text-lg font-bold text-primary leading-none mt-0.5">
                    {format(new Date(event.event_date), "dd")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                    {event.is_featured && (
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 shrink-0">Featured</Badge>
                    )}
                  </div>
                  {event.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </p>
                  )}
                </div>
                <Badge
                  variant={event.status === "upcoming" ? "outline" : event.status === "completed" ? "secondary" : "default"}
                  className="text-[10px] shrink-0"
                >
                  {event.status || "upcoming"}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-medium">Event</TableHead>
                  <TableHead className="text-xs font-medium">Date</TableHead>
                  <TableHead className="text-xs font-medium">Location</TableHead>
                  <TableHead className="text-xs font-medium text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className="hover:bg-accent/30">
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                        {event.is_featured && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 shrink-0">★</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.event_date), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-xs text-muted-foreground truncate">
                        {event.location || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 text-center">
                      <Badge
                        variant={event.status === "upcoming" ? "outline" : "secondary"}
                        className="text-[10px]"
                      >
                        {event.status || "upcoming"}
                      </Badge>
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
