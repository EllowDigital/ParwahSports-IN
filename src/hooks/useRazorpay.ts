import { useCallback, useEffect, useState } from "react";

type RazorpayOrderSuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpaySubscriptionSuccessResponse = {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayPrefill = {
  name?: string;
  email?: string;
  contact?: string;
};

type RazorpayModalOptions = {
  ondismiss?: () => void;
};

type RazorpayCheckoutOptions = {
  key: string;
  name: string;
  description?: string;
  amount?: number;
  currency?: string;
  order_id?: string;
  subscription_id?: string;
  handler: (response: unknown) => void;
  prefill?: RazorpayPrefill;
  theme?: { color?: string };
  modal?: RazorpayModalOptions;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
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
      onError: (error: unknown) => void;
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
        name: "Parwah Sports",
        description: "Donation / Membership Payment",
        handler: (response) => options.onSuccess(response as RazorpayOrderSuccessResponse),
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
      onError: (error: unknown) => void;
    }) => {
      if (!isLoaded || !window.Razorpay) {
        options.onError(new Error("Razorpay SDK not loaded"));
        return;
      }

      const rzp = new window.Razorpay({
        key: options.keyId,
        subscription_id: options.subscriptionId,
        name: "Parwah Sports",
        description: "Membership Subscription",
        handler: (response) =>
          options.onSuccess(response as RazorpaySubscriptionSuccessResponse),
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
