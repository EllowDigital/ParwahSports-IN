import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface BlogItem {
  id: string;
  title: string;
  content: string | null;
  featured_image_url: string | null;
  author: string | null;
  publish_date: string;
}

export default function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published")
        .order("publish_date", { ascending: false });
      if (error) throw error;
      return data as BlogItem[];
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="h-4 w-4" />
              Our Stories
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog & Articles
            </h1>
            <p className="text-lg text-muted-foreground">
              Inspiring stories, insights, and updates from our community
            </p>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs?.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Blogs Yet</h3>
              <p className="text-muted-foreground">Check back soon for inspiring stories!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs?.map((blog) => (
                <Card
                  key={blog.id}
                  className="group overflow-hidden hover:shadow-xl transition-all border-border/50"
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
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <CardHeader>
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
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {blog.content?.replace(/<[^>]*>/g, "").substring(0, 150) ||
                        "No content available."}
                      ...
                    </p>
                    <Button
                      variant="ghost"
                      className="gap-2 p-0 h-auto text-primary"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      Read More <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

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
    </Layout>
  );
}
