import { Building2, Heart, Calendar, Trophy, Handshake, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const partners = [
  { name: "SportsTech India", role: "Equipment Supplier", icon: Building2 },
  { name: "HealthFirst", role: "Healthcare Partner", icon: Heart },
  { name: "EventPro", role: "Event Organizer", icon: Calendar },
  { name: "Champions League", role: "Sports League", icon: Trophy },
  { name: "FutureFund", role: "Sponsor", icon: Handshake },
  { name: "AthleteCare", role: "Medical Partner", icon: Users },
];

export function PartnersSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Our Partners
            </span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Trusted By Leading Organizations
            </h2>
          </div>
        </ScrollReveal>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {partners.map((partner, index) => (
            <ScrollReveal key={index} delay={index * 50} animation="scale">
              <div className="group flex flex-col items-center p-6 rounded-2xl bg-muted/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4 group-hover:border-primary/30 group-hover:shadow-lg transition-all">
                  <partner.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {partner.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{partner.role}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust Indicators */}
        <ScrollReveal delay={300}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm">Registered NGO</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-sm">80G Tax Exemption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm">Transparent Reporting</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
