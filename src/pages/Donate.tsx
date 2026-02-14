import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Heart,
  Check,
  AlertCircle,
  Loader2,
  QrCode,
  Shield,
  Users,
  Trophy,
  Utensils,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRazorpay } from "@/hooks/useRazorpay";
import { getErrorMessage } from "@/lib/errors";
import { useLocation } from "react-router-dom";

const presetAmounts = [500, 1000, 2500, 5000, 10000];

const donationSchema = z.object({
  donor_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  donor_email: z.string().email("Please enter a valid email"),
  donor_phone: z.string().optional(),
  donor_address: z.string().optional(),
  amount: z
    .number()
    .min(1, "Minimum donation is ₹1")
    .max(1000000, "Maximum donation is ₹10,00,000"),
  notes: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

const impactItems = [
  {
    icon: Trophy,
    title: "Training & Coaching",
    description: "Professional coaching and training programs for young athletes",
  },
  {
    icon: Users,
    title: "Equipment & Gear",
    description: "Quality sports equipment, uniforms, and protective gear",
  },
  {
    icon: Utensils,
    title: "Nutrition & Meals",
    description: "Healthy meals and nutrition support for growing athletes",
  },
  {
    icon: Shield,
    title: "Travel & Competition",
    description: "Travel expenses for competitions at state and national levels",
  },
];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const { toast } = useToast();
  const { isLoaded, openPayment } = useRazorpay();
  const location = useLocation();
  const donateFormRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amountParam = params.get("amount");
    const parsedAmount = amountParam ? Number.parseInt(amountParam, 10) : NaN;

    if (Number.isFinite(parsedAmount) && parsedAmount > 0) {
      handleAmountSelect(parsedAmount);
    }

    if (location.hash === "#donate-form" || (Number.isFinite(parsedAmount) && parsedAmount > 0)) {
      window.setTimeout(() => {
        donateFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.hash]);

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
            const { error: verifyError } = await supabase.functions.invoke(
              "razorpay-verify-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  type: "donation",
                },
              },
            );

            if (verifyError) {
              throw new Error("Payment verification failed");
            }

            setPaymentSuccess(true);
            setPaymentReference(orderData.paymentReference);
            toast({
              title: "Thank you!",
              description: "Your donation was successful.",
            });
          } catch (err: unknown) {
            toast({
              title: "Error",
              description: getErrorMessage(err),
              variant: "destructive",
            });
          }
          setIsProcessing(false);
        },
        onError: (error: unknown) => {
          setIsProcessing(false);
          toast({
            title: "Payment failed",
            description: getErrorMessage(error) || "Please try again",
            variant: "destructive",
          });
        },
      });
    } catch (err: unknown) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: getErrorMessage(err),
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
                Your generosity means the world to us. Every contribution helps a young athlete move
                closer to their dreams.
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
      <SEOHead
        title="Donate to Sports - Support Athletes | Parwah Sports"
        description="Support underprivileged athletes in India. Your donation funds sports training, equipment, coaching, and scholarships for aspiring young athletes. 80G tax exemption available."
        path="/donate"
        keywords="donate to sports, sports charity India, support athletes, 80G donation, sports trust donation, Parwah Sports donate"
      />
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Transform Lives
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Support a Dream — <br className="hidden md:block" />
              <span className="text-primary">Donate Today</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Every contribution, no matter how small, creates ripples of change. Your donation
              empowers young athletes to pursue their dreams and overcome barriers.
            </p>
          </div>
        </div>
      </section>

      {/* How Donations Help */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Your Donation Helps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your generous contribution directly impacts the lives of young athletes. Here's how we
              use your donations:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {impactItems.map((item, index) => (
              <Card
                key={index}
                className="text-center border-border/50 hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <div id="donate-form" ref={donateFormRef}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Make a Donation</CardTitle>
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
                        Your payment is processed securely via Razorpay. We do not store your card
                        details.
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* QR Code & Trust Section */}
            <div className="space-y-6">
              {/* QR Code Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    Scan to Donate via UPI
                  </CardTitle>
                  <CardDescription>Quick & secure payment using any UPI app</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 bg-background rounded-xl flex items-center justify-center border-2 border-dashed border-border mb-4">
                      <div className="text-center">
                        <QrCode className="h-16 w-16 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">QR Code</p>
                        <p className="text-xs text-muted-foreground">(Coming Soon)</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Scan with Google Pay, PhonePe, Paytm, or any UPI app
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust & Transparency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Trust & Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">100% Donation Utilized</strong> — Every
                      rupee goes directly towards athlete development programs
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Tax Benefits</strong> — Donations are
                      eligible for tax deduction under Section 80G
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Regular Updates</strong> — Receive updates
                      on how your donation is making an impact
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Secure Payments</strong> — All
                      transactions are encrypted and processed by Razorpay
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Emotional CTA */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground text-center">
                <Heart className="h-10 w-10 mx-auto mb-4 opacity-80" />
                <p className="text-lg font-medium mb-2">
                  "Every contribution helps an athlete move closer to their goal"
                </p>
                <p className="text-sm opacity-80">Your support today shapes tomorrow's champions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
