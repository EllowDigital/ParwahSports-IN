import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, ArrowRight, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface BlogItem {
  id: string;
  title: string;
  content: string | null;
  featured_image_url: string | null;
  author: string | null;
  publish_date: string;
}

export function RecentBlogsSection() {
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["recent-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published")
        .order("publish_date", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as BlogItem[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                From Our Blog
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Stories & Insights
              </h2>
            </div>
            <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
              <Link to="/blogs">
                View All Blogs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <ScrollReveal key={blog.id} delay={index * 100}>
              <Card
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-card h-full"
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="relative">
                  {blog.featured_image_url ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={blog.featured_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                      {format(new Date(blog.publish_date), "MMM d")}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(blog.publish_date), "MMM d, yyyy")}
                    </span>
                    {blog.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {blog.author}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-3">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {blog.content?.replace(/<[^>]*>/g, "").substring(0, 150) || "No content available."}...
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                    Read More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Blog Detail Dialog */}
      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBlog && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif pr-8 leading-tight">
                  {selectedBlog.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(selectedBlog.publish_date), "MMMM d, yyyy")}
                  </span>
                  {selectedBlog.author && (
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedBlog.author}
                    </span>
                  )}
                </div>
              </DialogHeader>
              {selectedBlog.featured_image_url && (
                <img
                  src={selectedBlog.featured_image_url}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-xl mt-4"
                />
              )}
              <div
                className="prose prose-neutral dark:prose-invert max-w-none mt-6"
                dangerouslySetInnerHTML={{
                  __html: selectedBlog.content || "<p>No content available.</p>",
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
