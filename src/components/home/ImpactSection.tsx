import { Users, School, MapPin, Trophy, Calendar, TrendingUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import trainingImage from "@/assets/training-session.jpg";

const stats = [
  { icon: Users, value: 150, suffix: "+", label: "Athletes Supported" },
  { icon: School, value: 25, suffix: "+", label: "Partner Schools" },
  { icon: MapPin, value: 10, suffix: "+", label: "Districts Reached" },
  { icon: Trophy, value: 50, suffix: "+", label: "National Athletes" },
  { icon: Calendar, value: 15, suffix: "+", label: "Annual Events" },
  { icon: TrendingUp, value: 9, suffix: "+", label: "Years of Impact" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function ImpactSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal animation="fade-right" className="order-2 lg:order-1">
            <div className="relative">
              <div className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={trainingImage}
                  alt="Training session"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-secondary text-secondary-foreground p-4 lg:p-5 rounded-xl lg:rounded-2xl shadow-lg">
                <div className="text-2xl lg:text-3xl font-bold">9+</div>
                <div className="text-xs lg:text-sm opacity-90">Years of Impact</div>
              </div>
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal animation="fade-left" className="order-1 lg:order-2">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Our Impact
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
              Building Champions Across India
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Since 2015, we've been nurturing talented athletes from underserved backgrounds. Our impact spans across districts, transforming lives through the power of sports.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="group p-4 rounded-xl bg-background border border-border hover:border-primary/20 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <span className="text-xl lg:text-2xl font-bold text-foreground block">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
