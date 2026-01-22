import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  Heart,
  Clock,
  Handshake,
  Share2,
  Gift,
  Users,
  Award,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import victoryImage from "@/assets/victory-moment.jpg";

const waysToHelp = [
  {
    icon: Clock,
    title: "Give Your Time",
    description: "Volunteer, mentor, or coach young athletes",
    details: [
      "Volunteer at events and training camps",
      "Mentor young athletes with your expertise",
      "Coach sports sessions at partner schools",
      "Help with administrative tasks",
    ],
    cta: "Become a Volunteer",
  },
  {
    icon: Gift,
    title: "Support a Dream",
    description: "Donate for equipment, training, or travel",
    details: [
      "Fund training equipment and gear",
      "Sponsor an athlete's training fees",
      "Support travel for competitions",
      "Contribute to scholarship funds",
    ],
    cta: "Donate Now",
  },
  {
    icon: Handshake,
    title: "Partner With Purpose",
    description: "Schools, academies, and organizations",
    details: [
      "Corporate sponsorship opportunities",
      "School partnership programs",
      "Equipment and facility support",
      "Event sponsorship",
    ],
    cta: "Explore Partnerships",
  },
  {
    icon: Share2,
    title: "Be a Voice",
    description: "Social sharing and awareness",
    details: [
      "Share our stories on social media",
      "Organize awareness events",
      "Write about athlete achievements",
      "Connect us with potential supporters",
    ],
    cta: "Spread the Word",
  },
];

const donationOptions = [
  { amount: "₹500", description: "Provides basic training equipment for one athlete" },
  { amount: "₹2,000", description: "Sponsors one month of professional coaching" },
  { amount: "₹5,000", description: "Covers travel and registration for a competition" },
  { amount: "₹10,000", description: "Funds complete training gear and uniform" },
  { amount: "₹25,000", description: "Sponsors a full year of athlete development" },
  { amount: "Custom", description: "Choose your own contribution amount" },
];

const GetInvolved = () => {
  const ctaLinkFor = (cta: string) => {
    switch (cta) {
      case "Become a Volunteer":
        return "/volunteer";
      case "Donate Now":
        return "/donate";
      case "Explore Partnerships":
        return "/contact";
      case "Spread the Word":
        return "/contact";
      default:
        return "/contact";
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={victoryImage} alt="Victory moment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/60" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Make a Difference
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6">
              Be the Reason Someone <span className="text-secondary">Never Gives Up</span>
            </h1>
            <p className="text-xl text-background/80 leading-relaxed mb-8">
              Your support can transform the life of a young athlete. Join us in building champions
              and changing lives through the power of sports.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
            >
              <a href="#donate">
                <Heart className="h-5 w-5" />
                Donate Now
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Get Involved
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ways to Help
            </h2>
            <p className="text-lg text-muted-foreground">
              There are many ways you can contribute to our mission. Choose what works best for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {waysToHelp.map((way, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <way.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{way.title}</CardTitle>
                      <CardDescription className="text-base">{way.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {way.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link to={ctaLinkFor(way.cta)}>
                      {way.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Donation Options */}
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
                Donate
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Support a Dream Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every contribution, big or small, helps us support more athletes. Choose an amount
                that works for you.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {donationOptions.map((option, index) => (
                  <div
                    key={index}
                    className="p-4 bg-card rounded-xl border border-border hover:border-secondary hover:shadow-md transition-all cursor-pointer text-center"
                  >
                    <div className="text-2xl font-bold text-foreground mb-1">{option.amount}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 text-lg py-6"
              >
                <Link to="/donate">
                  <Heart className="h-5 w-5" />
                  Proceed to Donate
                </Link>
              </Button>

              <p className="text-sm text-muted-foreground mt-4 text-center">
                All donations are eligible for tax exemption under Section 80G
              </p>
            </div>

            {/* QR Code & Info */}
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="font-semibold text-xl text-foreground mb-2">
                  Quick Donation via UPI
                </h3>
                <p className="text-muted-foreground">Scan the QR code with any UPI app</p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-foreground" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">UPI ID</span>
                  <span className="font-medium text-foreground">parwahsports@upi</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Account Name</span>
                  <span className="font-medium text-foreground">
                    Parwah Sports Charitable Trust
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-3 text-accent">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">80G Tax Exemption Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <Users className="h-16 w-16 mx-auto mb-6 text-secondary" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Join Our Volunteer Network
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
              Share your skills, time, and passion to make a difference in the lives of young
              athletes. We welcome volunteers from all backgrounds.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Link to="/volunteer">Apply as Volunteer</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/team">Meet Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;
