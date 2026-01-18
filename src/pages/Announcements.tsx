import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "normal" | "important" | "urgent";
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const priorityConfig = {
  normal: {
    icon: Info,
    badge: "secondary" as const,
    bgClass: "bg-secondary/10 border-secondary/20",
  },
  important: {
    icon: AlertCircle,
    badge: "default" as const,
    bgClass: "bg-primary/10 border-primary/20",
  },
  urgent: {
    icon: AlertTriangle,
    badge: "destructive" as const,
    bgClass: "bg-destructive/10 border-destructive/20",
  },
};

export default function Announcements() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["public-announcements"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .or(`start_date.is.null,start_date.lte.${today}`)
        .or(`end_date.is.null,end_date.gte.${today}`)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Announcement[];
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Bell className="h-4 w-4" />
              Important Notices
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Announcements
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay informed about important updates, notices, and alerts
            </p>
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : announcements?.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Active Announcements
              </h3>
              <p className="text-muted-foreground">Check back later for updates!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements?.map((announcement) => {
                const config = priorityConfig[announcement.priority];
                const Icon = config.icon;

                return (
                  <Card
                    key={announcement.id}
                    className={`border-2 ${config.bgClass} transition-shadow hover:shadow-md`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              announcement.priority === "urgent"
                                ? "bg-destructive/20"
                                : announcement.priority === "important"
                                  ? "bg-primary/20"
                                  : "bg-secondary/20"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                announcement.priority === "urgent"
                                  ? "text-destructive"
                                  : announcement.priority === "important"
                                    ? "text-primary"
                                    : "text-secondary-foreground"
                              }`}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(new Date(announcement.created_at), "MMMM d, yyyy")}
                              {announcement.end_date && (
                                <> · Ends {format(new Date(announcement.end_date), "MMM d, yyyy")}</>
                              )}
                            </p>
                          </div>
                        </div>
                        <Badge variant={config.badge} className="capitalize shrink-0">
                          {announcement.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground whitespace-pre-wrap">{announcement.message}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
