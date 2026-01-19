import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { X, Image as ImageIcon } from "lucide-react";
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
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

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
  const categories = ["All", ...new Set(images?.map((img) => img.category).filter(Boolean) as string[])];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images?.filter((img) => img.category === selectedCategory);

  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
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

          {isLoading ? (
            <>
              <div className="flex justify-center gap-2 mb-12 flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </>
          ) : images?.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Gallery Coming Soon</h3>
              <p className="text-muted-foreground">Check back soon for photos from our events!</p>
            </div>
          ) : (
            <>
              {categories.length > 1 && (
                <div className="flex justify-center gap-2 mb-12 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages?.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => setLightboxImage(image)}
                    className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end p-4">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-background font-medium block">{image.title}</span>
                        {image.category && (
                          <span className="text-background/70 text-sm">{image.category}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.image_url}
              alt={lightboxImage.title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <h3 className="text-background text-xl font-semibold">{lightboxImage.title}</h3>
              {lightboxImage.description && (
                <p className="text-background/70 mt-2">{lightboxImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
