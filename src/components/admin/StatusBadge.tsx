import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "error" | "info" | "default";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  default: "bg-muted text-muted-foreground border-border",
};

const statusToVariant: Record<string, StatusVariant> = {
  // General
  active: "success",
  published: "success",
  success: "success",
  completed: "success",
  participated: "success",
  winner: "success",
  runner_up: "success",
  
  // Pending/Warning
  pending: "warning",
  draft: "warning",
  upcoming: "warning",
  registered: "warning",
  paused: "warning",
  
  // Error
  failed: "error",
  cancelled: "error",
  expired: "error",
  inactive: "error",
  disqualified: "error",
  
  // Info
  ongoing: "info",
  important: "info",
  
  // Urgent
  urgent: "error",
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant || statusToVariant[status.toLowerCase()] || "default";
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        variantStyles[resolvedVariant],
        className
      )}
    >
      {status}
    </span>
  );
}
