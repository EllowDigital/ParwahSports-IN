import { Link } from "react-router-dom";
import { Medal, Calendar, Users, ArrowRight, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const programs = [
  {
    icon: Medal,
    title: "Athlete Development",
    description: "Comprehensive training, scholarships, and mentorship to nurture champions.",
    color: "primary" as const,
    href: "/what-we-do",
  },
  {
    icon: Calendar,
    title: "Event Organization",
    description: "National tournaments, championships, and talent trials across India.",
    color: "secondary" as const,
    href: "/events",
  },
  {
    icon: Users,
    title: "Community Programs",
    description: "Grassroots initiatives and sports development in underserved areas.",
    color: "primary" as const,
    href: "/projects",
  },
  {
    icon: Target,
    title: "Talent Identification",
    description: "Scouting and supporting promising athletes from rural areas.",
    color: "secondary" as const,
    href: "/what-we-do",
  },
  {
    icon: Lightbulb,
    title: "Sports Education",
    description: "Workshops on nutrition, mental health, and sports science.",
    color: "primary" as const,
    href: "/resources",
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
            <div className="max-w-xl">
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                Our Programs
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                What We Do
              </h2>
              <p className="text-muted-foreground">
                Holistic support to athletes through training, events, and community engagement.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2 self-start lg:self-auto">
              <Link to="/what-we-do">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        {/* Programs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {programs.map((program, index) => (
            <ScrollReveal key={index} delay={index * 80}>
              <Link
                to={program.href}
                className={`group relative p-6 lg:p-8 rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-${program.color}/30 block h-full ${
                  index === 0 ? "lg:row-span-2" : ""
                }`}
              >
                <div
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${
                    program.color === "primary"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <program.icon className="h-6 w-6 lg:h-7 lg:w-7" />
                </div>

                <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {program.title}
                </h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  {program.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight className="h-4 w-4" />
                </div>

                {/* Hover accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${
                    program.color === "primary" ? "bg-primary" : "bg-secondary"
                  }`}
                />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
