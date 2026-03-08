import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const headquartersAddress = "Mahak Complex, Delhi Road, Rampur Maniharan, Saharanpur 247451";
  const phoneDisplay = "9557960056";
  const phoneHref = "+919557960056";
  const email = "ParwahSports@gmail.com";

  return (
    <Layout>
      <SEOHead
        title="Contact Us - Parwah Sports Charitable Trust"
        description="Get in touch with Parwah Sports Charitable Trust in Saharanpur, UP. Contact us for sports training, events, donations, volunteering and membership queries."
        path="/contact"
        keywords="contact Parwah Sports, sports academy contact, Saharanpur sports, sports trust contact"
      />

      <PageHero
        badge="Contact Us"
        title="Get in Touch"
        description="Have questions? We'd love to hear from you. Reach out for donation, volunteering, or partnership inquiries."
      />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Your Name</label>
                        <Input placeholder="Full name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <Input type="email" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Subject</label>
                      <Input placeholder="What is this regarding?" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Your Message</label>
                      <Textarea placeholder="Type your message here..." rows={5} className="resize-none" />
                    </div>
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 py-5">
                      <Send className="h-4 w-4" /> Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-6">
                Contact Information
              </h2>
              {[
                { icon: MapPin, title: "Headquarters", content: headquartersAddress, color: "bg-primary/10 text-primary" },
                { icon: Phone, title: "Phone", content: `Main: ${phoneDisplay}`, href: `tel:${phoneHref}`, color: "bg-secondary/10 text-secondary" },
                { icon: Mail, title: "Email", content: `General: ${email}`, href: `mailto:${email}`, color: "bg-accent/10 text-accent" },
              ].map((item, i) => (
                <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5 sm:p-6">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base break-all">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground text-sm sm:text-base">{item.content}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="rounded-xl overflow-hidden h-56 sm:h-64 bg-muted border border-border">
                <iframe
                  title="Parwah Sports Club headquarters on Google Maps"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(headquartersAddress)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
