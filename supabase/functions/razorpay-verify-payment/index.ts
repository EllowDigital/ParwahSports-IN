import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, payment_reference } =
      await req.json();

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

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
      ["sign"],
    );

    const signature = await crypto.subtle.sign("HMAC", hmac, message);
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // Update in Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const runInBackground = (promise: Promise<unknown>) => {
      const edgeRuntime = (globalThis as any).EdgeRuntime;
      if (edgeRuntime?.waitUntil) {
        edgeRuntime.waitUntil(promise);
        return;
      }
      // Fallback: fire and forget
      promise.catch((e) => console.error("Background task failed:", e));
    };

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

      // Send confirmation email (non-blocking)
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const { data: donation } = await supabase
          .from("donations")
          .select("donor_name, donor_email, amount, payment_reference")
          .eq("razorpay_order_id", razorpay_order_id)
          .maybeSingle();

        if (donation?.donor_email) {
          const donorName = donation.donor_name || "Supporter";
          const amountText = donation.amount ? `₹${Number(donation.amount).toLocaleString("en-IN")}` : "";
          const paymentRef = donation.payment_reference || "";

          runInBackground(
            resend.emails.send({
              // NOTE: Use a verified domain sender in Resend for production.
              from: "Parwah Sports <onboarding@resend.dev>",
              to: [donation.donor_email],
              subject: "Thank you for your donation to Parwah Sports",
              html: `
                <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111827;">
                  <h2 style="margin: 0 0 12px;">Thank you, ${donorName}!</h2>
                  <p style="margin: 0 0 12px;">We’ve received your donation ${amountText ? `<strong>(${amountText})</strong>` : ""}. Your support helps young athletes get training, equipment, and opportunities.</p>
                  ${paymentRef ? `<p style="margin: 0 0 12px;"><strong>Payment reference:</strong> ${paymentRef}</p>` : ""}
                  <p style="margin: 0 0 12px;">With gratitude,<br/>Parwah Sports Charitable Trust</p>
                </div>
              `,
            }),
          );
        }
      } else {
        console.log("RESEND_API_KEY not configured; skipping donation confirmation email.");
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
      },
    );
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
