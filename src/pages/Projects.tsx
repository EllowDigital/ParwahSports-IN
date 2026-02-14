import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Calendar, MapPin, Users, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
  year: string | null;
  participants: string | null;
  category: string | null;
  status: string | null;
  is_featured: boolean | null;
}

const statusColors: Record<string, string> = {
  upcoming: "bg-secondary/10 text-secondary border-secondary/30",
  ongoing: "bg-accent/10 text-accent border-accent/30",
  completed: "bg-primary/10 text-primary border-primary/30",
};

const Projects = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
  });

  return (
    <Layout>
      <SEOHead
        title="Sports Projects & Initiatives - Parwah Sports"
        description="Discover sports development projects and community initiatives by Parwah Sports. From grassroots sports to professional athletic programs across India."
        path="/projects"
        keywords="sports projects India, community sports initiatives, athletic programs, grassroots sports, Parwah Sports projects"
      />
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Our Projects
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Events & Initiatives
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From championships to community outreach, explore our diverse range of projects
              designed to nurture sporting talent across India.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Calendar, value: "15+", label: "Events Per Year" },
              { icon: Users, value: "3000+", label: "Participants Annually" },
              { icon: MapPin, value: "10+", label: "Districts Covered" },
              { icon: Trophy, value: "50+", label: "Winners Produced" },
            ].map((stat, index) => (
              <div key={index} className="text-primary-foreground">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-secondary" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects?.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">Check back soon for our upcoming projects!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects?.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                    {project.status && (
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant="outline"
                          className={`${statusColors[project.status.toLowerCase()] || "bg-muted text-muted-foreground"} backdrop-blur-sm capitalize`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    )}
                    {project.category && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-background/90 text-foreground">
                          {project.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4 line-clamp-3">
                      {project.description || "No description available."}
                    </CardDescription>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </span>
                      )}
                      {project.year && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {project.year}
                        </span>
                      )}
                      {project.participants && (
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.participants}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Want to Participate or Sponsor?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get involved in our upcoming events as a participant, volunteer, or sponsor.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/calendar">View Calendar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
