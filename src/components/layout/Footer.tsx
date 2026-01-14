import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "What We Do", href: "/what-we-do" },
  { name: "Projects", href: "/projects" },
  { name: "Get Involved", href: "/get-involved" },
];

const resources = [
  { name: "Training Materials", href: "/resources" },
  { name: "Event Calendar", href: "/calendar" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-xl">PS</span>
              </div>
              <div>
                <span className="font-serif font-bold text-xl">Parwah Sports</span>
                <span className="block text-xs opacity-80">Charitable Trust</span>
              </div>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              Empowering young athletes across India with training, resources, and opportunities to achieve their dreams.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-secondary hover:text-secondary-foreground flex items-center justify-center transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-secondary" />
                <span className="text-sm opacity-80">
                  Sports Complex, Sector 7<br />
                  Dehradun, Uttarakhand 248001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <a href="tel:+911234567890" className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-secondary" />
                <a href="mailto:info@parwahsports.org" className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors">
                  info@parwahsports.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-60">
              © 2024 Parwah Sports Charitable Trust. All rights reserved.
            </p>
            <p className="text-sm opacity-60 flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-secondary fill-secondary" /> for Indian Athletes
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
