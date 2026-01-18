import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format, isPast, isToday, isFuture } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  image_url: string | null;
  status: string | null;
  is_featured: boolean | null;
}

export default function Events() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data as Event[];
    },
  });

  const upcomingEvents = events?.filter((e) => isFuture(new Date(e.event_date)) || isToday(new Date(e.event_date))) || [];
  const pastEvents = events?.filter((e) => isPast(new Date(e.event_date)) && !isToday(new Date(e.event_date)))?.reverse() || [];

  const EventCard = ({ event }: { event: Event }) => {
    const eventDate = new Date(event.event_date);
    const isUpcoming = isFuture(eventDate) || isToday(eventDate);

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        {event.image_url ? (
          <div className="aspect-video overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-primary/40" />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
            {isUpcoming && (
              <Badge variant="default" className="shrink-0">
                Upcoming
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              {format(eventDate, "MMMM d, yyyy")}
            </span>
            {event.start_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {event.start_time}
                {event.end_time && ` - ${event.end_time}`}
              </span>
            )}
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          {event.description && (
            <p className="text-muted-foreground line-clamp-3">{event.description}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              What's Happening
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Events
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us at our upcoming events and be part of our community
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-video w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events?.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Events Yet</h3>
              <p className="text-muted-foreground">Check back soon for upcoming events!</p>
            </div>
          ) : (
            <Tabs defaultValue="upcoming" className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="upcoming" className="gap-2">
                    Upcoming
                    {upcomingEvents.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {upcomingEvents.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="past" className="gap-2">
                    Past Events
                    {pastEvents.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {pastEvents.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Upcoming Events
                    </h3>
                    <p className="text-muted-foreground">Stay tuned for future events!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {pastEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Past Events</h3>
                    <p className="text-muted-foreground">Events will appear here after they occur.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
}
