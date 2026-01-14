import { Layout } from "@/components/layout/Layout";
import { Mail, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const teamCategories = [
  {
    title: "Executive Committee",
    members: [
      {
        name: "Dr. Rajesh Kumar",
        role: "Chairman",
        bio: "Former national-level athlete with 25+ years of experience in sports administration.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      },
      {
        name: "Mrs. Sunita Sharma",
        role: "Vice Chairperson",
        bio: "Sports educator and advocate for women in sports with extensive NGO experience.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      },
      {
        name: "Mr. Vikram Singh",
        role: "Secretary",
        bio: "Certified sports coach and program management expert.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      },
      {
        name: "Ms. Priya Nair",
        role: "Treasurer",
        bio: "Chartered accountant with expertise in non-profit financial management.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      },
    ],
  },
  {
    title: "Board Members",
    members: [
      {
        name: "Mr. Arun Gupta",
        role: "Board Member",
        bio: "Entrepreneur and sports enthusiast supporting grassroots development.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      },
      {
        name: "Dr. Meera Patel",
        role: "Board Member",
        bio: "Sports medicine specialist and wellness consultant.",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
      },
      {
        name: "Mr. Suresh Rawat",
        role: "Board Member",
        bio: "Former government official with expertise in sports policy.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      },
    ],
  },
  {
    title: "Youth Development Team",
    members: [
      {
        name: "Coach Amit Thapa",
        role: "Head Coach",
        bio: "National-level Taekwondo coach with international training certifications.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      },
      {
        name: "Ms. Neha Bisht",
        role: "Youth Coordinator",
        bio: "Sports management graduate passionate about youth development.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      },
      {
        name: "Mr. Rohit Negi",
        role: "Fitness Trainer",
        bio: "Certified strength and conditioning specialist for young athletes.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      },
    ],
  },
  {
    title: "Medical & Technical Team",
    members: [
      {
        name: "Dr. Kavita Joshi",
        role: "Sports Physician",
        bio: "Specialized in sports injuries and athlete rehabilitation.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      },
      {
        name: "Mr. Deepak Sharma",
        role: "Physiotherapist",
        bio: "Expert in sports physiotherapy and injury prevention.",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
      },
    ],
  },
];

const Team = () => {
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
              Our dedicated team of professionals, coaches, and volunteers work tirelessly 
              to support athletes across India.
            </p>
          </div>
        </div>
      </section>

      {/* Team Categories */}
      {teamCategories.map((category, categoryIndex) => (
        <section
          key={categoryIndex}
          className={`py-16 lg:py-20 ${categoryIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              {category.title}
            </h2>
            <div className={`grid gap-8 ${
              category.members.length === 2 
                ? "md:grid-cols-2 max-w-2xl mx-auto" 
                : category.members.length === 3 
                  ? "md:grid-cols-3 max-w-4xl mx-auto"
                  : "md:grid-cols-2 lg:grid-cols-4"
            }`}>
              {category.members.map((member, memberIndex) => (
                <Card
                  key={memberIndex}
                  className="group text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex gap-3">
                        <a
                          href="#"
                          className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                        <a
                          href="#"
                          className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                    <p className="text-secondary font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Join Team CTA */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Join Our Team
            </h2>
            <p className="text-lg opacity-80 mb-8">
              We're always looking for passionate individuals to join our mission. 
              Whether as a coach, volunteer, or professional, there's a place for you.
            </p>
            <a
              href="/get-involved"
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
