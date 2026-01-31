import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface NewsItem {
  id: string;
  title: string;
  description: string | null;
  publish_date: string;
}

export function LatestNewsSection() {
  const { data: newsItems, isLoading } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("status", "published")
        .order("publish_date", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data as NewsItem[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <Card>
                <CardContent className="p-8">
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  const [featuredNews, ...otherNews] = newsItems;

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
              Latest Updates
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              News & Announcements
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
            <Link to="/news">
              View All News <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Featured News */}
          <Card className="lg:col-span-7 group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8 lg:p-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                {format(new Date(featuredNews.publish_date), "MMMM d, yyyy")}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                {featuredNews.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed line-clamp-4">
                {featuredNews.description || "No description available."}
              </p>
              <Button asChild variant="link" className="px-0 mt-6 gap-2 text-primary">
                <Link to="/news">
                  Read Full Story <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Other News */}
          <div className="lg:col-span-5 space-y-4">
            {otherNews.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(item.publish_date), "MMM d, yyyy")}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {item.description || "No description available."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
