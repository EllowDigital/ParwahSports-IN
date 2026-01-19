import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
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

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
              From Our Blog
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Stories & Insights
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
            <Link to="/blogs">
              View All Blogs <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card 
              key={blog.id} 
              className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              {blog.featured_image_url ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={blog.featured_image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-primary/30" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {blog.content?.replace(/<[^>]*>/g, "").substring(0, 150) || "No content available."}...
                </p>
                <Button variant="link" className="px-0 mt-3 gap-1 text-primary">
                  Read More <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Blog Detail Dialog */}
      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBlog && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif pr-8">
                  {selectedBlog.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
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
                  className="w-full h-64 object-cover rounded-lg mt-4"
                />
              )}
              <div
                className="prose prose-neutral dark:prose-invert max-w-none mt-4"
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
