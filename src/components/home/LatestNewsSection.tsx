import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
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
  const { data: news, isLoading } = useQuery({
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-16 w-full mb-3" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!news || news.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                Latest News
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Stay Updated
              </h2>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
              <Link to="/news">
                All News <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {news.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 80}>
              <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full border-border hover:border-primary/20 ${
                index === 0 ? "sm:col-span-2" : ""
              }`}>
                <CardContent className={`p-5 lg:p-6 h-full flex flex-col ${index === 0 ? "sm:flex-row sm:gap-6" : ""}`}>
                  {index === 0 && (
                    <div className="sm:w-16 sm:shrink-0 mb-4 sm:mb-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Newspaper className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <h3 className={`font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 ${
                      index === 0 ? "text-lg lg:text-xl" : "text-base"
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-muted-foreground line-clamp-3 flex-1 ${
                      index === 0 ? "text-sm lg:text-base" : "text-sm"
                    }`}>
                      {item.description || "No description available."}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(item.publish_date), "MMM d, yyyy")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
