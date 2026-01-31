import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, ArrowRight, Calendar, User, Filter, Search, X, Grid, List } from "lucide-react";
import { format } from "date-fns";
import DOMPurify from "dompurify";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // Get unique authors for filter
  const authors = blogs
    ? [...new Set(blogs.map((blog) => blog.author).filter(Boolean))] as string[]
    : [];

  // Filter blogs
  const filteredBlogs = blogs?.filter((blog) => {
    const matchesSearch = !searchQuery || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAuthor = !selectedAuthor || blog.author === selectedAuthor;
    return matchesSearch && matchesAuthor;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAuthor(null);
  };

  const hasFilters = searchQuery || selectedAuthor;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="h-4 w-4" />
              Our Blog
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Stories & Insights
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Read inspiring stories, athlete journeys, and insights from our team.
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
              <span>Filter Blogs</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Author Filter */}
              {authors.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <Button
                    variant={selectedAuthor === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedAuthor(null)}
                    className="shrink-0"
                  >
                    All
                  </Button>
                  {authors.slice(0, 3).map((author) => (
                    <Button
                      key={author}
                      variant={selectedAuthor === author ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAuthor(author)}
                      className="shrink-0"
                    >
                      {author}
                    </Button>
                  ))}
                </div>
              )}

              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

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

      {/* Blogs Grid/List */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBlogs && filteredBlogs.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredBlogs.length}</span> blogs
                </p>
              </div>
              
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBlogs.map((blog) => (
                    <Card
                      key={blog.id}
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-card"
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
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredBlogs.map((blog) => (
                    <Card
                      key={blog.id}
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      <div className="flex flex-col md:flex-row">
                        {blog.featured_image_url ? (
                          <div className="md:w-64 lg:w-80 shrink-0">
                            <img
                              src={blog.featured_image_url}
                              alt={blog.title}
                              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="md:w-64 lg:w-80 shrink-0 h-48 md:h-auto bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                            <FileText className="h-16 w-16 text-primary/30" />
                          </div>
                        )}
                        <CardContent className="p-6 flex-1">
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
                          <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
                            {blog.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                            {blog.content?.replace(/<[^>]*>/g, "").substring(0, 250) || "No content available."}...
                          </p>
                          <Button variant="link" className="px-0 gap-1 text-primary">
                            Read More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Blogs Found</h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters ? "Try adjusting your filters" : "Check back soon for new content!"}
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
                  __html: DOMPurify.sanitize(selectedBlog.content || "<p>No content available.</p>"),
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
