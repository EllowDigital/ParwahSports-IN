import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const mainLinks = [
  { name: "About", href: "/about" },
  { name: "What We Do", href: "/what-we-do" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
];

const supportLinks = [
  { name: "Donate", href: "/donate" },
  { name: "Volunteer", href: "/volunteer" },
  { name: "Membership", href: "/membership" },
  { name: "Contact", href: "/contact" },
];

const moreLinks = [
  { name: "News", href: "/news" },
  { name: "Blogs", href: "/blogs" },
  { name: "Team", href: "/team" },
  { name: "Calendar", href: "/calendar" },
];

const policies = [
  { name: "Privacy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms-and-conditions" },
  { name: "Refund", href: "/refund-policy" },
  { name: "Shipping", href: "/shipping-policy" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/parwahsports/",
    Icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ParwahSports",
    Icon: Facebook,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@parwahsports",
    Icon: Youtube,
  },
];

export function WebsiteCredit() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
          Designed & developed with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by{" "}
          <a
            href="https://ellowdigital.space"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
          >
            EllowDigital
          </a>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        Website design & development partner
      </TooltipContent>
    </Tooltip>
  );
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* CTA Section */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-md">
              <h3 className="font-serif text-xl lg:text-2xl font-bold text-foreground mb-2">
                Support Young Athletes
              </h3>
              <p className="text-muted-foreground text-sm lg:text-base">
                Your contribution helps provide training, equipment, and opportunities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <Link to="/donate">
                  <Heart className="h-4 w-4" />
                  Donate Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/volunteer">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden shadow-sm group-hover:border-primary/30 transition-colors">
                <img
                  src="/logo.png"
                  alt="Parwah Sports"
                  className="w-full h-full object-contain p-0.5"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-base lg:text-lg text-foreground block">
                  Parwah Sports
                </span>
                <span className="text-xs text-muted-foreground">Charitable Trust</span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Empowering young athletes across India with training, resources, and opportunities
              since 2015.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:+919557960056"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +91 9557960056
              </a>
              <a
                href="mailto:ParwahSports@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                ParwahSports@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Mahak Complex, Delhi Road, Rampur Maniharan, Saharanpur 247451</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">More</h4>
            <ul className="space-y-2.5">
              {moreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col gap-4">
          {/* Top row - Copyright & Policies */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Parwah Sports Charitable Trust. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {policies.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          {/* Bottom row - Credits */}
          <div className="flex justify-center">
            <WebsiteCredit />
          </div>
        </div>
      </div>
    </footer>
  );
}
