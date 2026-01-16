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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, payment_reference } = await req.json();

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret not configured");
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const encoder = new TextEncoder();
    const key = encoder.encode(razorpayKeySecret);
    const message = encoder.encode(body);
    
    const hmac = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign("HMAC", hmac, message);
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // Update in Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (type === "donation") {
      const { error } = await supabase
        .from("donations")
        .update({
          razorpay_payment_id,
          razorpay_signature,
          payment_status: "success",
        })
        .eq("razorpay_order_id", razorpay_order_id);

      if (error) {
        console.error("Failed to update donation:", error);
        throw new Error("Failed to update donation record");
      }
    } else if (type === "lifetime") {
      const { error } = await supabase
        .from("payments")
        .update({
          razorpay_payment_id,
          razorpay_signature,
          payment_status: "success",
        })
        .eq("razorpay_order_id", razorpay_order_id);

      if (error) {
        console.error("Failed to update payment:", error);
        throw new Error("Failed to update payment record");
      }

      // Update subscription status
      const { data: payment } = await supabase
        .from("payments")
        .select("subscription_id")
        .eq("razorpay_order_id", razorpay_order_id)
        .single();

      if (payment?.subscription_id) {
        await supabase
          .from("subscriptions")
          .update({ status: "active", start_date: new Date().toISOString() })
          .eq("id", payment.subscription_id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Payment verified successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
