import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Calendar as CalendarIcon, MapPin, Clock, Filter } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isFuture, isPast, isToday } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  status: string | null;
}

const eventTypes = ["All", "Upcoming", "Past"];

const Calendar = () => {
  const [selectedType, setSelectedType] = useState("All");

  const { data: events, isLoading } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data as Event[];
    },
  });

  const filteredEvents =
    events?.filter((event) => {
      const eventDate = new Date(event.event_date);
      if (selectedType === "Upcoming") {
        return isFuture(eventDate) || isToday(eventDate);
      }
      if (selectedType === "Past") {
        return isPast(eventDate) && !isToday(eventDate);
      }
      return true;
    }) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEE, MMM d, yyyy");
  };

  const getEventStatus = (dateString: string) => {
    const eventDate = new Date(dateString);
    if (isToday(eventDate)) return "Today";
    if (isFuture(eventDate)) return "Upcoming";
    return "Completed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Today":
        return "bg-secondary text-secondary-foreground";
      case "Upcoming":
        return "bg-primary/10 text-primary border-primary/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Event Calendar
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Upcoming Events & Activities
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stay updated with our competitions, training camps, workshops, and community events.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-16 lg:top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <Filter className="h-4 w-4" />
              Filter:
            </div>
            {eventTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="h-24 w-24 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </Card>
              ))
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Events Found</h3>
                <p className="text-muted-foreground">
                  {selectedType === "Upcoming"
                    ? "Stay tuned for upcoming events!"
                    : selectedType === "Past"
                      ? "No past events to show."
                      : "No events available yet."}
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const status = getEventStatus(event.event_date);
                return (
                  <Card
                    key={event.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Date Badge */}
                      <div className="bg-primary text-primary-foreground p-6 flex flex-col items-center justify-center md:w-32 shrink-0">
                        <CalendarIcon className="h-6 w-6 mb-2" />
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {new Date(event.event_date).getDate()}
                          </div>
                          <div className="text-sm opacity-80">
                            {format(new Date(event.event_date), "MMM")}
                          </div>
                          <div className="text-xs opacity-70">
                            {format(new Date(event.event_date), "yyyy")}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <Badge variant="outline" className={getStatusColor(status)}>
                            {status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(event.event_date)}
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                        {event.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {event.start_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.start_time}
                              {event.end_time && ` - ${event.end_time}`}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Never Miss an Event
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter to receive updates about upcoming events and activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Calendar;
