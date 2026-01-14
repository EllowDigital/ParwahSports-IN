import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar as CalendarIcon, MapPin, Users, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    title: "Inter-School Taekwondo Championship",
    date: "2024-03-15",
    time: "9:00 AM - 6:00 PM",
    location: "Sports Complex, Dehradun",
    type: "Competition",
    participants: "500+ Athletes",
    description: "Annual championship featuring schools from across Uttarakhand.",
  },
  {
    id: 2,
    title: "Summer Training Camp",
    date: "2024-04-01",
    time: "6:00 AM - 12:00 PM",
    location: "Rishikesh Training Center",
    type: "Training Camp",
    participants: "120 Athletes",
    description: "30-day intensive training program for selected athletes.",
  },
  {
    id: 3,
    title: "Talent Identification Trial",
    date: "2024-04-20",
    time: "8:00 AM - 4:00 PM",
    location: "Various Districts",
    type: "Talent Trial",
    participants: "Open Registration",
    description: "Scouting event to identify promising young athletes.",
  },
  {
    id: 4,
    title: "Sports Science Workshop",
    date: "2024-05-05",
    time: "10:00 AM - 4:00 PM",
    location: "Online",
    type: "Workshop",
    participants: "Coaches & Athletes",
    description: "Expert-led workshop on sports nutrition and recovery.",
  },
  {
    id: 5,
    title: "District Level Competition",
    date: "2024-05-15",
    time: "9:00 AM - 5:00 PM",
    location: "Haridwar Stadium",
    type: "Competition",
    participants: "300+ Athletes",
    description: "District championship qualifying event.",
  },
  {
    id: 6,
    title: "Community Fitness Drive",
    date: "2024-06-01",
    time: "6:00 AM - 9:00 AM",
    location: "Rajpur Road, Dehradun",
    type: "Community Event",
    participants: "Open to Public",
    description: "Free fitness activities and health awareness program.",
  },
  {
    id: 7,
    title: "Coaching Certification Program",
    date: "2024-06-15",
    time: "9:00 AM - 5:00 PM",
    location: "PSCT Training Center",
    type: "Training Camp",
    participants: "Aspiring Coaches",
    description: "5-day certification course for sports coaches.",
  },
  {
    id: 8,
    title: "State Championship Preparation Camp",
    date: "2024-07-01",
    time: "6:00 AM - 6:00 PM",
    location: "Dehradun",
    type: "Training Camp",
    participants: "Selected Athletes",
    description: "Pre-competition training for state qualifiers.",
  },
];

const eventTypes = [
  "All",
  "Competition",
  "Training Camp",
  "Workshop",
  "Talent Trial",
  "Community Event",
];

const typeColors: Record<string, string> = {
  Competition: "bg-secondary/10 text-secondary border-secondary/30",
  "Training Camp": "bg-primary/10 text-primary border-primary/30",
  Workshop: "bg-accent/10 text-accent border-accent/30",
  "Talent Trial": "bg-chart-4/20 text-chart-4 border-chart-4/30",
  "Community Event": "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

const Calendar = () => {
  const [selectedType, setSelectedType] = useState("All");

  const filteredEvents =
    selectedType === "All" ? events : events.filter((event) => event.type === selectedType);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
                className={selectedType === type ? "bg-primary text-primary-foreground" : ""}
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
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Date Badge */}
                  <div className="bg-primary text-primary-foreground p-6 flex flex-col items-center justify-center md:w-32 shrink-0">
                    <CalendarIcon className="h-6 w-6 mb-2" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{new Date(event.date).getDate()}</div>
                      <div className="text-sm opacity-80">
                        {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="outline" className={typeColors[event.type]}>
                        {event.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.participants}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No events found for the selected category.
              </div>
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
