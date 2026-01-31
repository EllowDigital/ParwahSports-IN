import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Trophy, Play, ChevronLeft, ChevronRight } from "lucide-react";
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
  { value: "150+", label: "Athletes Supported", icon: Users },
  { value: "25+", label: "Partner Schools", icon: Trophy },
  { value: "10+", label: "Districts Reached", icon: Heart },
];

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const indicatorRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [api, isPaused]);

  useEffect(() => {
    indicatorRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  return (
    <section
      className="relative min-h-[calc(100svh-4rem)] lg:min-h-[calc(100svh-5rem)] flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="h-full w-full"
          aria-label="Hero highlights"
        >
          <CarouselContent className="h-full ml-0">
            {sliderImages.map((src, index) => (
              <CarouselItem key={src} className="h-full pl-0 relative">
                <img
                  src={src}
                  alt={`Parwah Sports highlight ${index + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                    activeIndex === index ? "scale-110" : "scale-100"
                  }`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Modern Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 flex items-center justify-center text-background hover:bg-background/20 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 flex items-center justify-center text-background hover:bg-background/20 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              ref={(el) => {
                indicatorRefs.current[index] = el;
              }}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary ${
                activeIndex === index
                  ? "w-8 h-2 bg-secondary"
                  : "w-2 h-2 bg-background/50 hover:bg-background/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-12 lg:py-0">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in border border-secondary/30">
            <Trophy className="h-4 w-4" />
            <span>Empowering Athletes Since 2015</span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-[1.1] mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Empowering Athletes.{" "}
            <span className="text-secondary">Transforming Dreams</span>{" "}
            into Champions.
          </h1>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl text-background/85 leading-relaxed mb-8 max-w-2xl animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            We support young and underprivileged athletes across India with world-class training,
            financial assistance, and mentorship to help them shine on the national and
            international stage.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-12 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 text-base px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
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
              className="w-full sm:w-auto border-background/40 bg-background/10 backdrop-blur-sm text-background hover:bg-background/20 hover:border-background/60 gap-2 text-base px-8 transition-all duration-300"
            >
              <Link to="/volunteer">
                <Users className="h-5 w-5" />
                Become a Volunteer
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-background hover:bg-background/10 gap-2 text-base group transition-all duration-300"
            >
              <Link to="/what-we-do">
                <Play className="h-5 w-5" />
                Our Mission
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Quick Stats - Modern Glassmorphism Card */}
          <div
            className="inline-flex flex-wrap gap-8 rounded-2xl bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl px-8 py-6 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 ${i !== 0 ? "border-l border-border pl-8" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent z-0 pointer-events-none" />
    </section>
  );
}
