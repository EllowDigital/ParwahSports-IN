import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Clock, Filter, Search, X, CalendarDays, Grid, List } from "lucide-react";
import { format, isFuture, isPast, isToday, differenceInDays } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
}

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "past">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: events, isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data as Event[];
    },
  });

  // Filter events
  const filteredEvents = events?.filter((event) => {
    const matchesSearch =
      !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const eventDate = new Date(event.event_date);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "upcoming" && (isFuture(eventDate) || isToday(eventDate))) ||
      (statusFilter === "past" && isPast(eventDate) && !isToday(eventDate));

    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasFilters = searchQuery || statusFilter !== "all";

  const getDaysUntil = (dateStr: string) => {
    const days = differenceInDays(new Date(dateStr), new Date());
    if (days < 0) return "Past";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  const getEventStatus = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    if (isToday(eventDate)) return { label: "Today", variant: "default" as const };
    if (isFuture(eventDate)) return { label: "Upcoming", variant: "secondary" as const };
    return { label: "Past", variant: "outline" as const };
  };

  // Generate Event JSON-LD for rich results
  const eventsJsonLd = events?.filter(e => isFuture(new Date(e.event_date)) || isToday(new Date(e.event_date))).map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || `Sports event organized by Parwah Sports Charitable Trust`,
    startDate: event.event_date,
    ...(event.end_time && { endDate: event.event_date }),
    ...(event.location && {
      location: {
        "@type": "Place",
        name: event.location,
        address: { "@type": "PostalAddress", addressCountry: "IN" },
      },
    }),
    organizer: {
      "@type": "Organization",
      name: "Parwah Sports Charitable Trust",
      url: "https://parwahsports.com",
    },
    ...(event.image_url && { image: event.image_url }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  })) || [];

  return (
    <Layout>
      <SEOHead
        title="Sports Events & Tournaments - Parwah Sports"
        description="Discover upcoming sports events, tournaments, athletic meets, and training camps organized by Parwah Sports Charitable Trust. Register and participate today."
        path="/events"
        keywords="sports events India, tournaments, athletic meets, training camps, youth sports events, Parwah Sports events"
        jsonLd={eventsJsonLd.length > 0 ? eventsJsonLd : undefined}
      />
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CalendarDays className="h-4 w-4" />
              Events
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Events & Activities
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join us at our sports camps, tournaments, workshops, and community events.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-background border-b border-border sticky top-16 lg:top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter Events</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "upcoming" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("upcoming")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={statusFilter === "past" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("past")}
                >
                  Past
                </Button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Clear Filters */}
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid/List */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div
              className={
                viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"
              }
            >
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">{filteredEvents.length}</span>{" "}
                  events
                </p>
              </div>

              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => {
                    const status = getEventStatus(event.event_date);
                    return (
                      <Card
                        key={event.id}
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative">
                          {event.image_url ? (
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <CalendarDays className="h-16 w-16 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-primary text-primary-foreground">
                              {format(new Date(event.event_date), "MMM d")}
                            </Badge>
                            <Badge variant={status.variant}>{getDaysUntil(event.event_date)}</Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="font-semibold text-lg text-background line-clamp-2">
                              {event.title}
                            </h3>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {event.location && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0" />
                                {event.location}
                              </p>
                            )}
                            {event.start_time && (
                              <p className="flex items-center gap-2">
                                <Clock className="h-4 w-4 shrink-0" />
                                {event.start_time}
                                {event.end_time && ` - ${event.end_time}`}
                              </p>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-muted-foreground line-clamp-2 mt-4">
                              {event.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event) => {
                    const status = getEventStatus(event.event_date);
                    return (
                      <Card
                        key={event.id}
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row">
                          {event.image_url ? (
                            <div className="md:w-64 lg:w-80 shrink-0">
                              <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="md:w-64 lg:w-80 shrink-0 h-48 md:h-auto bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                              <CalendarDays className="h-16 w-16 text-primary/30" />
                            </div>
                          )}
                          <CardContent className="p-6 flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className="bg-primary text-primary-foreground">
                                {format(new Date(event.event_date), "MMMM d, yyyy")}
                              </Badge>
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
                              {event.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </span>
                              )}
                              {event.start_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {event.start_time}
                                  {event.end_time && ` - ${event.end_time}`}
                                </span>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-muted-foreground line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </CardContent>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters ? "Try adjusting your filters" : "Check back soon for upcoming events!"}
              </p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
