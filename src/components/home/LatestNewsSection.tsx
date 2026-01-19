import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";
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
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
              Latest Updates
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              News & Announcements
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
            <Link to="/news">
              View All News <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <Card 
              key={item.id} 
              className={`group hover:shadow-lg transition-shadow ${
                index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <CardHeader className={index === 0 ? "pb-4" : "pb-2"}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(item.publish_date), "MMMM d, yyyy")}
                </div>
                <CardTitle className={`${index === 0 ? "text-2xl" : "text-lg"} line-clamp-2 group-hover:text-primary transition-colors`}>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-muted-foreground ${index === 0 ? "line-clamp-4" : "line-clamp-3"}`}>
                  {item.description || "No description available."}
                </p>
                {index === 0 && (
                  <Button asChild variant="link" className="px-0 mt-4 gap-1">
                    <Link to="/news">
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
