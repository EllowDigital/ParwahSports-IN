import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Target,
  Eye,
  Heart,
  Award,
  Shield,
  Users,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  ArrowRight,
  CheckCircle,
  Code,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { WebsiteCredit } from "@/components/layout/Footer";
import trainingImage from "@/assets/training-session.jpg";
import communityImage from "@/assets/community-event.jpg";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  public_email: string | null;
  public_phone: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  display_order: number | null;
}

const values = [
  {
    icon: Award,
    title: "Discipline",
    description: "Building strong character through rigorous training and commitment.",
    color: "bg-primary",
  },
  {
    icon: Shield,
    title: "Fair Play",
    description: "Promoting sportsmanship, integrity, and ethical conduct in all activities.",
    color: "bg-secondary",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description: "Ensuring equal opportunities regardless of background or circumstances.",
    color: "bg-accent",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Striving for the highest standards in everything we do.",
    color: "bg-primary",
  },
];

const milestones = [
  {
    year: "2015",
    title: "Trust Established",
    description:
      "Parwah Sports Charitable Trust was registered with a vision to support young athletes.",
    icon: "🏛️",
  },
  {
    year: "2016",
    title: "First Training Camp",
    description: "Organized our first sports camp with 30 athletes from rural areas.",
    icon: "⛺",
  },
  {
    year: "2018",
    title: "School Partnerships",
    description: "Partnered with 10 schools to establish structured sports programs.",
    icon: "🏫",
  },
  {
    year: "2020",
    title: "National Recognition",
    description: "Athletes trained by us won medals at national-level competitions.",
    icon: "🏅",
  },
  {
    year: "2022",
    title: "Expanded Reach",
    description: "Extended programs to 10+ districts across Uttarakhand.",
    icon: "🗺️",
  },
  {
    year: "2024",
    title: "Digital Initiative",
    description: "Launched online training resources and virtual mentorship programs.",
    icon: "💻",
  },
];

const About = () => {
  const { data: teamMembers, isLoading: isTeamLoading } = useQuery({
    queryKey: ["featured-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select(
          "id,name,role,bio,image_url,public_email,public_phone,linkedin_url,twitter_url,display_order",
        )
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(4);
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
                About Us
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Nurturing Champions, <span className="text-primary">Building Futures</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Parwah Sports Charitable Trust is a non-profit organization dedicated to empowering
                young and underprivileged athletes across India through comprehensive support,
                training, and opportunities.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <ScrollReveal animation="fade-right">
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-card p-8 lg:p-10 rounded-3xl shadow-xl border border-border h-full">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Target className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    To support young and underprivileged athletes emotionally, financially, and
                    professionally. We provide world-class training, mentorship, and resources to
                    help them achieve their full potential and represent India on national and
                    international stages.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Provide world-class training",
                      "Financial assistance",
                      "Mental wellness support",
                      "Career guidance",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* Vision */}
            <ScrollReveal animation="fade-left">
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-card p-8 lg:p-10 rounded-3xl shadow-xl border border-border h-full">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Eye className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    Our Vision
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    To create a world where every talented athlete, regardless of their background,
                    has equal opportunities to shine at district, state, national, and international
                    levels. We envision sports as a powerful tool for social transformation.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Equal opportunities for all",
                      "Sports as social change",
                      "District to international",
                      "Holistic development",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Core Values
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground text-lg">
              Our values guide everything we do, from training athletes to building partnerships.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-card"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-16 h-16 mx-auto ${value.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                A Decade of Transforming Lives Through Sports
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in 2015 by a group of passionate sports enthusiasts and former athletes,
                Parwah Sports Charitable Trust began with a simple vision: no talented athlete
                should be left behind due to lack of resources.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                What started as a small initiative has now grown into a comprehensive support system
                reaching over 10 districts across Uttarakhand and neighboring states. We have
                trained more than 150 athletes, many of whom have gone on to compete at national and
                international levels.
              </p>
              <Button asChild className="gap-2">
                <Link to="/what-we-do">
                  Learn More About Our Programs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src={trainingImage}
                  alt="Training session"
                  className="rounded-2xl shadow-lg h-40 lg:h-56 object-cover w-full"
                />
                <div className="bg-secondary text-secondary-foreground p-6 rounded-2xl">
                  <div className="text-3xl font-bold">150+</div>
                  <div className="text-sm opacity-80">Athletes Trained</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-primary text-primary-foreground p-6 rounded-2xl">
                  <div className="text-3xl font-bold">9+</div>
                  <div className="text-sm opacity-80">Years of Impact</div>
                </div>
                <img
                  src={communityImage}
                  alt="Community event"
                  className="rounded-2xl shadow-lg h-40 lg:h-56 object-cover w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Milestones Along the Way
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="group relative bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    {milestone.icon}
                  </div>
                  <div className="pt-6">
                    <span className="text-sm font-bold text-secondary">{milestone.year}</span>
                    <h3 className="font-semibold text-lg text-foreground mt-1 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                Our Team
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Meet the People Behind Our Mission
              </h2>
            </div>
            <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
              <Link to="/team">
                View Full Team <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isTeamLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <Card
                  key={member.id}
                  className="group text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Users className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex gap-3">
                        {member.public_email && (
                          <a
                            href={`mailto:${member.public_email}`}
                            className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                          >
                            <Mail className="h-5 w-5" />
                          </a>
                        )}
                        {member.public_phone && (
                          <a
                            href={`tel:${member.public_phone}`}
                            className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                          >
                            <Phone className="h-5 w-5" />
                          </a>
                        )}
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.twitter_url && (
                          <a
                            href={member.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                          >
                            <Twitter className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                    <p className="text-secondary font-medium text-sm">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Team Coming Soon</h3>
              <p className="text-muted-foreground">Check back soon to meet our amazing team!</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-accent-foreground" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Trust & Transparency
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">
                Parwah Sports Charitable Trust is a registered charitable trust operating under the
                Indian Trusts Act. We maintain complete transparency in our operations, finances,
                and impact.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-2xl shadow-lg text-center border border-border hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground text-lg">Registration</p>
                <p className="text-sm text-muted-foreground">Registered Trust (2015)</p>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-lg text-center border border-border hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 mx-auto bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <p className="font-semibold text-foreground text-lg">Tax Exemption</p>
                <p className="text-sm text-muted-foreground">80G Certified</p>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-lg text-center border border-border hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 mx-auto bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
                <p className="font-semibold text-foreground text-lg">Annual Reports</p>
                <p className="text-sm text-muted-foreground">Publicly Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
              Join us in our mission to empower young athletes. Whether through donations,
              volunteering, or partnerships, every contribution counts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <Link to="/donate">
                  <Heart className="h-5 w-5" />
                  Donate Now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2"
              >
                <Link to="/volunteer">
                  <Users className="h-5 w-5" />
                  Become a Volunteer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Website Credits Section */}
      <section className="py-8 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Code className="h-4 w-4" />
                <span className="text-sm">Website Credits:</span>
              </div>
              <WebsiteCredit />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default About;
