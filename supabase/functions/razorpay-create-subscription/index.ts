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

    const { plan_id, member_id } = await req.json();

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("membership_plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    // Get member details
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("*")
      .eq("id", member_id)
      .single();

    if (memberError || !member) {
      throw new Error("Member not found");
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    const callRazorpay = async (url: string, payload: Record<string, unknown>) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Razorpay error ${response.status}: ${errorText}`);
      }

      return response.json();
    };

    const createRazorpayPlan = async () => {
      const period = plan.type === "monthly" ? "monthly" : "yearly";
      const interval = 1;

      const planData = {
        period,
        interval,
        item: {
          name: plan.name,
          amount: Math.round(Number(plan.price) * 100),
          currency: "INR",
        },
      };

      const razorpayPlan = await callRazorpay("https://api.razorpay.com/v1/plans", planData);
      const newPlanId = razorpayPlan.id as string;

      await supabase
        .from("membership_plans")
        .update({ razorpay_plan_id: newPlanId })
        .eq("id", plan_id);

      return newPlanId;
    };

    // For lifetime plan, create a regular order instead of subscription
    if (plan.type === "lifetime") {
      const paymentReference = `PAY-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

      const orderData = {
        amount: Math.round(plan.price * 100),
        currency: "INR",
        receipt: paymentReference,
        notes: {
          type: "lifetime",
          member_id: member_id,
          plan_id: plan_id,
        },
      };

      const order = await callRazorpay("https://api.razorpay.com/v1/orders", orderData);

      // Create subscription record
      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .insert({
          member_id,
          plan_id,
          status: "pending",
        })
        .select()
        .single();

      if (subError) {
        throw new Error("Failed to create subscription record");
      }

      // Create payment record
      await supabase.from("payments").insert({
        member_id,
        subscription_id: subscription.id,
        plan_id,
        amount: plan.price,
        razorpay_order_id: order.id,
        payment_reference: paymentReference,
        payment_type: "lifetime",
        payment_status: "pending",
      });

      return new Response(
        JSON.stringify({
          type: "order",
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: razorpayKeyId,
          subscriptionId: subscription.id,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // For monthly/yearly, check if Razorpay plan exists or create one
    let razorpayPlanId = plan.razorpay_plan_id;

    if (!razorpayPlanId) {
      razorpayPlanId = await createRazorpayPlan();
    }

    // Create subscription
    const subscriptionData = {
      plan_id: razorpayPlanId,
      total_count: plan.type === "monthly" ? 120 : 10, // 10 years worth
      customer_notify: 1,
      notes: {
        member_id: member_id,
        plan_id: plan_id,
      },
    };

    let razorpaySubscription: { id: string };
    try {
      razorpaySubscription = await callRazorpay(
        "https://api.razorpay.com/v1/subscriptions",
        subscriptionData,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("plan") || message.includes("plan_id")) {
        // Retry once by recreating plan in Razorpay
        razorpayPlanId = await createRazorpayPlan();
        const retryData = { ...subscriptionData, plan_id: razorpayPlanId };
        razorpaySubscription = await callRazorpay(
          "https://api.razorpay.com/v1/subscriptions",
          retryData,
        );
      } else {
        throw error;
      }
    }

    // Create subscription record in database
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .insert({
        member_id,
        plan_id,
        razorpay_subscription_id: razorpaySubscription.id,
        status: "pending",
      })
      .select()
      .single();

    if (subError) {
      throw new Error("Failed to create subscription record");
    }

    return new Response(
      JSON.stringify({
        type: "subscription",
        subscriptionId: razorpaySubscription.id,
        keyId: razorpayKeyId,
        dbSubscriptionId: subscription.id,
      }),
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
