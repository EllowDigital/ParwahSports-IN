import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Shield, Award, CheckCircle } from "lucide-react";

const trustBadges = [
  { icon: Shield, label: "Registered NGO" },
  { icon: Award, label: "80G Tax Exemption" },
  { icon: CheckCircle, label: "Verified Trust" },
];

export function PartnersSection() {
  return (
    <section className="py-12 lg:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-12">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <badge.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
