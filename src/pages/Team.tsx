import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Mail, Linkedin, Phone, Twitter, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

const Team = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select(
          "id,name,role,bio,image_url,public_email,public_phone,linkedin_url,twitter_url,display_order,is_active",
        )
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  // Group team members by role category
  const groupMembers = (members: TeamMember[]) => {
    const categories: { title: string; roles: string[]; members: TeamMember[] }[] = [
      {
        title: "Executive Committee",
        roles: [
          "Chairman",
          "Vice Chairperson",
          "Secretary",
          "Treasurer",
          "President",
          "Vice President",
        ],
        members: [],
      },
      { title: "Board Members", roles: ["Board Member", "Director", "Advisor"], members: [] },
      {
        title: "Coaching & Development",
        roles: ["Head Coach", "Coach", "Trainer", "Youth Coordinator", "Fitness Trainer"],
        members: [],
      },
      {
        title: "Medical & Support",
        roles: ["Sports Physician", "Physiotherapist", "Nutritionist", "Doctor"],
        members: [],
      },
      { title: "Team Members", roles: [], members: [] },
    ];

    members.forEach((member) => {
      let placed = false;
      for (const category of categories.slice(0, -1)) {
        if (category.roles.some((role) => member.role.toLowerCase().includes(role.toLowerCase()))) {
          category.members.push(member);
          placed = true;
          break;
        }
      }
      if (!placed) {
        categories[categories.length - 1].members.push(member);
      }
    });

    return categories.filter((cat) => cat.members.length > 0);
  };

  const groupedMembers = teamMembers ? groupMembers(teamMembers) : [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Our Team
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet the People Behind Our Mission
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our dedicated team of professionals, coaches, and volunteers work tirelessly to
              support athletes across India.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      {isLoading ? (
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <Skeleton className="h-8 w-48 mx-auto mb-12" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto mb-3" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : teamMembers?.length === 0 ? (
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Team Coming Soon</h3>
              <p className="text-muted-foreground">Check back soon to meet our amazing team!</p>
            </div>
          </div>
        </section>
      ) : (
        groupedMembers.map((category, categoryIndex) => (
          <section
            key={categoryIndex}
            className={`py-16 lg:py-20 ${categoryIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
          >
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
                {category.title}
              </h2>
              <div
                className={`grid gap-8 ${
                  category.members.length === 2
                    ? "md:grid-cols-2 max-w-2xl mx-auto"
                    : category.members.length === 3
                      ? "md:grid-cols-3 max-w-4xl mx-auto"
                      : "md:grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {category.members.map((member) => (
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
                      <p className="text-secondary font-medium text-sm mb-3">{member.role}</p>
                      {member.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))
      )}

      {/* Join Team CTA */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Join Our Team</h2>
            <p className="text-lg opacity-80 mb-8">
              We're always looking for passionate individuals to join our mission. Whether as a
              coach, volunteer, or professional, there's a place for you.
            </p>
            <a
              href="/volunteer"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Explore Opportunities
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
