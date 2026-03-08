import { ReactNode } from "react";

interface SectionHeaderProps {
  badge?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`${align === "center" ? "text-center max-w-3xl mx-auto" : ""} mb-12 lg:mb-16 ${className}`}>
      {badge && (
        <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
          {badge}
        </span>
      )}
      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
}
