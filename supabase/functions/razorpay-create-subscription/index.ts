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
        throw new Error(`Failed to create order: ${errorText}`);
      }

      const order = await orderResponse.json();

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
        }
      );
    }

    // For monthly/yearly, check if Razorpay plan exists or create one
    let razorpayPlanId = plan.razorpay_plan_id;

    if (!razorpayPlanId) {
      // Create Razorpay plan
      const period = plan.type === "monthly" ? "monthly" : "yearly";
      const interval = 1;

      const planData = {
        period,
        interval,
        item: {
          name: plan.name,
          amount: Math.round(plan.price * 100),
          currency: "INR",
        },
      };

      const planResponse = await fetch("https://api.razorpay.com/v1/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${auth}`,
        },
        body: JSON.stringify(planData),
      });

      if (!planResponse.ok) {
        const errorText = await planResponse.text();
        throw new Error(`Failed to create Razorpay plan: ${errorText}`);
      }

      const razorpayPlan = await planResponse.json();
      razorpayPlanId = razorpayPlan.id;

      // Update plan with Razorpay plan ID
      await supabase
        .from("membership_plans")
        .update({ razorpay_plan_id: razorpayPlanId })
        .eq("id", plan_id);
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

    const subscriptionResponse = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!subscriptionResponse.ok) {
      const errorText = await subscriptionResponse.text();
      throw new Error(`Failed to create subscription: ${errorText}`);
    }

    const razorpaySubscription = await subscriptionResponse.json();

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
