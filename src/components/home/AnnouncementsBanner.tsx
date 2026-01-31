import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "normal" | "important" | "urgent";
}

export function AnnouncementsBanner() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const { data: announcements } = useQuery({
    queryKey: ["home-announcements"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, message, priority")
        .eq("is_active", true)
        .or(`start_date.is.null,start_date.lte.${today}`)
        .or(`end_date.is.null,end_date.gte.${today}`)
        .order("priority", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as Announcement[];
    },
  });

  const visibleAnnouncements = announcements?.filter((a) => !dismissedIds.includes(a.id)) || [];

  if (visibleAnnouncements.length === 0) return null;

  const priorityStyles = {
    urgent: {
      bg: "bg-destructive",
      text: "text-destructive-foreground",
      icon: AlertTriangle,
    },
    important: {
      bg: "bg-primary",
      text: "text-primary-foreground",
      icon: AlertCircle,
    },
    normal: {
      bg: "bg-secondary",
      text: "text-secondary-foreground",
      icon: Info,
    },
  };

  // Show only the highest priority announcement
  const topAnnouncement = visibleAnnouncements[0];
  const style = priorityStyles[topAnnouncement.priority];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.text} relative overflow-hidden`}>
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-background/20 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold">{topAnnouncement.title}:</span>{" "}
              <span className="opacity-90 line-clamp-1">{topAnnouncement.message}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/announcements"
              className="text-sm font-medium px-3 py-1 rounded-full bg-background/20 hover:bg-background/30 transition-colors hidden sm:inline"
            >
              View All
            </Link>
            <button
              onClick={() => setDismissedIds([...dismissedIds, topAnnouncement.id])}
              className="p-1.5 rounded-full hover:bg-background/20 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
