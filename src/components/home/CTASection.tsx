import { Link } from "react-router-dom";
import { Heart, ArrowRight, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Make a Difference Today
            </span>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Extend a Helping Hand — <br className="hidden md:block" />
              <span className="text-secondary">Donate Today</span>
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Your contribution can transform the life of a young athlete. Help us provide training,
              equipment, and opportunities to talented youth who deserve a chance to shine.
            </p>
          </div>

          {/* CTA Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">One-Time Donation</h3>
              <p className="text-sm text-primary-foreground/70 mb-4">Make an immediate impact with a one-time contribution</p>
              <Button
                asChild
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full"
              >
                <Link to="/donate">Donate Now</Link>
              </Button>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Become a Volunteer</h3>
              <p className="text-sm text-primary-foreground/70 mb-4">Join our team and help athletes directly</p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full"
              >
                <Link to="/volunteer">Join Us</Link>
              </Button>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Stay Connected</h3>
              <p className="text-sm text-primary-foreground/70 mb-4">Get updates on our programs and events</p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 text-base px-10 shadow-lg"
            >
              <Link to="/get-involved">
                Explore All Ways to Help
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
