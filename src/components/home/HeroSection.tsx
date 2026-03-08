import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Users,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
} from "lucide-react";
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
  { value: "150+", label: "Athletes Trained", icon: Users },
  { value: "25+", label: "Partner Schools", icon: Trophy },
  { value: "10+", label: "Districts Reached", icon: Heart },
];

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="h-full w-full [&>div]:h-full [&>div>div]:h-full"
        >
          <CarouselContent className="h-full ml-0">
            {sliderImages.map((src, index) => (
              <CarouselItem key={src} className="h-full pl-0 basis-full">
                <div className="relative h-full w-full min-h-[100svh]">
                  <img
                    src={src}
                    alt={`Sports highlight ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                      activeIndex === index ? "scale-110" : "scale-100"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Gradient Overlays - more cinematic */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-transparent to-foreground/80" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,hsl(var(--foreground)/0.4)_100%)]" />
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-4 lg:inset-x-8 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
        <button
          onClick={scrollPrev}
          className="pointer-events-auto w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-background/10 backdrop-blur-md border border-background/20 flex items-center justify-center text-background hover:bg-background/25 transition-all hover:scale-110 active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        <button
          onClick={scrollNext}
          className="pointer-events-auto w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-background/10 backdrop-blur-md border border-background/20 flex items-center justify-center text-background hover:bg-background/25 transition-all hover:scale-110 active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
      </div>

      {/* Slide Progress Indicators */}
      <div className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-background/10 backdrop-blur-md rounded-full px-4 py-2.5 border border-background/10">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className="relative rounded-full overflow-hidden transition-all duration-500"
              style={{ width: activeIndex === index ? 28 : 8, height: 8 }}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                activeIndex === index ? "bg-secondary" : "bg-background/40 hover:bg-background/60"
              }`} />
              {activeIndex === index && (
                <span className="absolute inset-0 rounded-full bg-secondary/50 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-0">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-md text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-secondary/30 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            Empowering Athletes Since 2015
          </div>

          {/* Headline */}
          <h1
            className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-[1.08] mb-6 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Transforming Dreams{" "}
            <span className="relative inline-block">
              <span className="text-secondary">Into Champions</span>
              <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-secondary/80 to-transparent rounded-full" />
            </span>
          </h1>

          {/* Subtext */}
          <p
            className={`text-base sm:text-lg md:text-xl text-background/80 leading-relaxed mb-8 max-w-2xl transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Supporting young athletes across India with world-class training, resources, and
            mentorship to help them shine on national and international stages.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-base px-7 py-6"
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
              className="border-background/30 bg-background/10 backdrop-blur-md text-background hover:bg-background/20 gap-2 px-7 py-6 text-base"
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
              className="text-background hover:bg-background/10 gap-2 group px-7 py-6 text-base"
            >
              <Link to="/about">
                Learn More
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Stats Bar - Glassmorphism */}
          <div
            className={`transition-all duration-700 delay-[400ms] ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex flex-wrap gap-6 sm:gap-8 lg:gap-10 rounded-2xl bg-background/95 backdrop-blur-lg border border-border/80 shadow-2xl px-6 sm:px-8 lg:px-10 py-6">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/10">
                    <stat.icon className="h-5 w-5 lg:h-5.5 lg:w-5.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-none tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="w-px h-10 bg-border/60 ml-3 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 right-8 z-20 hidden lg:flex flex-col items-center gap-2 transition-all duration-700 delay-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}>
        <span className="text-background/50 text-[10px] uppercase tracking-widest font-medium rotate-90 origin-center translate-x-4 mb-6">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-background/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-background/60 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent z-0 pointer-events-none" />
    </section>
  );
}
