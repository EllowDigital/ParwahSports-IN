import { Layout } from "@/components/layout/Layout";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Contact Us</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">Have questions? We'd love to hear from you.</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              {[
                { icon: MapPin, title: "Address", content: "Sports Complex, Sector 7, Dehradun, Uttarakhand 248001" },
                { icon: Phone, title: "Phone", content: "+91 123 456 7890" },
                { icon: Mail, title: "Email", content: "info@khelshakti.org" },
                { icon: Clock, title: "Office Hours", content: "Mon - Sat: 9:00 AM - 6:00 PM" },
              ].map((item, i) => (
                <Card key={i} className="border-0 shadow-md">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground">{item.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="rounded-xl overflow-hidden h-64 bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.76686498942!2d77.94856454179688!3d30.32379570000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888af%3A0x4c3562c032518799!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1704105600000!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
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
