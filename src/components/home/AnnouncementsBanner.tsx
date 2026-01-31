import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Info, Megaphone, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "normal" | "important" | "urgent";
}

export function AnnouncementsBanner() {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const { data: announcements } = useQuery({
    queryKey: ["active-announcements"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Filter by date range in JavaScript for more reliable handling
      const filtered = (data || []).filter((announcement) => {
        const startOk = !announcement.start_date || new Date(announcement.start_date) <= new Date(now);
        const endOk = !announcement.end_date || new Date(announcement.end_date) >= new Date(now);
        return startOk && endOk;
      });
      
      return filtered.slice(0, 1) as Announcement[];
    },
  });

  const visibleAnnouncements = announcements?.filter(
    (a) => !dismissed.includes(a.id)
  );

  if (!visibleAnnouncements || visibleAnnouncements.length === 0) return null;

  const priorityStyles = {
    urgent: "bg-destructive text-destructive-foreground",
    important: "bg-secondary text-secondary-foreground",
    normal: "bg-muted text-foreground",
  };

  const priorityIcons = {
    urgent: AlertTriangle,
    important: Megaphone,
    normal: Info,
  };

  return (
    <div className="relative z-40">
      {visibleAnnouncements.map((announcement) => {
        const Icon = priorityIcons[announcement.priority];
        return (
          <div
            key={announcement.id}
            className={`${priorityStyles[announcement.priority]} py-2.5 px-4`}
          >
            <div className="container mx-auto flex items-center justify-between gap-4">
              <Link
                to="/announcements"
                className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium truncate">
                  {announcement.title}: {announcement.message}
                </span>
              </Link>
              <button
                onClick={() => setDismissed([...dismissed, announcement.id])}
                className="p-1 hover:opacity-70 transition-opacity shrink-0"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
