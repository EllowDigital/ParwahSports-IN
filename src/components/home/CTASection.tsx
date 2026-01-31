import { Link } from "react-router-dom";
import { Heart, ArrowRight, Users, Mail, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import victoryImage from "@/assets/victory-moment.jpg";

const actions = [
  { 
    icon: Heart, 
    title: "One-Time Donation", 
    desc: "Make an immediate impact with a contribution that transforms lives", 
    link: "/donate", 
    btnText: "Donate Now",
    highlight: true
  },
  { 
    icon: Users, 
    title: "Become a Volunteer", 
    desc: "Join our team and help athletes directly with your time and skills", 
    link: "/volunteer", 
    btnText: "Join Us",
    highlight: false
  },
  { 
    icon: Mail, 
    title: "Stay Connected", 
    desc: "Get updates on our programs, events, and athlete success stories", 
    link: "/contact", 
    btnText: "Contact Us",
    highlight: false
  },
];

const stats = [
  { value: "150+", label: "Athletes Supported" },
  { value: "₹10L+", label: "Funds Raised" },
  { value: "25+", label: "Partner Schools" },
];

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={victoryImage}
          alt="Athletes celebrating"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/40" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-secondary/30">
                <Sparkles className="h-4 w-4" />
                Make a Difference Today
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
                Support Young Athletes —{" "}
                <span className="text-secondary">Transform Lives</span>
              </h2>

              <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Your contribution can change the trajectory of a young athlete's life. 
                Help us provide world-class training, equipment, and opportunities.
              </p>
            </div>
          </ScrollReveal>

          {/* Stats Bar */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-12 py-6 px-8 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Action Cards */}
          <div className="grid sm:grid-cols-3 gap-4 lg:gap-6 mb-12">
            {actions.map((item, index) => (
              <ScrollReveal key={index} delay={150 + index * 80} animation="scale">
                <div className={`rounded-2xl p-6 lg:p-8 text-center h-full transition-all duration-300 hover:-translate-y-1 ${
                  item.highlight 
                    ? "bg-secondary text-secondary-foreground shadow-xl" 
                    : "bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/15"
                }`}>
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                    item.highlight 
                      ? "bg-secondary-foreground/20" 
                      : "bg-primary-foreground/10"
                  }`}>
                    <item.icon className={`h-7 w-7 lg:h-8 lg:w-8 ${
                      item.highlight ? "text-secondary-foreground" : "text-primary-foreground"
                    }`} />
                  </div>
                  <h3 className={`text-lg lg:text-xl font-semibold mb-2 ${
                    item.highlight ? "text-secondary-foreground" : "text-primary-foreground"
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm lg:text-base mb-5 leading-relaxed ${
                    item.highlight ? "text-secondary-foreground/80" : "text-primary-foreground/70"
                  }`}>
                    {item.desc}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    variant={item.highlight ? "default" : "outline"}
                    className={`w-full ${
                      item.highlight 
                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" 
                        : "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    }`}
                  >
                    <Link to={item.link}>{item.btnText}</Link>
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <ScrollReveal delay={400}>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm">
                <Trophy className="h-4 w-4" />
                <span>80G Tax Benefits Available • 100% Transparent</span>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
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
