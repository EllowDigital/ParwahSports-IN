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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useState } from "react";

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
      { name: "Events", href: "/admin/events", icon: Calendar },
      { name: "Competitions", href: "/admin/competitions", icon: Trophy },
    ],
  },
  {
    title: "People",
    items: [
      { name: "Team", href: "/admin/team", icon: Users },
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

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-6 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">P</span>
        </div>
        <div>
          <h2 className="font-semibold text-foreground text-sm">Parwah Trust</h2>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/80">
              {section.title}
            </div>
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-border space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Home className="w-5 h-5" />
          View Website
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        {user && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">P</span>
          </div>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside
        className={cn(
          "lg:hidden fixed top-14 left-0 bottom-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <SidebarContent />
      </aside>
    </>
  );
}
