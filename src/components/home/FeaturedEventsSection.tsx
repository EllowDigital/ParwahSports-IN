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

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) {
    return null;
  }

  const getDaysUntil = (dateStr: string) => {
    const days = differenceInDays(new Date(dateStr), new Date());
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                Upcoming Events
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Join Us at Our Events
              </h2>
            </div>
            <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
              <Link to="/events">
                View All Events <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingEvents.map((event, index) => (
            <ScrollReveal key={event.id} delay={index * 100}>
              <Card
                className={`overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className="relative h-full">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        index === 0 ? "h-64 md:h-80" : "h-48"
                      }`}
                    />
                  ) : (
                    <div className={`w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${
                      index === 0 ? "h-64 md:h-80" : "h-48"
                    }`}>
                      <Calendar className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground">
                      {format(new Date(event.event_date), "MMM d")}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground">
                      {getDaysUntil(event.event_date)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className={`font-semibold text-background mb-2 line-clamp-2 ${
                      index === 0 ? "text-2xl" : "text-lg"
                    }`}>
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-background/80">
                      {event.location && (
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      )}
                      {event.start_time && (
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
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
