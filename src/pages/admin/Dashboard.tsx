import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import {
  Image,
  Calendar,
  Users,
  Newspaper,
  FileText,
  Bell,
  Trophy,
  GraduationCap,
  Heart,
  CreditCard,
  UserCheck,
  ArrowUpRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  gallery: number;
  events: number;
  team: number;
  news: number;
  blogs: number;
  announcements: number;
  competitions: number;
  students: number;
  donations: number;
  members: number;
  volunteers: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    gallery: 0,
    events: 0,
    team: 0,
    news: 0,
    blogs: 0,
    announcements: 0,
    competitions: 0,
    students: 0,
    donations: 0,
    members: 0,
    volunteers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          gallery,
          events,
          team,
          news,
          blogs,
          announcements,
          competitions,
          students,
          donations,
          members,
          volunteers,
        ] = await Promise.all([
          supabase.from("gallery_images").select("id", { count: "exact", head: true }),
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase
            .from("team_members")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
          supabase.from("news").select("id", { count: "exact", head: true }),
          supabase.from("blogs").select("id", { count: "exact", head: true }),
          supabase
            .from("announcements")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
          supabase.from("competitions").select("id", { count: "exact", head: true }),
          supabase
            .from("students")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
          supabase
            .from("donations")
            .select("id", { count: "exact", head: true })
            .eq("payment_status", "success"),
          supabase
            .from("members")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
          supabase.from("volunteers").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          gallery: gallery.count ?? 0,
          events: events.count ?? 0,
          team: team.count ?? 0,
          news: news.count ?? 0,
          blogs: blogs.count ?? 0,
          announcements: announcements.count ?? 0,
          competitions: competitions.count ?? 0,
          students: students.count ?? 0,
          donations: donations.count ?? 0,
          members: members.count ?? 0,
          volunteers: volunteers.count ?? 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "News Articles",
      value: stats.news,
      icon: Newspaper,
      href: "/admin/news",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Blog Posts",
      value: stats.blogs,
      icon: FileText,
      href: "/admin/blogs",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Announcements",
      value: stats.announcements,
      icon: Bell,
      href: "/admin/announcements",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Events",
      value: stats.events,
      icon: Calendar,
      href: "/admin/events",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Gallery Images",
      value: stats.gallery,
      icon: Image,
      href: "/admin/gallery",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
    {
      title: "Competitions",
      value: stats.competitions,
      icon: Trophy,
      href: "/admin/competitions",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Team Members",
      value: stats.team,
      icon: Users,
      href: "/admin/team",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Students",
      value: stats.students,
      icon: GraduationCap,
      href: "/admin/students",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Donations",
      value: stats.donations,
      icon: Heart,
      href: "/admin/donations",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Members",
      value: stats.members,
      icon: UserCheck,
      href: "/admin/members",
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      title: "Volunteers",
      value: stats.volunteers,
      icon: CreditCard,
      href: "/admin/volunteers",
      color: "text-lime-500",
      bg: "bg-lime-500/10",
    },
  ];

  const quickActions = [
    { title: "Add News", icon: Newspaper, href: "/admin/news", color: "text-blue-500" },
    { title: "Add Event", icon: Calendar, href: "/admin/events", color: "text-emerald-500" },
    { title: "Add Blog", icon: FileText, href: "/admin/blogs", color: "text-violet-500" },
    { title: "View Site", icon: ArrowUpRight, href: "/", external: true, color: "text-primary" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-6 lg:p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard Overview</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Manage your NGO's content, events, and community from this central hub.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Stats Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Content Overview</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {statCards.map((stat) => (
              <Link key={stat.title} to={stat.href} className="group">
                <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mb-1" />
                    ) : (
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    )}
                    <p className="text-xs text-muted-foreground truncate">{stat.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/50 transition-all duration-300 text-center"
                >
                  <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors mb-2">
                    <action.icon
                      className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform`}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.title}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
