import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { ScrollReveal, StaggerReveal } from "@/components/ui/scroll-reveal";
import {
  X,
  Image as ImageIcon,
  Search,
  Grid3X3,
  LayoutList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean | null;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: images, isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  // Get unique categories from database
  const categories = useMemo(() => {
    const cats = [
      "All",
      ...new Set(images?.map((img) => img.category).filter(Boolean) as string[]),
    ];
    return cats;
  }, [images]);

  // Filter images
  const filteredImages = useMemo(() => {
    let result = images || [];

    if (selectedCategory !== "All") {
      result = result.filter((img) => img.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (img) =>
          img.title.toLowerCase().includes(query) ||
          img.description?.toLowerCase().includes(query) ||
          img.category?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [images, selectedCategory, searchQuery]);

  // Lightbox navigation
  const openLightbox = (image: GalleryImage, index: number) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!filteredImages) return;
    const newIndex =
      direction === "next"
        ? (lightboxIndex + 1) % filteredImages.length
        : (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(filteredImages[newIndex]);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <Layout>
      <SEOHead
        title="Sports Gallery - Photos & Moments | Parwah Sports"
        description="Explore our gallery of sports events, training sessions, tournaments, and community moments captured by Parwah Sports Charitable Trust."
        path="/gallery"
        keywords="sports gallery, sports photos, training pictures, tournament images, Parwah Sports gallery"
      />
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
                Gallery
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Journey in Pictures
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore moments from our events, training sessions, and community programs
              </p>
            </div>
          </ScrollReveal>

          {/* Filter Bar */}
          <ScrollReveal delay={100}>
            <div className="bg-card rounded-2xl shadow-lg border border-border p-4 md:p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 w-full lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "masonry" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("masonry")}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">{filteredImages?.length || 0}</span>{" "}
                  images
                  {(selectedCategory !== "All" || searchQuery) && (
                    <Button
                      variant="link"
                      className="text-primary p-0 ml-2 h-auto"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  )}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div
              className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "columns-2 md:columns-3 lg:columns-4"}`}
            >
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : filteredImages?.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-16">
                <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {images?.length === 0 ? "Gallery Coming Soon" : "No Images Found"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {images?.length === 0
                    ? "Check back soon for photos from our events!"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {(selectedCategory !== "All" || searchQuery) && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </ScrollReveal>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
              }
            >
              {filteredImages?.map((image, index) => (
                <ScrollReveal
                  key={image.id}
                  delay={index * 50}
                  className={viewMode === "masonry" ? "break-inside-avoid" : ""}
                >
                  <div
                    onClick={() => openLightbox(image, index)}
                    className="relative overflow-hidden rounded-xl cursor-pointer group"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                        viewMode === "grid" ? "aspect-square" : "h-auto"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <span className="text-background font-medium block">{image.title}</span>
                      {image.category && (
                        <Badge variant="secondary" className="w-fit mt-2">
                          {image.category}
                        </Badge>
                      )}
                    </div>
                    {image.is_featured && (
                      <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors z-10"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation Arrows */}
          {filteredImages && filteredImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center text-background transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("prev");
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center text-background transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("next");
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.image_url}
              alt={lightboxImage.title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <h3 className="text-background text-xl font-semibold">{lightboxImage.title}</h3>
              {lightboxImage.description && (
                <p className="text-background/70 mt-2 max-w-2xl mx-auto">
                  {lightboxImage.description}
                </p>
              )}
              {lightboxImage.category && (
                <Badge variant="secondary" className="mt-3">
                  {lightboxImage.category}
                </Badge>
              )}
              {filteredImages && filteredImages.length > 1 && (
                <p className="text-background/50 text-sm mt-4">
                  {lightboxIndex + 1} / {filteredImages.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
