import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Image, Calendar, Users, TrendingUp } from "lucide-react";

interface Stats {
  totalImages: number;
  totalEvents: number;
  totalTeamMembers: number;
  upcomingEvents: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalImages: 0,
    totalEvents: 0,
    totalTeamMembers: 0,
    upcomingEvents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [imagesRes, eventsRes, teamRes, upcomingRes] = await Promise.all([
          supabase.from("gallery_images").select("id", { count: "exact", head: true }),
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("team_members").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "upcoming"),
        ]);

        setStats({
          totalImages: imagesRes.count ?? 0,
          totalEvents: eventsRes.count ?? 0,
          totalTeamMembers: teamRes.count ?? 0,
          upcomingEvents: upcomingRes.count ?? 0,
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
      title: "Gallery Images",
      value: stats.totalImages,
      icon: Image,
      description: "Total images in gallery",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Events",
      value: stats.totalEvents,
      icon: Calendar,
      description: "Total events created",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Team Members",
      value: stats.totalTeamMembers,
      icon: Users,
      description: "Active team members",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: TrendingUp,
      description: "Events scheduled",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the Parwah Sports Charitable Trust admin panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <a
                href="/admin/gallery"
                className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-center"
              >
                <Image className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Add Image</span>
              </a>
              <a
                href="/admin/events"
                className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-center"
              >
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Create Event</span>
              </a>
              <a
                href="/admin/team"
                className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-center"
              >
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Add Member</span>
              </a>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-center"
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">View Site</span>
              </a>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Tips for managing your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add images to your gallery to showcase your events and activities
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create events to keep your community informed about upcoming activities
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your team members to display them on your website
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
