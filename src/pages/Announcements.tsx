import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Calendar, Filter, X, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "normal" | "important" | "urgent";
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const priorityConfig = {
  urgent: {
    icon: AlertTriangle,
    bg: "bg-destructive",
    text: "text-destructive-foreground",
    badge: "bg-destructive text-destructive-foreground",
    border: "border-l-destructive",
  },
  important: {
    icon: AlertCircle,
    bg: "bg-primary",
    text: "text-primary-foreground",
    badge: "bg-primary text-primary-foreground",
    border: "border-l-primary",
  },
  normal: {
    icon: Info,
    bg: "bg-secondary",
    text: "text-secondary-foreground",
    badge: "bg-secondary text-secondary-foreground",
    border: "border-l-secondary",
  },
};

export default function Announcements() {
  const [priorityFilter, setPriorityFilter] = useState<"all" | "urgent" | "important" | "normal">(
    "all",
  );

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["public-announcements"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .or(`start_date.is.null,start_date.lte.${today}`)
        .or(`end_date.is.null,end_date.gte.${today}`)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Announcement[];
    },
  });

  // Filter announcements
  const filteredAnnouncements = announcements?.filter((announcement) => {
    return priorityFilter === "all" || announcement.priority === priorityFilter;
  });

  const clearFilters = () => {
    setPriorityFilter("all");
  };

  const hasFilters = priorityFilter !== "all";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Megaphone className="h-4 w-4" />
              Announcements
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Important Announcements
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stay informed about important updates, notices, and announcements from Parwah Sports.
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
              <span>Filter by Priority</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <Button
                  variant={priorityFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={priorityFilter === "urgent" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter("urgent")}
                  className="gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Urgent
                </Button>
                <Button
                  variant={priorityFilter === "important" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter("important")}
                  className="gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  Important
                </Button>
                <Button
                  variant={priorityFilter === "normal" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter("normal")}
                  className="gap-1"
                >
                  <Info className="h-3 w-3" />
                  Normal
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

      {/* Announcements List */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAnnouncements && filteredAnnouncements.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                <p className="text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredAnnouncements.length}
                  </span>{" "}
                  announcements
                </p>
              </div>
              <div className="space-y-6 max-w-4xl mx-auto">
                {filteredAnnouncements.map((announcement) => {
                  const config = priorityConfig[announcement.priority];
                  const Icon = config.icon;
                  return (
                    <Card
                      key={announcement.id}
                      className={`overflow-hidden border-l-4 ${config.border} hover:shadow-lg transition-shadow`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}
                          >
                            <Icon className={`h-6 w-6 ${config.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className={config.badge}>
                                {announcement.priority.charAt(0).toUpperCase() +
                                  announcement.priority.slice(1)}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(announcement.created_at), "MMM d, yyyy")}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              {announcement.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {announcement.message}
                            </p>
                            {(announcement.start_date || announcement.end_date) && (
                              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {announcement.start_date && (
                                  <span>
                                    <strong>From:</strong>{" "}
                                    {format(new Date(announcement.start_date), "MMM d, yyyy")}
                                  </span>
                                )}
                                {announcement.end_date && (
                                  <span>
                                    <strong>Until:</strong>{" "}
                                    {format(new Date(announcement.end_date), "MMM d, yyyy")}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Megaphone className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Announcements</h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters ? "Try adjusting your filters" : "No announcements at the moment."}
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
