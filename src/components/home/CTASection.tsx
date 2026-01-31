import { Link } from "react-router-dom";
import { Heart, ArrowRight, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const actions = [
  { 
    icon: Heart, 
    title: "Donate", 
    desc: "Make an immediate impact", 
    link: "/donate", 
    btnText: "Donate Now",
    variant: "secondary" as const
  },
  { 
    icon: Users, 
    title: "Volunteer", 
    desc: "Join our team", 
    link: "/volunteer", 
    btnText: "Join Us",
    variant: "outline" as const
  },
  { 
    icon: Mail, 
    title: "Connect", 
    desc: "Stay updated", 
    link: "/contact", 
    btnText: "Contact",
    variant: "outline" as const
  },
];

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-primary relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-5">
                <Heart className="h-4 w-4" />
                Make a Difference
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                Support Young Athletes Today
              </h2>

              <p className="text-base lg:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Your contribution transforms lives. Help us provide training, equipment, and opportunities to talented youth.
              </p>
            </div>
          </ScrollReveal>

          {/* Action Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {actions.map((item, index) => (
              <ScrollReveal key={index} delay={index * 80} animation="scale">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 text-center border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors h-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                    index === 0 ? "bg-secondary text-secondary-foreground" : "bg-primary-foreground/20 text-primary-foreground"
                  }`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-primary-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70 mb-4">{item.desc}</p>
                  <Button
                    asChild
                    size="sm"
                    variant={item.variant === "secondary" ? "default" : "outline"}
                    className={item.variant === "secondary" 
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full" 
                      : "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full"
                    }
                  >
                    <Link to={item.link}>{item.btnText}</Link>
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <ScrollReveal delay={250}>
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 shadow-lg"
              >
                <Link to="/get-involved">
                  Explore All Ways to Help
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
