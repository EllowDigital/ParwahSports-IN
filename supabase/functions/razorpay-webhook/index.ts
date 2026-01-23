import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
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
      ["sign"],
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", hmac, message);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const runInBackground = (promise: Promise<unknown>) => {
      const edgeRuntime = (globalThis as any).EdgeRuntime;
      if (edgeRuntime?.waitUntil) {
        edgeRuntime.waitUntil(promise);
        return;
      }
      promise.catch((e) => console.error("Background task failed:", e));
    };

    const sendDonationEmail = async (opts: {
      to: string;
      donorName: string;
      amountText?: string;
      paymentRef?: string;
    }) => {
      if (!resendApiKey) return;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Parwah Sports <onboarding@resend.dev>",
          to: [opts.to],
          subject: "Thank you for your donation to Parwah Sports",
          html: `
            <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111827;">
              <h2 style="margin: 0 0 12px;">Thank you, ${opts.donorName}!</h2>
              <p style="margin: 0 0 12px;">We’ve received your donation ${opts.amountText ? `<strong>(${opts.amountText})</strong>` : ""}. Your support helps young athletes with training, equipment, and opportunities.</p>
              ${opts.paymentRef ? `<p style="margin: 0 0 12px;"><strong>Payment reference:</strong> ${opts.paymentRef}</p>` : ""}
              <p style="margin: 0 0 12px;">With gratitude,<br/>Parwah Sports Charitable Trust</p>
            </div>
          `,
        }),
      });

      const bodyText = await res.text();
      if (!res.ok) {
        console.error("Resend API error:", res.status, bodyText);
        throw new Error("Failed to send confirmation email");
      }

      console.log("Donation confirmation email sent:", bodyText);
    };

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

          // Fallback email from webhook (in case user closed the checkout before verify endpoint)
          if (resendApiKey) {
            const { data: donation } = await supabase
              .from("donations")
              .select("donor_name, donor_email, amount, payment_reference, confirmation_email_sent_at")
              .eq("razorpay_order_id", payment.order_id)
              .maybeSingle();

            if (donation?.donor_email && !donation.confirmation_email_sent_at) {
              const donorName = donation.donor_name || "Supporter";
              const amountText = donation.amount
                ? `₹${Number(donation.amount).toLocaleString("en-IN")}`
                : "";
              const paymentRef = donation.payment_reference || "";

              runInBackground(
                (async () => {
                  await sendDonationEmail({
                    to: donation.donor_email,
                    donorName,
                    amountText,
                    paymentRef,
                  });
                  await supabase
                    .from("donations")
                    .update({ confirmation_email_sent_at: new Date().toISOString() })
                    .eq("razorpay_order_id", payment.order_id);
                })(),
              );
            }
          }
        } else {
          // Membership payment (lifetime/monthly/yearly) OR other non-donation payments
          await supabase
            .from("payments")
            .update({
              razorpay_payment_id: payment.id,
              payment_status: "success",
            })
            .eq("razorpay_order_id", payment.order_id);

          // If it's a membership order (no autopay), activate the subscription entitlement
          const membershipType = payment.notes?.type;
          if (membershipType === "lifetime" || membershipType === "monthly" || membershipType === "yearly") {
            const { data: payRow, error: payErr } = await supabase
              .from("payments")
              .select("subscription_id")
              .eq("razorpay_order_id", payment.order_id)
              .maybeSingle();
            if (!payErr && payRow?.subscription_id) {
              const start = new Date();
              const end = new Date(start);
              if (membershipType === "monthly") end.setMonth(end.getMonth() + 1);
              if (membershipType === "yearly") end.setFullYear(end.getFullYear() + 1);

              await supabase
                .from("subscriptions")
                .update({
                  status: "active",
                  start_date: start.toISOString(),
                  end_date: membershipType === "lifetime" ? null : end.toISOString(),
                  next_billing_date: null,
                })
                .eq("id", payRow.subscription_id);
            }
          }
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
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
