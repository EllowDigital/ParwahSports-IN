import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import DOMPurify from "dompurify";

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-44 w-full" />
                <CardContent className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                Our Blog
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Stories & Insights
              </h2>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
              <Link to="/blogs">
                All Blogs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {blogs.map((blog, index) => (
            <ScrollReveal key={blog.id} delay={index * 80}>
              <Card
                className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
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
                      <FileText className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(blog.publish_date), "MMM d, yyyy")}
                    </span>
                    {blog.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {blog.author}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {blog.content?.replace(/<[^>]*>/g, "").substring(0, 100) || "No content available."}...
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read More <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Blog Detail Dialog */}
      {selectedBlog && (
        <Dialog open={true} onOpenChange={() => setSelectedBlog(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl lg:text-2xl font-serif pr-8 leading-tight">
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
                className="w-full h-56 object-cover rounded-xl mt-4"
              />
            )}
            <div
              className="prose prose-neutral dark:prose-invert max-w-none mt-4"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(selectedBlog.content || "<p>No content available.</p>"),
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
