import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!webhookSecret) {
      throw new Error("Webhook secret not configured");
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      throw new Error("No signature provided");
    }

    // Verify signature
    const encoder = new TextEncoder();
    const key = encoder.encode(webhookSecret);
    const message = encoder.encode(body);
    
    const hmac = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", hmac, message);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Received webhook event:", event.event);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        
        // Update donation if it's a donation payment
        if (payment.notes?.type === "donation") {
          await supabase
            .from("donations")
            .update({
              razorpay_payment_id: payment.id,
              payment_status: "success",
            })
            .eq("razorpay_order_id", payment.order_id);
        } else {
          // Update payment record
          await supabase
            .from("payments")
            .update({
              razorpay_payment_id: payment.id,
              payment_status: "success",
            })
            .eq("razorpay_order_id", payment.order_id);
        }
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        
        if (payment.notes?.type === "donation") {
          await supabase
            .from("donations")
            .update({
              razorpay_payment_id: payment.id,
              payment_status: "failed",
            })
            .eq("razorpay_order_id", payment.order_id);
        } else {
          await supabase
            .from("payments")
            .update({
              razorpay_payment_id: payment.id,
              payment_status: "failed",
            })
            .eq("razorpay_order_id", payment.order_id);
        }
        break;
      }

      case "subscription.activated": {
        const subscription = event.payload.subscription.entity;
        
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            start_date: new Date(subscription.current_start * 1000).toISOString(),
            next_billing_date: new Date(subscription.charge_at * 1000).toISOString(),
          })
          .eq("razorpay_subscription_id", subscription.id);
        break;
      }

      case "subscription.charged": {
        const subscription = event.payload.subscription.entity;
        const payment = event.payload.payment.entity;

        // Get the subscription from database
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("id, member_id, plan_id")
          .eq("razorpay_subscription_id", subscription.id)
          .single();

        if (sub) {
          // Create payment record
          const paymentReference = `PAY-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
          
          await supabase.from("payments").insert({
            member_id: sub.member_id,
            subscription_id: sub.id,
            plan_id: sub.plan_id,
            amount: payment.amount / 100,
            razorpay_payment_id: payment.id,
            payment_status: "success",
            payment_type: "subscription",
            payment_reference: paymentReference,
          });

          // Update subscription next billing date
          await supabase
            .from("subscriptions")
            .update({
              next_billing_date: new Date(subscription.charge_at * 1000).toISOString(),
            })
            .eq("razorpay_subscription_id", subscription.id);
        }
        break;
      }

      case "subscription.cancelled": {
        const subscription = event.payload.subscription.entity;
        
        await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", subscription.id);
        break;
      }

      case "subscription.expired": {
        const subscription = event.payload.subscription.entity;
        
        await supabase
          .from("subscriptions")
          .update({
            status: "expired",
            end_date: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", subscription.id);
        break;
      }

      case "subscription.paused": {
        const subscription = event.payload.subscription.entity;
        
        await supabase
          .from("subscriptions")
          .update({ status: "paused" })
          .eq("razorpay_subscription_id", subscription.id);
        break;
      }

      case "subscription.resumed": {
        const subscription = event.payload.subscription.entity;
        
        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("razorpay_subscription_id", subscription.id);
        break;
      }

      default:
        console.log("Unhandled event type:", event.event);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
