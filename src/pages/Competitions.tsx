import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Calendar, Filter, Search, X, Grid, List, Medal, Users } from "lucide-react";
import { format, isPast, isFuture, isToday } from "date-fns";

interface Competition {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  is_participation_open: boolean;
  cover_image_url: string | null;
  created_at: string;
}

export default function Competitions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "upcoming" | "past">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  const { data: competitions, isLoading } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data as Competition[];
    },
  });

  // Filter competitions
  const filteredCompetitions = competitions?.filter((competition) => {
    const matchesSearch =
      !searchQuery ||
      competition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competition.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const eventDate = new Date(competition.event_date);
    let matchesStatus = true;

    if (statusFilter === "open") {
      matchesStatus = competition.is_participation_open;
    } else if (statusFilter === "upcoming") {
      matchesStatus = isFuture(eventDate) || isToday(eventDate);
    } else if (statusFilter === "past") {
      matchesStatus = isPast(eventDate) && !isToday(eventDate);
    }

    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasFilters = searchQuery || statusFilter !== "all";

  const getCompetitionStatus = (competition: Competition) => {
    const eventDate = new Date(competition.event_date);
    if (competition.is_participation_open) {
      return { label: "Registrations Open", variant: "default" as const };
    }
    if (isToday(eventDate)) return { label: "Today", variant: "secondary" as const };
    if (isFuture(eventDate)) return { label: "Upcoming", variant: "outline" as const };
    return { label: "Completed", variant: "outline" as const };
  };

  return (
    <Layout>
      <SEOHead
        title="Sports Competitions & Tournaments - Parwah Sports"
        description="Participate in sports competitions, athletic tournaments, and championship events organized by Parwah Sports. Open registrations for cricket, football, athletics and more."
        path="/competitions"
        keywords="sports competitions India, athletic tournaments, cricket tournament, football competition, youth championship, Parwah Sports competitions"
      />
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Trophy className="h-4 w-4" />
              Competitions
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Sports Competitions
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover upcoming tournaments, championships, and competitive events for athletes.
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
              <span>Filter Competitions</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className="shrink-0"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "open" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("open")}
                  className="shrink-0 gap-1"
                >
                  <Medal className="h-3 w-3" />
                  Open
                </Button>
                <Button
                  variant={statusFilter === "upcoming" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("upcoming")}
                  className="shrink-0"
                >
                  Upcoming
                </Button>
                <Button
                  variant={statusFilter === "past" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("past")}
                  className="shrink-0"
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

      {/* Competitions Grid/List */}
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
          ) : filteredCompetitions && filteredCompetitions.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">{filteredCompetitions.length}</span>{" "}
                  competitions
                </p>
              </div>

              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCompetitions.map((competition) => {
                    const status = getCompetitionStatus(competition);
                    return (
                      <Card
                        key={competition.id}
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={() => setSelectedCompetition(competition)}
                      >
                        <div className="relative">
                          {competition.cover_image_url ? (
                            <img
                              src={competition.cover_image_url}
                              alt={competition.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <Trophy className="h-16 w-16 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-primary text-primary-foreground">
                              {format(new Date(competition.event_date), "MMM d")}
                            </Badge>
                            {competition.is_participation_open && (
                              <Badge className="bg-accent text-accent-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                Open
                              </Badge>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="font-semibold text-lg text-background line-clamp-2">
                              {competition.name}
                            </h3>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(competition.event_date), "MMMM d, yyyy")}
                          </div>
                          {competition.description && (
                            <p className="text-muted-foreground line-clamp-2">
                              {competition.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCompetitions.map((competition) => {
                    const status = getCompetitionStatus(competition);
                    return (
                      <Card
                        key={competition.id}
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedCompetition(competition)}
                      >
                        <div className="flex flex-col md:flex-row">
                          {competition.cover_image_url ? (
                            <div className="md:w-64 lg:w-80 shrink-0">
                              <img
                                src={competition.cover_image_url}
                                alt={competition.name}
                                className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="md:w-64 lg:w-80 shrink-0 h-48 md:h-auto bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                              <Trophy className="h-16 w-16 text-primary/30" />
                            </div>
                          )}
                          <CardContent className="p-6 flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className="bg-primary text-primary-foreground">
                                {format(new Date(competition.event_date), "MMMM d, yyyy")}
                              </Badge>
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
                              {competition.name}
                            </h3>
                            {competition.description && (
                              <p className="text-muted-foreground line-clamp-2">
                                {competition.description}
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
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Competitions Found</h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters
                  ? "Try adjusting your filters"
                  : "Check back soon for upcoming competitions!"}
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

      {/* Competition Detail Dialog */}
      <Dialog open={!!selectedCompetition} onOpenChange={() => setSelectedCompetition(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCompetition && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif pr-8">
                  {selectedCompetition.name}
                </DialogTitle>
              </DialogHeader>
              {selectedCompetition.cover_image_url && (
                <img
                  src={selectedCompetition.cover_image_url}
                  alt={selectedCompetition.name}
                  className="w-full h-64 object-cover rounded-xl"
                />
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-primary text-primary-foreground">
                  {format(new Date(selectedCompetition.event_date), "MMMM d, yyyy")}
                </Badge>
                {selectedCompetition.is_participation_open && (
                  <Badge className="bg-accent text-accent-foreground">Registrations Open</Badge>
                )}
              </div>
              {selectedCompetition.description && (
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {selectedCompetition.description}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
