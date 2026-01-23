import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type VolunteerConfirmationRequest = {
  email: string;
  full_name?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, full_name }: VolunteerConfirmationRequest = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Missing valid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = (full_name || "Volunteer").trim() || "Volunteer";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // NOTE: Use a verified sender domain in Resend for production.
        from: "Parwah Sports <onboarding@resend.dev>",
        to: [email],
        subject: "We received your volunteer application",
        html: `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111827;">
            <h2 style="margin: 0 0 12px;">Thank you, ${name}!</h2>
            <p style="margin: 0 0 12px;">We’ve received your volunteer application for Parwah Sports Charitable Trust.</p>
            <p style="margin: 0 0 12px;"><strong>What happens next:</strong> Our team will review your details and contact you within <strong>2–3 working days</strong>.</p>
            <p style="margin: 0 0 12px;">If you have any additional information to share, feel free to reply to this email.</p>
            <p style="margin: 0 0 12px;">With gratitude,<br/>Parwah Sports Charitable Trust</p>
          </div>
        `,
      }),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      console.error("Resend API error:", res.status, bodyText);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, result: bodyText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
