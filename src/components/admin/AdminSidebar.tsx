import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Image,
  Calendar,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  Heart,
  CreditCard,
  Crown,
  Newspaper,
  FileText,
  Bell,
  Trophy,
  GraduationCap,
  Award,
  Medal,
  HandHeart,
  FolderOpen,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationSections = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { name: "News", href: "/admin/news", icon: Newspaper },
      { name: "Blogs", href: "/admin/blogs", icon: FileText },
      { name: "Announcements", href: "/admin/announcements", icon: Bell },
      { name: "Gallery", href: "/admin/gallery", icon: Image },
    ],
  },
  {
    title: "Programs",
    items: [
      { name: "Projects", href: "/admin/projects", icon: FolderOpen },
      { name: "Events", href: "/admin/events", icon: Calendar },
      { name: "Competitions", href: "/admin/competitions", icon: Trophy },
    ],
  },
  {
    title: "People",
    items: [
      { name: "Team", href: "/admin/team", icon: Users },
      { name: "Volunteers", href: "/admin/volunteers", icon: HandHeart },
      { name: "Students", href: "/admin/students", icon: GraduationCap },
      { name: "Participations", href: "/admin/participations", icon: Medal },
      { name: "Certificates", href: "/admin/certificates", icon: Award },
    ],
  },
  {
    title: "Payments",
    items: [
      { name: "Donations", href: "/admin/donations", icon: Heart },
      { name: "Members", href: "/admin/members", icon: UserCheck },
      { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { name: "Plans", href: "/admin/plans", icon: Crown },
    ],
  },
  {
    title: "System",
    items: [{ name: "Settings", href: "/admin/settings", icon: Settings }],
  },
] as const;

export function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(
    navigationSections.map((s) => s.title),
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-primary-foreground font-bold text-lg">P</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground text-sm truncate">Parwah Trust</h2>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationSections.map((section) => (
            <Collapsible
              key={section.title}
              open={openSections.includes(section.title)}
              onOpenChange={() => toggleSection(section.title)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/80 hover:text-muted-foreground transition-colors">
                {section.title}
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform duration-200",
                    openSections.includes(section.title) && "rotate-180",
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? location.pathname === "/admin"
                      : location.pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Home className="w-4 h-4" />
          View Website
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        {user && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate border-t border-border/50 mt-2 pt-2">
            {user.email}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-9 w-9"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-14 left-0 bottom-0 z-50 w-72 bg-card border-r border-border/50 flex flex-col transition-transform duration-300 ease-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border/50">
        <SidebarContent />
      </aside>
    </>
  );
}
