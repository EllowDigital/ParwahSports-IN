import { Link } from "react-router-dom";
import { Medal, Calendar, Users, ArrowRight, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const programs = [
  {
    icon: Medal,
    title: "Athlete Development",
    description:
      "Comprehensive training programs, scholarships, mentorship, and long-term athlete support to nurture champions.",
    color: "primary",
    href: "/what-we-do",
  },
  {
    icon: Calendar,
    title: "Event Organization",
    description:
      "National & international tournaments, championships, exhibition matches, and talent trials across India.",
    color: "secondary",
    href: "/events",
  },
  {
    icon: Users,
    title: "Community Programs",
    description:
      "Grassroots initiatives, youth engagement, and sports-for-development programs in underserved communities.",
    color: "accent",
    href: "/projects",
  },
  {
    icon: Target,
    title: "Talent Identification",
    description:
      "Scout and identify promising athletes from rural areas and provide them pathways to professional sports.",
    color: "primary",
    href: "/what-we-do",
  },
  {
    icon: Lightbulb,
    title: "Sports Education",
    description:
      "Workshops on nutrition, mental health, career guidance, and sports science for holistic athlete growth.",
    color: "secondary",
    href: "/resources",
  },
];

const colorClasses = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

const hoverBorderClasses = {
  primary: "group-hover:border-primary/30",
  secondary: "group-hover:border-secondary/30",
  accent: "group-hover:border-accent/30",
};

export function WhatWeDoSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Our Programs
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground">
              We provide holistic support to athletes through training, events, and community
              engagement to help them reach their full potential.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 self-start lg:self-auto">
            <Link to="/what-we-do">
              View All Programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Link
              key={index}
              to={program.href}
              className={`group relative p-8 rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${hoverBorderClasses[program.color as keyof typeof hoverBorderClasses]} ${
                index === 0 ? "lg:row-span-2" : ""
              }`}
            >
              <div
                className={`w-14 h-14 rounded-xl ${colorClasses[program.color as keyof typeof colorClasses]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <program.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {program.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {program.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <ArrowRight className="h-4 w-4" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-2xl" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
