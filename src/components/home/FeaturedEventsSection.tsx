import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Calendar, ArrowRight, MapPin, Clock } from "lucide-react";
import { format, isFuture, isToday, differenceInDays } from "date-fns";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  start_time: string | null;
}

export function FeaturedEventsSection() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .or(`is_featured.eq.true,event_date.gte.${new Date().toISOString().split("T")[0]}`)
        .order("event_date", { ascending: true })
        .limit(4);
      if (error) throw error;
      return data as Event[];
    },
  });

  const upcomingEvents = events?.filter(
    (e) => isFuture(new Date(e.event_date)) || isToday(new Date(e.event_date))
  ).slice(0, 4) || [];

  const getDaysUntil = (dateStr: string) => {
    const days = differenceInDays(new Date(dateStr), new Date());
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Skeleton className="h-4 w-28 mb-3" />
              <Skeleton className="h-8 w-56" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-44 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                Upcoming Events
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Join Us
              </h2>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
              <Link to="/events">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {upcomingEvents.map((event, index) => (
            <ScrollReveal key={event.id} delay={index * 80}>
              <Card className={`overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full ${
                index === 0 ? "sm:col-span-2 lg:col-span-2 sm:row-span-2 lg:row-span-1" : ""
              }`}>
                <div className="relative h-full">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        index === 0 ? "h-52 sm:h-64" : "h-44"
                      }`}
                    />
                  ) : (
                    <div className={`w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center ${
                      index === 0 ? "h-52 sm:h-64" : "h-44"
                    }`}>
                      <Calendar className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      {format(new Date(event.event_date), "MMM d")}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground text-xs">
                      {getDaysUntil(event.event_date)}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className={`font-semibold text-background mb-1 line-clamp-2 ${
                      index === 0 ? "text-lg sm:text-xl" : "text-base"
                    }`}>
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-background/80 text-xs">
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                      {event.start_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.start_time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
