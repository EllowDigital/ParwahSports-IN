import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const sliderImages = [
  "/images/slider/C1.jpeg",
  "/images/slider/C2.jpg",
  "/images/slider/E4.jpeg",
  "/images/slider/E5.jpeg",
  "/images/slider/E6.jpeg",
  "/images/slider/P1.jpeg",
  "/images/slider/P2.jpeg",
  "/images/slider/P3.jpeg",
  "/images/slider/P4.jpeg",
  "/images/slider/P5.jpeg",
  "/images/slider/P6.jpeg",
  "/images/slider/P7.jpeg",
  "/images/slider/P8.jpeg",
  "/images/slider/P9.jpeg",
];

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [api]);

  return (
    <section className="relative flex items-center overflow-hidden py-10 sm:py-14 lg:py-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="h-full w-full"
          aria-label="Hero highlights"
        >
          <CarouselContent className="h-full ml-0">
            {sliderImages.map((src, index) => (
              <CarouselItem key={src} className="h-full pl-0">
                <img
                  src={src}
                  alt={`Parwah Sports highlight ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-6 animate-fade-in">
            <Trophy className="h-4 w-4" />
            Empowering Athletes Since 2015
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-tight mb-5 sm:mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Empowering Athletes.{" "}
            <span className="text-secondary">Transforming Dreams</span> into Champions.
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-background/80 leading-relaxed mb-7 sm:mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            We support young and underprivileged athletes across India with world-class training, 
            financial assistance, and mentorship to help them shine on the national and international stage.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 text-base px-8">
              <Link to="/get-involved">
                <Heart className="h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background gap-2 text-base px-8"
            >
              <Link to="/get-involved">
                <Users className="h-5 w-5" />
                Become a Volunteer
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto text-background hover:bg-background/10 gap-2 text-base">
              <Link to="/what-we-do">
                Explore Our Work
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div
            className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-6 rounded-2xl bg-foreground/35 backdrop-blur-sm border border-background/10 px-4 py-4 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "150+", label: "Athletes Supported" },
              { value: "25+", label: "Partner Schools" },
              { value: "10+", label: "Districts Reached" },
            ].map((stat, i) => (
              <div key={i} className={i === 2 ? "text-background col-span-2 sm:col-span-1" : "text-background"}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">{stat.value}</div>
                <div className="text-sm text-background/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center gap-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={
              "h-2.5 w-2.5 rounded-full transition-all bg-background/40 hover:bg-background/70 " +
              (activeIndex === index ? "w-7 bg-secondary" : "")
            }
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />
    </section>
  );
}
