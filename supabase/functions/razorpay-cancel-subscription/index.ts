import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { subscription_id } = await req.json();

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get subscription details
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*, membership_plans(*)")
      .eq("id", subscription_id)
      .single();

    if (subError || !subscription) {
      throw new Error("Subscription not found");
    }

    // For lifetime subscriptions, we can't cancel via Razorpay
    if (subscription.membership_plans.type === "lifetime") {
      throw new Error("Lifetime memberships cannot be cancelled");
    }

    if (!subscription.razorpay_subscription_id) {
      throw new Error("No Razorpay subscription found");
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    // Cancel Razorpay subscription
    const cancelResponse = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${subscription.razorpay_subscription_id}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ cancel_at_cycle_end: true }),
      },
    );

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      throw new Error(`Failed to cancel subscription: ${errorText}`);
    }

    // Update subscription status in database
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", subscription_id);

    if (updateError) {
      throw new Error("Failed to update subscription status");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Subscription cancelled successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
