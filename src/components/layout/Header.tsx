import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, ChevronDown, Newspaper, FileText, CalendarDays, Trophy, Megaphone, FolderOpen, Image, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const mainNavigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "What We Do", href: "/what-we-do" },
  { name: "Projects", href: "/projects" },
];

const contentLinks = [
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Blogs", href: "/blogs", icon: FileText },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Competitions", href: "/competitions", icon: Trophy },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
];

const moreLinks = [
  { name: "Gallery", href: "/gallery", icon: Image },
  { name: "Team", href: "/team", icon: Users },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Resources", href: "/resources", icon: FolderOpen },
  { name: "Volunteer", href: "/volunteer" },
  { name: "Get Involved", href: "/get-involved" },
  { name: "Contact", href: "/contact" },
];

const policyLinks = [
  { name: "Shipping Policy", href: "/shipping-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-card flex items-center justify-center overflow-hidden border border-border shadow-sm transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Parwah Sports"
                className="w-full h-full object-contain p-1"
                loading="eager"
              />
            </div>
            <div className="leading-tight max-w-[170px] sm:max-w-none">
              <span className="font-serif font-bold text-sm sm:text-lg lg:text-xl text-foreground truncate">
                Parwah Sports
              </span>
              <span className="block text-[10px] sm:text-xs text-muted-foreground">
                Charitable Trust
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Content Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
                Content <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Updates & Media</DropdownMenuLabel>
                {contentLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.href} className={`flex items-center gap-2 ${isActive(item.href) ? "text-primary" : ""}`}>
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
                More <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.href} className={isActive(item.href) ? "text-primary" : ""}>
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Policies</DropdownMenuLabel>
                {policyLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.href} className={`text-xs ${isActive(item.href) ? "text-primary" : ""}`}>
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              variant="default"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
            >
              <Link to="/donate">
                <Heart className="h-4 w-4" />
                Donate Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Content Section */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Content
                </p>
                {contentLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* More Section */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  More
                </p>
                {moreLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Policies Section */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Policies
                </p>
                {policyLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <Button
                asChild
                variant="default"
                className="mt-4 mx-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <Link to="/donate" onClick={() => setMobileMenuOpen(false)}>
                  <Heart className="h-4 w-4" />
                  Donate Now
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
