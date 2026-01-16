import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openPayment = useCallback(
    (options: {
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      onSuccess: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => void;
      onError: (error: any) => void;
    }) => {
      if (!isLoaded || !window.Razorpay) {
        options.onError(new Error("Razorpay SDK not loaded"));
        return;
      }

      const rzp = new window.Razorpay({
        key: options.keyId,
        amount: options.amount,
        currency: options.currency,
        order_id: options.orderId,
        name: "SSFA Foundation",
        description: "Donation / Membership Payment",
        handler: options.onSuccess,
        prefill: options.prefill,
        theme: {
          color: "#1a365d",
        },
        modal: {
          ondismiss: () => {
            options.onError(new Error("Payment cancelled by user"));
          },
        },
      });

      rzp.open();
    },
    [isLoaded],
  );

  const openSubscription = useCallback(
    (options: {
      subscriptionId: string;
      keyId: string;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      onSuccess: (response: {
        razorpay_subscription_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => void;
      onError: (error: any) => void;
    }) => {
      if (!isLoaded || !window.Razorpay) {
        options.onError(new Error("Razorpay SDK not loaded"));
        return;
      }

      const rzp = new window.Razorpay({
        key: options.keyId,
        subscription_id: options.subscriptionId,
        name: "SSFA Foundation",
        description: "Membership Subscription",
        handler: options.onSuccess,
        prefill: options.prefill,
        theme: {
          color: "#1a365d",
        },
        modal: {
          ondismiss: () => {
            options.onError(new Error("Payment cancelled by user"));
          },
        },
      });

      rzp.open();
    },
    [isLoaded],
  );

  return { isLoaded, openPayment, openSubscription };
}
