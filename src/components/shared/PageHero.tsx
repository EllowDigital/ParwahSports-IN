import { ReactNode } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface PageHeroProps {
  badge?: string;
  badgeIcon?: ReactNode;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  variant?: "default" | "gradient" | "dark";
  className?: string;
}

export function PageHero({
  badge,
  badgeIcon,
  title,
  description,
  children,
  variant = "default",
  className = "",
}: PageHeroProps) {
  const bgClass =
    variant === "gradient"
      ? "bg-gradient-to-br from-primary/5 via-background to-secondary/5"
      : variant === "dark"
        ? "bg-primary"
        : "bg-muted/30";

  const textClass = variant === "dark" ? "text-primary-foreground" : "text-foreground";
  const descClass = variant === "dark" ? "text-primary-foreground/80" : "text-muted-foreground";

  return (
    <section className={`pt-24 pb-16 lg:pt-32 lg:pb-24 ${bgClass} relative overflow-hidden ${className}`}>
      {variant !== "dark" && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
            {badge && (
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                variant === "dark"
                  ? "bg-secondary/20 text-secondary"
                  : "bg-secondary/15 text-secondary border border-secondary/20"
              }`}>
                {badgeIcon}
                {badge}
              </span>
            )}
            <h1 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${textClass}`}>
              {title}
            </h1>
            {description && (
              <p className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto ${descClass}`}>
                {description}
              </p>
            )}
            {children}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
