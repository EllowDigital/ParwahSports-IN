import { Layout } from "@/components/layout/Layout";
import { Calendar, MapPin, Users, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import communityImage from "@/assets/community-event.jpg";
import trainingImage from "@/assets/training-session.jpg";
import victoryImage from "@/assets/victory-moment.jpg";
import heroImage from "@/assets/hero-athletes.jpg";

const projects = [
  {
    title: "Inter-School Taekwondo Championship 2024",
    description: "Annual championship bringing together schools from across Uttarakhand for competitive martial arts events.",
    image: communityImage,
    location: "Dehradun, Uttarakhand",
    year: "2024",
    participants: "500+",
    category: "Championship",
    status: "Upcoming",
  },
  {
    title: "Summer Sports Camp",
    description: "Intensive 30-day training camp for talented young athletes covering multiple sports disciplines.",
    image: trainingImage,
    location: "Rishikesh",
    year: "2024",
    participants: "120",
    category: "Training Camp",
    status: "Completed",
  },
  {
    title: "State-Level Talent Trials",
    description: "Talent identification program to scout promising athletes from rural and underserved areas.",
    image: heroImage,
    location: "Multiple Districts",
    year: "2024",
    participants: "800+",
    category: "Talent Trial",
    status: "Ongoing",
  },
  {
    title: "National Sports Day Celebration",
    description: "Community event celebrating sports with exhibitions, workshops, and awareness programs.",
    image: victoryImage,
    location: "Haridwar",
    year: "2023",
    participants: "1000+",
    category: "Community Event",
    status: "Completed",
  },
  {
    title: "Youth Fitness Workshop Series",
    description: "Monthly workshops teaching fitness fundamentals, nutrition, and healthy lifestyle habits to youth.",
    image: trainingImage,
    location: "Dehradun Schools",
    year: "2024",
    participants: "300+",
    category: "Workshop",
    status: "Ongoing",
  },
  {
    title: "Rural Sports Outreach Program",
    description: "Taking sports equipment and training to remote villages to promote sports participation.",
    image: communityImage,
    location: "Tehri, Pauri, Chamoli",
    year: "2024",
    participants: "450+",
    category: "Outreach",
    status: "Ongoing",
  },
];

const statusColors = {
  "Upcoming": "bg-secondary/10 text-secondary border-secondary/30",
  "Ongoing": "bg-accent/10 text-accent border-accent/30",
  "Completed": "bg-primary/10 text-primary border-primary/30",
};

const Projects = () => {
  return (
    <Layout>
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
              From championships to community outreach, explore our diverse range of 
              projects designed to nurture sporting talent across India.
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className={`${statusColors[project.status as keyof typeof statusColors]} backdrop-blur-sm`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4 line-clamp-3">
                    {project.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.participants}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/calendar">
                  View Calendar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
