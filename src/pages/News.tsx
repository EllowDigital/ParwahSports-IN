import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Newspaper, ArrowRight, Calendar, Filter, Search, X } from "lucide-react";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  description: string | null;
  publish_date: string;
}

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

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

  // Get unique years for filter
  const years = newsItems
    ? [...new Set(newsItems.map((item) => new Date(item.publish_date).getFullYear().toString()))]
    : [];

  // Filter news items
  const filteredNews = newsItems?.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear =
      !selectedYear || new Date(item.publish_date).getFullYear().toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedYear(null);
  };

  const hasFilters = searchQuery || selectedYear;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Newspaper className="h-4 w-4" />
              Latest Updates
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              News & Announcements
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stay updated with the latest news, achievements, and announcements from Parwah Sports.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-background border-b border-border sticky top-16 lg:top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter News</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Year Filter */}
              {years.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <Button
                    variant={selectedYear === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(null)}
                    className="shrink-0"
                  >
                    All
                  </Button>
                  {years.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedYear(year)}
                      className="shrink-0"
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              )}

              {/* Clear Filters */}
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNews && filteredNews.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredNews.length}</span>{" "}
                  results
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item, index) => (
                  <Card
                    key={item.id}
                    className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-card ${
                      index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                    }`}
                  >
                    <CardContent className={`p-6 ${index === 0 ? "lg:p-8" : ""}`}>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(item.publish_date), "MMMM d, yyyy")}
                      </div>
                      <h3
                        className={`font-semibold text-foreground mb-3 group-hover:text-primary transition-colors ${
                          index === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-muted-foreground leading-relaxed ${
                          index === 0 ? "line-clamp-4" : "line-clamp-3"
                        }`}
                      >
                        {item.description || "No description available."}
                      </p>
                      {index === 0 && (
                        <Button variant="link" className="px-0 mt-4 gap-1 text-primary">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Newspaper className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No News Found</h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters ? "Try adjusting your filters" : "Check back soon for updates!"}
              </p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
