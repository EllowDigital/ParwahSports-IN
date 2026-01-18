import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
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
} from "lucide-react";

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
        const [gallery, events, team, news, blogs, announcements, competitions, students, donations, members, volunteers] =
          await Promise.all([
            supabase.from("gallery_images").select("id", { count: "exact", head: true }),
            supabase.from("events").select("id", { count: "exact", head: true }),
            supabase.from("team_members").select("id", { count: "exact", head: true }).eq("is_active", true),
            supabase.from("news").select("id", { count: "exact", head: true }),
            supabase.from("blogs").select("id", { count: "exact", head: true }),
            supabase.from("announcements").select("id", { count: "exact", head: true }).eq("is_active", true),
            supabase.from("competitions").select("id", { count: "exact", head: true }),
            supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
            supabase.from("donations").select("id", { count: "exact", head: true }).eq("payment_status", "success"),
            supabase.from("members").select("id", { count: "exact", head: true }).eq("is_active", true),
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
    { title: "News", value: stats.news, icon: Newspaper, href: "/admin/news" },
    { title: "Blogs", value: stats.blogs, icon: FileText, href: "/admin/blogs" },
    { title: "Announcements", value: stats.announcements, icon: Bell, href: "/admin/announcements" },
    { title: "Events", value: stats.events, icon: Calendar, href: "/admin/events" },
    { title: "Gallery", value: stats.gallery, icon: Image, href: "/admin/gallery" },
    { title: "Competitions", value: stats.competitions, icon: Trophy, href: "/admin/competitions" },
    { title: "Team Members", value: stats.team, icon: Users, href: "/admin/team" },
    { title: "Students", value: stats.students, icon: GraduationCap, href: "/admin/students" },
    { title: "Donations", value: stats.donations, icon: Heart, href: "/admin/donations" },
    { title: "Members", value: stats.members, icon: UserCheck, href: "/admin/members" },
    { title: "Volunteers", value: stats.volunteers, icon: CreditCard, href: "/admin/volunteers" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of all CMS sections</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <a key={stat.title} href={stat.href}>
              <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {isLoading ? "..." : stat.value}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a href="/admin/news" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-center">
              <Newspaper className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Add News</span>
            </a>
            <a href="/admin/events" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Add Event</span>
            </a>
            <a href="/admin/blogs" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Add Blog</span>
            </a>
            <a href="/" target="_blank" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-center">
              <Image className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">View Site</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
