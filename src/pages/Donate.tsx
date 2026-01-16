import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Check, AlertCircle, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRazorpay } from "@/hooks/useRazorpay";

const presetAmounts = [500, 1000, 2500, 5000, 10000];

const donationSchema = z.object({
  donor_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  donor_email: z.string().email("Please enter a valid email"),
  donor_phone: z.string().optional(),
  donor_address: z.string().optional(),
  amount: z.number().min(100, "Minimum donation is ₹100").max(1000000, "Maximum donation is ₹10,00,000"),
  notes: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const { toast } = useToast();
  const { isLoaded, openPayment } = useRazorpay();

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donor_name: "",
      donor_email: "",
      donor_phone: "",
      donor_address: "",
      amount: 0,
      notes: "",
    },
  });

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    form.setValue("amount", amount);
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setCustomAmount(value);
    setSelectedAmount(null);
    form.setValue("amount", numValue);
  };

  const onSubmit = async (data: DonationFormData) => {
    if (!isLoaded) {
      toast({
        title: "Please wait",
        description: "Payment system is loading...",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order via edge function
      const { data: orderData, error } = await supabase.functions.invoke("razorpay-create-order", {
        body: {
          amount: data.amount,
          type: "donation",
          donor_name: data.donor_name,
          donor_email: data.donor_email,
          donor_phone: data.donor_phone,
          donor_address: data.donor_address,
          notes: data.notes,
        },
      });

      if (error || !orderData) {
        throw new Error(error?.message || "Failed to create order");
      }

      // Open Razorpay checkout
      openPayment({
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: orderData.keyId,
        prefill: {
          name: data.donor_name,
          email: data.donor_email,
          contact: data.donor_phone,
        },
        onSuccess: async (response) => {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke("razorpay-verify-payment", {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                type: "donation",
              },
            });

            if (verifyError) {
              throw new Error("Payment verification failed");
            }

            setPaymentSuccess(true);
            setPaymentReference(orderData.paymentReference);
            toast({
              title: "Thank you!",
              description: "Your donation was successful.",
            });
          } catch (err: any) {
            toast({
              title: "Error",
              description: err.message,
              variant: "destructive",
            });
          }
          setIsProcessing(false);
        },
        onError: (error) => {
          setIsProcessing(false);
          toast({
            title: "Payment failed",
            description: error.message || "Please try again",
            variant: "destructive",
          });
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (paymentSuccess) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center py-16">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-4">
                Your donation has been received successfully.
              </p>
              <div className="bg-muted p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">Payment Reference</p>
                <p className="font-mono font-semibold text-foreground">{paymentReference}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Make Another Donation
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4" />
              Support Our Mission
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Make a Donation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your generous contribution helps us empower young athletes and build a brighter future for our community.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Donation Details</CardTitle>
                <CardDescription>Choose an amount and fill in your details</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Amount Selection */}
                    <div className="space-y-4">
                      <FormLabel>Select Amount (₹)</FormLabel>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {presetAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => handleAmountSelect(amount)}
                            className="w-full"
                          >
                            ₹{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">or</span>
                        <Input
                          type="number"
                          placeholder="Enter custom amount"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      {form.formState.errors.amount && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {form.formState.errors.amount.message}
                        </p>
                      )}
                    </div>

                    {/* Personal Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="donor_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="donor_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="donor_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="donor_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Leave a message with your donation..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isProcessing || !form.watch("amount")}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Donate ₹{(form.watch("amount") || 0).toLocaleString()}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Your payment is processed securely via Razorpay. We do not store your card details.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
