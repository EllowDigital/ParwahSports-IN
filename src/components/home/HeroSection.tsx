import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-athletes.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Indian athletes training together at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Trophy className="h-4 w-4" />
            Empowering Athletes Since 2015
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Empowering Athletes.{" "}
            <span className="text-secondary">Transforming Dreams</span> into Champions.
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-background/80 leading-relaxed mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            We support young and underprivileged athletes across India with world-class training, 
            financial assistance, and mentorship to help them shine on the national and international stage.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 text-base px-8">
              <Link to="/get-involved">
                <Heart className="h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10 gap-2 text-base px-8">
              <Link to="/get-involved">
                <Users className="h-5 w-5" />
                Become a Volunteer
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-background hover:bg-background/10 gap-2 text-base">
              <Link to="/what-we-do">
                Explore Our Work
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "150+", label: "Athletes Supported" },
              { value: "25+", label: "Partner Schools" },
              { value: "10+", label: "Districts Reached" },
            ].map((stat, i) => (
              <div key={i} className="text-background">
                <div className="text-3xl md:text-4xl font-bold text-secondary">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
