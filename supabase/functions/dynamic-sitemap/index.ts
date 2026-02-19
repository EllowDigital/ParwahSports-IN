import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CANONICAL_DOMAIN = "https://parwahsports.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "events";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    if (type === "events") {
      // Static event pages
      xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/events</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/competitions</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/calendar</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;

      // Dynamic events
      const { data: events } = await supabase
        .from("events")
        .select("id, updated_at")
        .order("event_date", { ascending: false })
        .limit(500);

      if (events) {
        for (const event of events) {
          const lastmod = event.updated_at
            ? new Date(event.updated_at).toISOString().split("T")[0]
            : "";
          xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/events</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        }
      }

      // Dynamic competitions
      const { data: competitions } = await supabase
        .from("competitions")
        .select("id, updated_at")
        .order("event_date", { ascending: false })
        .limit(500);

      if (competitions) {
        for (const comp of competitions) {
          const lastmod = comp.updated_at
            ? new Date(comp.updated_at).toISOString().split("T")[0]
            : "";
          xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/competitions</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        }
      }
    } else if (type === "blog") {
      // Static blog pages
      xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/blogs</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/news</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/announcements</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;

      // Dynamic blogs
      const { data: blogs } = await supabase
        .from("blogs")
        .select("id, updated_at, publish_date")
        .eq("status", "published")
        .order("publish_date", { ascending: false })
        .limit(500);

      if (blogs) {
        for (const blog of blogs) {
          const lastmod = blog.updated_at
            ? new Date(blog.updated_at).toISOString().split("T")[0]
            : "";
          xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/blogs</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        }
      }

      // Dynamic news
      const { data: news } = await supabase
        .from("news")
        .select("id, updated_at, publish_date")
        .eq("status", "published")
        .order("publish_date", { ascending: false })
        .limit(500);

      if (news) {
        for (const item of news) {
          const lastmod = item.updated_at
            ? new Date(item.updated_at).toISOString().split("T")[0]
            : "";
          xml += `  <url>\n    <loc>${CANONICAL_DOMAIN}/news</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        }
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate sitemap" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
