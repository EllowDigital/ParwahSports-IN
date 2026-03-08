import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Plus,
  Eye,
  IndianRupee,
  Clock,
  Award,
  Megaphone,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";

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
  donationAmount: number;
  members: number;
  volunteers: number;
}

interface RecentItem {
  id: string;
  type: "donation" | "volunteer" | "member" | "event";
  title: string;
  subtitle: string;
  time: string;
  icon: typeof Heart;
  color: string;
  bg: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    gallery: 0, events: 0, team: 0, news: 0, blogs: 0,
    announcements: 0, competitions: 0, students: 0,
    donations: 0, donationAmount: 0, members: 0, volunteers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          gallery, events, team, news, blogs, announcements,
          competitions, students, donations, members, volunteers,
          recentDonations, recentVolunteers, recentMembers,
        ] = await Promise.all([
          supabase.from("gallery_images").select("id", { count: "exact", head: true }),
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("team_members").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("news").select("id", { count: "exact", head: true }),
          supabase.from("blogs").select("id", { count: "exact", head: true }),
          supabase.from("announcements").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("competitions").select("id", { count: "exact", head: true }),
          supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("donations").select("id, amount", { count: "exact" }).eq("payment_status", "success"),
          supabase.from("members").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("volunteers").select("id", { count: "exact", head: true }),
          // Recent items
          supabase.from("donations").select("id, donor_name, amount, created_at").eq("payment_status", "success").order("created_at", { ascending: false }).limit(3),
          supabase.from("volunteers").select("id, full_name, area_of_interest, created_at").order("created_at", { ascending: false }).limit(3),
          supabase.from("members").select("id, full_name, created_at").order("created_at", { ascending: false }).limit(2),
        ]);

        const totalDonationAmount = (donations.data || []).reduce((sum, d) => sum + Number(d.amount), 0);

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
          donationAmount: totalDonationAmount,
          members: members.count ?? 0,
          volunteers: volunteers.count ?? 0,
        });

        // Build activity feed
        const activity: RecentItem[] = [
          ...(recentDonations.data || []).map((d) => ({
            id: d.id,
            type: "donation" as const,
            title: d.donor_name,
            subtitle: `Donated ₹${Number(d.amount).toLocaleString("en-IN")}`,
            time: d.created_at,
            icon: Heart,
            color: "text-red-500",
            bg: "bg-red-500/10",
          })),
          ...(recentVolunteers.data || []).map((v) => ({
            id: v.id,
            type: "volunteer" as const,
            title: v.full_name,
            subtitle: `Applied for ${v.area_of_interest}`,
            time: v.created_at,
            icon: Users,
            color: "text-lime-600",
            bg: "bg-lime-500/10",
          })),
          ...(recentMembers.data || []).map((m) => ({
            id: m.id,
            type: "member" as const,
            title: m.full_name,
            subtitle: "Became a member",
            time: m.created_at,
            icon: UserCheck,
            color: "text-teal-500",
            bg: "bg-teal-500/10",
          })),
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

        setRecentActivity(activity);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const highlightCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.donationAmount.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      href: "/admin/donations",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      description: `${stats.donations} successful donations`,
    },
    {
      title: "Active Members",
      value: stats.members,
      icon: UserCheck,
      href: "/admin/members",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      description: "Registered members",
    },
    {
      title: "Students",
      value: stats.students,
      icon: GraduationCap,
      href: "/admin/students",
      color: "text-violet-600",
      bg: "bg-violet-500/10",
      description: "Active students",
    },
    {
      title: "Volunteers",
      value: stats.volunteers,
      icon: Users,
      href: "/admin/volunteers",
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      description: "Total applications",
    },
  ];

  const contentCards = [
    { title: "News", value: stats.news, icon: Newspaper, href: "/admin/news", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Blogs", value: stats.blogs, icon: FileText, href: "/admin/blogs", color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Events", value: stats.events, icon: Calendar, href: "/admin/events", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Gallery", value: stats.gallery, icon: Image, href: "/admin/gallery", color: "text-pink-500", bg: "bg-pink-500/10" },
    { title: "Announcements", value: stats.announcements, icon: Bell, href: "/admin/announcements", color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Competitions", value: stats.competitions, icon: Trophy, href: "/admin/competitions", color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Team", value: stats.team, icon: Users, href: "/admin/team", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  const quickActions = [
    { title: "New Event", icon: Calendar, href: "/admin/events", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Add News", icon: Newspaper, href: "/admin/news", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "New Blog", icon: FileText, href: "/admin/blogs", color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Upload Certificate", icon: Award, href: "/admin/certificates", color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Add Competition", icon: Trophy, href: "/admin/competitions", color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Announcement", icon: Megaphone, href: "/admin/announcements", color: "text-red-500", bg: "bg-red-500/10" },
    { title: "Add Gallery", icon: Image, href: "/admin/gallery", color: "text-pink-500", bg: "bg-pink-500/10" },
    { title: "View Site", icon: Eye, href: "/", color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-6 lg:p-8">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Dashboard</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Here's what's happening with your organization.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link to="/"><Eye className="w-3.5 h-3.5" /> View Site</Link>
              </Button>
              <Button asChild size="sm" className="gap-1.5">
                <Link to="/admin/events"><Plus className="w-3.5 h-3.5" /> New Event</Link>
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlightCards.map((card) => (
            <Link key={card.title} to={card.href} className="group">
              <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 h-full">
                <CardContent className="p-4 lg:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${card.bg}`}>
                      <card.icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-20 mb-1" />
                  ) : (
                    <div className="text-xl lg:text-2xl font-bold text-foreground">{card.value}</div>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{card.title}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Quick Actions + Content Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      to={action.href}
                      target={action.title === "View Site" ? "_blank" : undefined}
                      className="group flex flex-col items-center justify-center p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all text-center"
                    >
                      <div className={`p-2 rounded-lg ${action.bg} group-hover:scale-110 transition-transform mb-1.5`}>
                        <action.icon className={`w-4 h-4 ${action.color}`} />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                        {action.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Overview */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Content Overview
                </CardTitle>
                <CardDescription className="text-xs">All your managed content at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {contentCards.map((stat) => (
                    <Link key={stat.title} to={stat.href} className="group">
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-accent/30 transition-all">
                        <div className={`p-1.5 rounded-lg ${stat.bg} shrink-0`}>
                          <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                          {isLoading ? (
                            <Skeleton className="h-5 w-8" />
                          ) : (
                            <div className="text-lg font-bold text-foreground leading-none">{stat.value}</div>
                          )}
                          <p className="text-[10px] text-muted-foreground truncate">{stat.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Recent Activity */}
          <div>
            <Card className="border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs">Latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentActivity.map((item, i) => (
                      <div key={item.id + item.type}>
                        <div className="flex items-start gap-3 py-2.5">
                          <div className={`p-1.5 rounded-lg ${item.bg} shrink-0 mt-0.5`}>
                            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                            {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                          </span>
                        </div>
                        {i < recentActivity.length - 1 && <Separator className="ml-9" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
