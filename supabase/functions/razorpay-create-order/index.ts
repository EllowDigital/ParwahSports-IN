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
    const { amount, type, donor_name, donor_email, donor_phone, donor_address, plan_id, notes } = await req.json();

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Generate payment reference
    const paymentReference = `PAY-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    // Create Razorpay order
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: paymentReference,
      notes: {
        type: type || "donation",
        donor_name: donor_name || "",
        donor_email: donor_email || "",
        plan_id: plan_id || "",
      },
    };

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("Razorpay order creation failed:", errorText);
      throw new Error(`Failed to create Razorpay order: ${errorText}`);
    }

    const order = await orderResponse.json();

    // Store in Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (type === "donation") {
      const { error: donationError } = await supabase.from("donations").insert({
        donor_name,
        donor_email,
        donor_phone,
        donor_address,
        amount,
        razorpay_order_id: order.id,
        payment_reference: paymentReference,
        payment_status: "pending",
        notes,
      });

      if (donationError) {
        console.error("Failed to save donation:", donationError);
        throw new Error("Failed to save donation record");
      }
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayKeyId,
        paymentReference,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
