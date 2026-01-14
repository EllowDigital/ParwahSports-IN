import { Building2, Heart, Calendar, Trophy, Handshake } from "lucide-react";

const partners = [
  { name: "SportsTech India", role: "Equipment Supplier", icon: Building2 },
  { name: "HealthFirst", role: "Healthcare Partner", icon: Heart },
  { name: "EventPro", role: "Event Organizer", icon: Calendar },
  { name: "Champions League", role: "Sports League", icon: Trophy },
  { name: "FutureFund", role: "Sponsor", icon: Handshake },
  { name: "AthleteCare", role: "Medical Partner", icon: Heart },
];

export function PartnersSection() {
  return (
    <section className="py-16 lg:py-20 bg-background border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Our Partners
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Trusted By Leading Organizations
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group flex flex-col items-center p-6 rounded-xl bg-muted/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <partner.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">{partner.name}</span>
              <span className="text-xs text-muted-foreground mt-1">{partner.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
