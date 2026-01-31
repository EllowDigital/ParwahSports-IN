import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Trophy, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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

const stats = [
  { value: "150+", label: "Athletes", icon: Users },
  { value: "25+", label: "Schools", icon: Trophy },
  { value: "10+", label: "Districts", icon: Heart },
];

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => { api.off("select", onSelect); };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused) return;
    const intervalId = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(intervalId);
  }, [api, isPaused]);

  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <Carousel setApi={setApi} opts={{ loop: true }} className="h-full w-full">
          <CarouselContent className="h-full ml-0">
            {sliderImages.map((src, index) => (
              <CarouselItem key={src} className="h-full pl-0">
                <div className="relative h-full w-full">
                  <img
                    src={src}
                    alt={`Sports highlight ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                      activeIndex === index ? "scale-110" : "scale-100"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/75 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground/70" />
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-4 lg:inset-x-8 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
        <button
          onClick={scrollPrev}
          className="pointer-events-auto w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 flex items-center justify-center text-background hover:bg-background/20 transition-all hover:scale-105"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        <button
          onClick={scrollNext}
          className="pointer-events-auto w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 flex items-center justify-center text-background hover:bg-background/20 transition-all hover:scale-105"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-1.5 bg-background/10 backdrop-blur-sm rounded-full px-3 py-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-6 h-2 bg-secondary"
                  : "w-2 h-2 bg-background/40 hover:bg-background/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in border border-secondary/30">
            <Sparkles className="h-4 w-4" />
            Empowering Athletes Since 2015
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Transforming Dreams{" "}
            <span className="relative">
              <span className="text-secondary">Into Champions</span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-secondary/50 rounded-full" />
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-background/80 leading-relaxed mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
            Supporting young athletes across India with world-class training, resources, and mentorship to help them shine on national and international stages.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Link to="/donate">
                <Heart className="h-5 w-5" />
                Donate Now
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/30 bg-background/10 backdrop-blur-sm text-background hover:bg-background/20 gap-2"
            >
              <Link to="/volunteer">
                <Users className="h-5 w-5" />
                Volunteer
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-background hover:bg-background/10 gap-2 group"
            >
              <Link to="/about">
                Learn More
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="inline-flex flex-wrap gap-4 sm:gap-6 lg:gap-8 rounded-2xl bg-background/95 backdrop-blur-md border border-border shadow-2xl px-5 sm:px-8 py-5">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-none">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="w-px h-10 bg-border ml-4 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />
    </section>
  );
}
