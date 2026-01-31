import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "What We Do", href: "/what-we-do" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
];

const getInvolved = [
  { name: "Donate", href: "/donate" },
  { name: "Volunteer", href: "/volunteer" },
  { name: "Membership", href: "/membership" },
  { name: "Partner With Us", href: "/contact" },
];

const resources = [
  { name: "News & Updates", href: "/news" },
  { name: "Blog", href: "/blogs" },
  { name: "Event Calendar", href: "/calendar" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

const policies = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Shipping Policy", href: "/shipping-policy" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/parwahsports/?igsh=dGI4N2s2OHBqOHVw#",
    Icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ParwahSports?rdid=ZHkulrdsvnTRb12C&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18r2xWUuhF%2F#",
    Icon: Facebook,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@parwahsports",
    Icon: Youtube,
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-2">Stay Updated</h3>
              <p className="text-background/70">Get the latest news about our athletes and events.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <Link to="/contact">
                  <Mail className="h-5 w-5" />
                  Subscribe to Updates
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background/30 text-background hover:bg-background/10"
              >
                <Link to="/donate">
                  <Heart className="h-5 w-5" />
                  Donate Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src="/logo.png"
                  alt="Parwah Sports"
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-xl">Parwah Sports</span>
                <span className="block text-xs opacity-80">Charitable Trust</span>
              </div>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed mb-6 max-w-sm">
              Empowering young athletes across India with training, resources, and opportunities to
              achieve their dreams since 2015.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  title={name}
                  className="w-10 h-10 rounded-xl bg-background/10 hover:bg-secondary hover:text-secondary-foreground flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background/60">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-secondary transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background/60">
              Get Involved
            </h3>
            <ul className="space-y-3">
              {getInvolved.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-secondary transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background/60">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-secondary transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background/60">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-secondary" />
                <span className="text-sm text-background/70">
                  Mahak Complex, Delhi Road,
                  <br />
                  Rampur Maniharan,
                  <br />
                  Saharanpur 247451
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <a
                  href="tel:+919557960056"
                  className="text-sm text-background/70 hover:text-secondary transition-colors"
                >
                  +91 9557960056
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-secondary" />
                <a
                  href="mailto:ParwahSports@gmail.com"
                  className="text-sm text-background/70 hover:text-secondary transition-colors"
                >
                  ParwahSports@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} Parwah Sports Charitable Trust. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {policies.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-xs text-background/50 hover:text-secondary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <p className="text-sm text-background/50 flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-secondary fill-secondary" /> for Indian Athletes
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
