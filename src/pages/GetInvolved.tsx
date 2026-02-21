import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Heart, Clock, Handshake, Share2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    link: "/volunteer",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Heart,
    title: "Make a Donation",
    description: "Support athlete training and equipment",
    details: [
      "Fund training equipment and gear",
      "Sponsor an athlete's training fees",
      "Support travel for competitions",
      "Contribute to scholarship funds",
    ],
    cta: "Donate Now",
    link: "/donate",
    color: "bg-secondary/10 text-secondary",
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
    link: "/contact",
    color: "bg-accent/10 text-accent",
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
    link: "/contact",
    color: "bg-primary/10 text-primary",
  },
];

const getInvolvedFaqs = [
  { question: "How can I get involved with Parwah Sports?", answer: "You can get involved by volunteering at events, donating to support athlete training, partnering with us as an organization, or simply spreading the word on social media." },
  { question: "Do I need sports experience to volunteer?", answer: "No! We welcome volunteers from all backgrounds. Whether you can help with administration, event management, mentoring, or coaching, there's a role for you." },
  { question: "Can my company partner with Parwah Sports?", answer: "Absolutely! We offer corporate sponsorship, school partnership programs, equipment support, and event sponsorship opportunities. Contact us to discuss how we can collaborate." },
  { question: "How does my donation help athletes?", answer: "Your donations fund training equipment, coaching fees, competition travel, scholarships, and facility improvements for underprivileged young athletes across India." },
  { question: "Is there a minimum time commitment for volunteering?", answer: "No minimum commitment required. You can volunteer for a single event or become a regular contributor — whatever fits your schedule." },
];

const getInvolvedFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: getInvolvedFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const GetInvolved = () => {
  return (
    <Layout>
      <SEOHead
        title="Get Involved - Support Parwah Sports"
        description="Get involved with Parwah Sports Charitable Trust. Volunteer, donate, partner, or spread the word to support young athletes and sports development in India."
        path="/get-involved"
        keywords="get involved sports India, support athletes, volunteer sports NGO, donate sports charity, Parwah Sports"
        jsonLd={getInvolvedFaqJsonLd}
      />
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={victoryImage} alt="Victory moment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/60" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart className="h-4 w-4" />
                Make a Difference
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6">
                Be the Reason Someone <span className="text-secondary">Never Gives Up</span>
              </h1>
              <p className="text-xl text-background/80 leading-relaxed mb-8">
                Your support can transform the life of a young athlete. Join us in building
                champions and changing lives through the power of sports.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
                >
                  <Link to="/donate">
                    <Heart className="h-5 w-5" />
                    Donate Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-background/30 text-background hover:bg-background/10"
                >
                  <Link to="/volunteer">
                    <Users className="h-5 w-5" />
                    Volunteer
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
                Get Involved
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ways to Help
              </h2>
              <p className="text-lg text-muted-foreground">
                There are many ways you can contribute to our mission. Choose what works best for
                you.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {waysToHelp.map((way, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full group">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${way.color} group-hover:scale-110 transition-transform`}
                      >
                        <way.icon className="h-7 w-7" />
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
                    <Button
                      asChild
                      variant="outline"
                      className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link to={way.link}>
                        {way.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
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
          </ScrollReveal>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">Common questions about getting involved with Parwah Sports.</p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {getInvolvedFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;
