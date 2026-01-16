import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";

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

const policies = [
  { name: "Shipping Policy", href: "/shipping-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Cancellation & Refund Policy", href: "/refund-policy" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

export function Footer() {
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

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden border border-background/20 shadow-sm">
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
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              Empowering young athletes across India with training, resources, and opportunities to
              achieve their dreams.
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

            <h3 className="font-semibold text-lg mt-8 mb-4">Policies</h3>
            <ul className="space-y-3">
              {policies.map((link) => (
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
                  Mahak Complex
                  <br />
                  Delhi Road, Rampur Maniharan
                  <br />
                  Saharanpur 247451
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <a
                  href="tel:+919557960056"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                >
                  9557960056
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-secondary" />
                <a
                  href="mailto:ParwahSports@gmail.com"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-60">
              © 2024 Parwah Sports Charitable Trust. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm opacity-70">
              {policies.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="hover:opacity-100 hover:text-secondary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <p className="text-sm opacity-60 flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-secondary fill-secondary" /> for Indian
              Athletes
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
