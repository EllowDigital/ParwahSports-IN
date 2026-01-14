import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { X } from "lucide-react";
import heroImage from "@/assets/hero-athletes.jpg";
import trainingImage from "@/assets/training-session.jpg";
import communityImage from "@/assets/community-event.jpg";
import victoryImage from "@/assets/victory-moment.jpg";

const images = [
  { src: heroImage, category: "Training", title: "Athletes in Action" },
  { src: trainingImage, category: "Training", title: "Martial Arts Session" },
  { src: communityImage, category: "Events", title: "Community Sports Day" },
  { src: victoryImage, category: "Competitions", title: "Victory Moment" },
  { src: trainingImage, category: "Training", title: "Group Training" },
  { src: communityImage, category: "Community", title: "School Program" },
  { src: heroImage, category: "Competitions", title: "Championship" },
  { src: victoryImage, category: "Competitions", title: "Medal Ceremony" },
];

const categories = ["All", "Training", "Events", "Competitions", "Community"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages = selectedCategory === "All" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Gallery</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">Our Journey in Pictures</h1>
          </div>

          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                onClick={() => setLightboxImage(image.src)}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
              >
                <img src={image.src} alt={image.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end p-4">
                  <span className="text-background opacity-0 group-hover:opacity-100 font-medium transition-opacity">{image.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-4 right-4 text-background" onClick={() => setLightboxImage(null)}><X className="h-8 w-8" /></button>
          <img src={lightboxImage} alt="Lightbox" className="max-w-full max-h-[90vh] rounded-xl" />
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
