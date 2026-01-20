import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Calendar, Users } from "lucide-react";
import { format, isPast } from "date-fns";

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

  const upcomingCompetitions = competitions?.filter(
    (c) => !isPast(new Date(c.event_date))
  ) || [];
  
  const pastCompetitions = competitions?.filter(
    (c) => isPast(new Date(c.event_date))
  ) || [];

  const CompetitionCard = ({ competition }: { competition: Competition }) => {
    const isUpcoming = !isPast(new Date(competition.event_date));
    
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {competition.cover_image_url ? (
          <div className="h-48 overflow-hidden">
            <img
              src={competition.cover_image_url}
              alt={competition.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Trophy className="w-16 h-16 text-primary/50" />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{competition.name}</CardTitle>
            <Badge variant={isUpcoming ? "default" : "secondary"}>
              {isUpcoming ? "Upcoming" : "Past"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {format(new Date(competition.event_date), "MMMM d, yyyy")}
          </div>
          {competition.is_participation_open && isUpcoming && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Users className="w-4 h-4" />
              Registrations Open
            </div>
          )}
          {competition.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {competition.description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Competitions
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our sports competitions and tournaments. Join us to showcase your talent and compete with the best.
            </p>
          </div>
        </div>
      </section>

      {/* Competitions List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : competitions?.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No Competitions Yet
              </h2>
              <p className="text-muted-foreground">
                Check back soon for upcoming competitions and tournaments.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Upcoming Competitions */}
              {upcomingCompetitions.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    Upcoming Competitions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingCompetitions.map((competition) => (
                      <CompetitionCard key={competition.id} competition={competition} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Competitions */}
              {pastCompetitions.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Past Competitions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastCompetitions.map((competition) => (
                      <CompetitionCard key={competition.id} competition={competition} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
