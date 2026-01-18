import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, Calendar } from "lucide-react";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  description: string | null;
  publish_date: string;
}

export default function News() {
  const { data: newsItems, isLoading } = useQuery({
    queryKey: ["public-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("status", "published")
        .order("publish_date", { ascending: false });
      if (error) throw error;
      return data as NewsItem[];
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Newspaper className="h-4 w-4" />
              Stay Updated
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              News & Updates
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay informed about our latest activities, achievements, and announcements
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : newsItems?.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No News Yet</h3>
              <p className="text-muted-foreground">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems?.map((item) => (
                <Card
                  key={item.id}
                  className="group hover:shadow-lg transition-shadow border-border/50"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(item.publish_date), "MMMM d, yyyy")}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-4">
                      {item.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
