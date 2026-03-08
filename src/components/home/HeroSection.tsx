import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "150+", label: "Athletes Trained", icon: Users },
  { value: "25+", label: "Partner Schools", icon: Trophy },
  { value: "10+", label: "Districts Reached", icon: Heart },
];

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Single Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/slider/P1.jpeg"
          alt="Athletes training together"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          loading="eager"
        />
        {/* Clean gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground/60" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-0">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-secondary/15 backdrop-blur-sm text-secondary px-4 py-2 rounded-full text-sm font-medium mb-8 border border-secondary/20 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Empowering Athletes Since 2015
          </div>

          {/* Headline */}
          <h1
            className={`font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-[1.1] mb-6 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Transforming Dreams{" "}
            <span className="text-secondary">Into Champions</span>
          </h1>

          {/* Subtext */}
          <p
            className={`text-lg text-background/75 leading-relaxed mb-10 max-w-lg transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Supporting young athletes across India with world-class training,
            resources, and mentorship to shine on national and international
            stages.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mb-16 transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 px-8 py-6 text-base"
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
              className="border-background/25 bg-background/5 backdrop-blur-sm text-background hover:bg-background/15 gap-2 px-8 py-6 text-base"
            >
              <Link to="/about">
                Learn More
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className={`transition-all duration-700 delay-[400ms] ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex flex-wrap gap-8 lg:gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background/10 backdrop-blur-sm flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-background leading-none">
                      {stat.value}
                    </div>
                    <div className="text-xs text-background/50 mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
