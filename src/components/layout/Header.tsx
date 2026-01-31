import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, ChevronDown, ChevronRight, Users, Phone, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainNavigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "What We Do", href: "/what-we-do" },
  { name: "Projects", href: "/projects" },
  { name: "Gallery", href: "/gallery" },
  { name: "Events", href: "/events" },
];

const moreLinks = [
  { name: "News", href: "/news" },
  { name: "Blogs", href: "/blogs" },
  { name: "Competitions", href: "/competitions" },
  { name: "Announcements", href: "/announcements" },
  { name: "Calendar", href: "/calendar" },
  { name: "Our Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

const supportLinks = [
  { name: "Get Involved", href: "/get-involved" },
  { name: "Volunteer", href: "/volunteer" },
  { name: "Membership", href: "/membership" },
];

const portalLinks = [
  { name: "Member Portal", href: "/member/login" },
  { name: "Student Portal", href: "/student/login" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-18 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-card flex items-center justify-center overflow-hidden border border-border shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/30">
              <img
                src="/logo.png"
                alt="Parwah Sports"
                className="w-full h-full object-contain p-0.5"
                loading="eager"
              />
            </div>
            <div className="leading-tight">
              <span className="font-serif font-bold text-sm sm:text-base lg:text-lg text-foreground block">
                Parwah Sports
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">
                Charitable Trust
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex items-center gap-1 outline-none">
                More <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {moreLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.href}
                      className={`w-full ${isActive(item.href) ? "text-primary font-medium" : ""}`}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* Support Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Users className="h-4 w-4" />
                  <span className="hidden xl:inline">Support</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {supportLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.href}
                      className={`w-full ${isActive(item.href) ? "text-primary font-medium" : ""}`}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Portal Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden xl:inline">Portal</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {portalLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.href} className="w-full">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Donate CTA */}
            <Button asChild size="sm" className="gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/donate">
                <Heart className="h-4 w-4" />
                Donate
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <Button asChild variant="default" size="sm" className="gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/donate">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Donate</span>
              </Link>
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm p-0 overflow-y-auto">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="font-serif">Parwah Sports</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-1">
                  {/* Main Links */}
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* More Section */}
                  <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                      <span>More</span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-90" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 mt-1">
                      {moreLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                            isActive(item.href)
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Support Section */}
                  <Collapsible open={supportOpen} onOpenChange={setSupportOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                      <span>Support Us</span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${supportOpen ? "rotate-90" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 mt-1">
                      {supportLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                            isActive(item.href)
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Portals Section */}
                  <Collapsible open={portalsOpen} onOpenChange={setPortalsOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                      <span>Portals</span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${portalsOpen ? "rotate-90" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 mt-1">
                      {portalLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                            isActive(item.href)
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Mobile Footer Actions */}
                <div className="p-4 mt-auto border-t border-border space-y-3">
                  <Button asChild className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Link to="/donate">
                      <Heart className="h-4 w-4" />
                      Donate Now
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
                      <Link to="/contact">
                        <Phone className="h-4 w-4" />
                        Contact
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
                      <Link to="/member/login">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
