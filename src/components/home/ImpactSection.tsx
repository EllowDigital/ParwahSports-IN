import { Users, School, MapPin, Trophy, Calendar, TrendingUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import trainingImage from "@/assets/training-session.jpg";

const stats = [
  {
    icon: Users,
    value: 150,
    suffix: "+",
    label: "Athletes Supported",
    description: "Young athletes receiving training & support",
  },
  {
    icon: School,
    value: 25,
    suffix: "+",
    label: "Schools & Academies",
    description: "Partner institutions across regions",
  },
  {
    icon: MapPin,
    value: 10,
    suffix: "+",
    label: "Districts Reached",
    description: "In Uttarakhand & nearby states",
  },
  {
    icon: Trophy,
    value: 50,
    suffix: "+",
    label: "National Athletes",
    description: "Competing at national level",
  },
  {
    icon: Calendar,
    value: 15,
    suffix: "+",
    label: "Annual Events",
    description: "Sports camps & workshops",
  },
  {
    icon: TrendingUp,
    value: 9,
    suffix: "+",
    label: "Years of Impact",
    description: "Transforming lives since 2015",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
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
    <section className="py-20 lg:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <ScrollReveal animation="fade-right" className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={trainingImage}
                  alt="Training session with young athletes"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground p-6 rounded-2xl shadow-xl hidden sm:block">
                <div className="text-4xl font-bold">9+</div>
                <div className="text-sm opacity-90">Years of Impact</div>
              </div>
              {/* Secondary Badge */}
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg hidden sm:block">
                <Trophy className="h-8 w-8" />
              </div>
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal animation="fade-left" className="order-1 lg:order-2">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Our Impact
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Building Champions Across India
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Since 2015, we have been on a mission to identify, nurture, and support talented
              athletes from underprivileged backgrounds. Our impact spans across districts,
              transforming lives through the power of sports.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <span className="text-2xl lg:text-3xl font-bold text-foreground block">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <p className="text-sm font-medium text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
