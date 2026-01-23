import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Portal-isolated auth clients (sessionStorage): allows different tabs to be logged into
// different accounts for member/student without clobbering the main (admin/public) session.

const SUPABASE_URL = "https://vmuyjqwpnqtvrlceqmwx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdXlqcXdwbnF0dnJsY2VxbXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDM1MDgsImV4cCI6MjA4Mzk3OTUwOH0.CYviQcLwoXVJkTPCw9cp1e0Oruu1qDhD2esK3N44Fcc";

export type PortalKey = "member" | "student";

const clients: Partial<Record<PortalKey, SupabaseClient<Database>>> = {};

export function getPortalClient(portal: PortalKey): SupabaseClient<Database> {
  if (clients[portal]) return clients[portal]!;

  clients[portal] = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: sessionStorage,
      storageKey: `sb-${portal}-auth`,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return clients[portal]!;
}
