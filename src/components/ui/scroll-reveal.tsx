import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "fade";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

const animationClasses = {
  "fade-up": {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    hidden: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  scale: {
    hidden: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  fade: {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
};

export function ScrollReveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold, once });
  const { hidden, visible } = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all will-change-transform",
        isVisible ? visible : hidden,
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {children}
    </div>
  );
}

// Wrapper for staggered children animations
interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  childClassName?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "fade";
  baseDelay?: number;
  duration?: number;
  threshold?: number;
}

export function StaggerReveal({
  children,
  className,
  childClassName,
  animation = "fade-up",
  baseDelay = 100,
  duration = 500,
  threshold = 0.1,
}: StaggerRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold });
  const { hidden, visible } = animationClasses[animation];

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all will-change-transform",
            isVisible ? visible : hidden,
            childClassName,
          )}
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: isVisible ? `${index * baseDelay}ms` : "0ms",
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
