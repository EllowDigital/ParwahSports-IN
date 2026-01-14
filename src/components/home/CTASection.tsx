import { Link } from "react-router-dom";
import { Heart, ArrowRight, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import victoryImage from "@/assets/victory-moment.jpg";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-primary relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img
          src={victoryImage}
          alt="Athlete victory moment"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            Make a Difference Today
          </span>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Extend a Helping Hand — <br className="hidden md:block" />
            <span className="text-secondary">Donate Today</span>
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your contribution can transform the life of a young athlete. Help us provide training, 
            equipment, and opportunities to talented youth who deserve a chance to shine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 text-base px-8">
              <Link to="/get-involved">
                <Heart className="h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 text-base">
              <Link to="/get-involved">
                Learn How to Help
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* QR Code Placeholder */}
          <div className="inline-flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
            <div className="w-24 h-24 bg-primary-foreground rounded-lg flex items-center justify-center">
              <QrCode className="h-16 w-16 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-primary-foreground">Scan to Donate</p>
              <p className="text-sm text-primary-foreground/70">Quick & secure UPI payment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
