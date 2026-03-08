import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
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
  UserCheck,
  Activity,
  Plus,
  Eye,
  IndianRupee,
  Award,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router-dom";

import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import { QuickActionsCard } from "@/components/admin/dashboard/QuickActionsCard";
import { ContentOverviewCard } from "@/components/admin/dashboard/ContentOverviewCard";
import { RecentActivityCard } from "@/components/admin/dashboard/RecentActivityCard";
import { UpcomingEventsCard } from "@/components/admin/dashboard/UpcomingEventsCard";
import { RecentDonationsCard } from "@/components/admin/dashboard/RecentDonationsCard";
import { RecentVolunteersCard } from "@/components/admin/dashboard/RecentVolunteersCard";
import { DonationTrendChart } from "@/components/admin/dashboard/DonationTrendChart";

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
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentDonationsList, setRecentDonationsList] = useState<any[]>([]);
  const [recentVolunteersList, setRecentVolunteersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const [
          gallery, events, team, news, blogs, announcements,
          competitions, students, donations, members, volunteers,
          recentDonations, recentVolunteers, recentMembers,
          upcomingEventsData, donationsTableData, volunteersTableData,
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
          // Activity feed items
          supabase.from("donations").select("id, donor_name, amount, created_at").eq("payment_status", "success").order("created_at", { ascending: false }).limit(3),
          supabase.from("volunteers").select("id, full_name, area_of_interest, created_at").order("created_at", { ascending: false }).limit(3),
          supabase.from("members").select("id, full_name, created_at").order("created_at", { ascending: false }).limit(2),
          // New data for extra widgets
          supabase.from("events").select("id, title, event_date, location, status, is_featured").gte("event_date", today).order("event_date", { ascending: true }).limit(5),
          supabase.from("donations").select("id, donor_name, donor_email, amount, payment_status, created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("volunteers").select("id, full_name, email, phone, area_of_interest, status, created_at").order("created_at", { ascending: false }).limit(4),
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

        setUpcomingEvents(upcomingEventsData.data || []);
        setRecentDonationsList(donationsTableData.data || []);
        setRecentVolunteersList(volunteersTableData.data || []);

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
            <MetricCard key={card.title} {...card} isLoading={isLoading} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Quick Actions + Content Stats */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActionsCard actions={quickActions} />
            <ContentOverviewCard contentCards={contentCards} isLoading={isLoading} />
          </div>

          {/* Right: Recent Activity */}
          <div>
            <RecentActivityCard activity={recentActivity} isLoading={isLoading} />
          </div>
        </div>

        {/* Second Row: Chart + Events */}
        <div className="grid lg:grid-cols-2 gap-6">
          <DonationTrendChart />
          <UpcomingEventsCard events={upcomingEvents} isLoading={isLoading} />
        </div>

        {/* Third Row: Donations + Volunteers */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RecentDonationsCard donations={recentDonationsList} isLoading={isLoading} />
          <RecentVolunteersCard volunteers={recentVolunteersList} isLoading={isLoading} />
        </div>

        {/* Fourth Row: Volunteers */}
        <RecentVolunteersCard volunteers={recentVolunteersList} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
}
