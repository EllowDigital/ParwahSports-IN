import { Link } from "react-router-dom";
import { Medal, Calendar, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const programs = [
  {
    icon: Medal,
    title: "Athlete Development",
    description:
      "Comprehensive training programs, scholarships, mentorship, and long-term athlete support to nurture champions.",
    color: "bg-primary",
  },
  {
    icon: Calendar,
    title: "Event Organization",
    description:
      "National & international tournaments, championships, exhibition matches, and talent trials across India.",
    color: "bg-secondary",
  },
  {
    icon: Users,
    title: "Community Programs",
    description:
      "Grassroots initiatives, youth engagement, and sports-for-development programs in underserved communities.",
    color: "bg-accent",
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Our Programs
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What We Do
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide holistic support to athletes through training, events, and community
            engagement.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div
                  className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <program.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold">{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {program.description}
                </CardDescription>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/what-we-do">
              Learn More About Our Work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
