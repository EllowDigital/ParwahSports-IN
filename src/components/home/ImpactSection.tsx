import { Users, School, MapPin, Trophy, Calendar } from "lucide-react";
import trainingImage from "@/assets/training-session.jpg";

const stats = [
  {
    icon: Users,
    value: "150+",
    label: "Athletes Supported",
    description: "Young athletes receiving training & support",
  },
  {
    icon: School,
    value: "25+",
    label: "Schools & Academies",
    description: "Partner institutions across regions",
  },
  {
    icon: MapPin,
    value: "10+",
    label: "Districts Reached",
    description: "In Uttarakhand & nearby states",
  },
  {
    icon: Trophy,
    value: "50+",
    label: "National Athletes",
    description: "Competing at national level",
  },
  { icon: Calendar, value: "15+", label: "Annual Events", description: "Sports camps & workshops" },
];

export function ImpactSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={trainingImage}
                alt="Training session with young athletes"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground p-6 rounded-2xl shadow-xl">
              <div className="text-4xl font-bold">9+</div>
              <div className="text-sm opacity-90">Years of Impact</div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Our Impact
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Building Champions Across India
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Since 2015, we have been on a mission to identify, nurture, and support talented
              athletes from underprivileged backgrounds. Our impact spans across districts,
              transforming lives through the power of sports.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {stats.slice(0, 6).map((stat, index) => (
                <div key={index} className="group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl lg:text-3xl font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
