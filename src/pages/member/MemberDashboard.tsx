import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Crown,
  CreditCard,
  History,
  LogOut,
  Loader2,
  AlertCircle,
  Check,
  XCircle,
  Download,
  Calendar,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { useRazorpay } from "@/hooks/useRazorpay";
import { format } from "date-fns";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  type: "monthly" | "yearly" | "lifetime";
  price: number;
  features: string[];
}

interface Subscription {
  id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  next_billing_date: string | null;
  razorpay_subscription_id: string | null;
  membership_plans: MembershipPlan;
}

interface Payment {
  id: string;
  amount: number;
  payment_status: string;
  payment_type: string;
  payment_reference: string;
  razorpay_payment_id: string | null;
  created_at: string;
  membership_plans: MembershipPlan | null;
}

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
}

export default function MemberDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isLoaded, openPayment, openSubscription } = useRazorpay();
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const selectedPlanId = location.state?.selectedPlanId;

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/member/login");
    }
  }, [user, navigate]);

  // Show plan selection dialog if coming from membership page
  useEffect(() => {
    if (selectedPlanId && plans) {
      const plan = plans.find((p) => p.id === selectedPlanId);
      if (plan) {
        setSelectedPlan(plan);
        setShowPlanDialog(true);
      }
    }
  }, [selectedPlanId]);

  // Fetch member data
  const { data: member } = useQuery({
    queryKey: ["member", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", user!.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as Member | null;
    },
    enabled: !!user,
  });

  // Fetch plans
  const { data: plans } = useQuery({
    queryKey: ["membership-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("is_active", true)
        .order("price");

      if (error) throw error;
      return data as MembershipPlan[];
    },
  });

  // Fetch active subscription
  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ["subscription", member?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, membership_plans(*)")
        .eq("member_id", member!.id)
        .in("status", ["active", "pending"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as Subscription | null;
    },
    enabled: !!member,
  });

  // Fetch payment history
  const { data: payments } = useQuery({
    queryKey: ["payments", member?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, membership_plans(*)")
        .eq("member_id", member!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!member,
  });

  // Create member if not exists
  useEffect(() => {
    if (user && !member) {
      const createMember = async () => {
        await supabase.from("members").insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Member",
          email: user.email!,
        });
        queryClient.invalidateQueries({ queryKey: ["member", user.id] });
      };
      createMember();
    }
  }, [user, member, queryClient]);

  const handleSubscribe = async () => {
    if (!selectedPlan || !member || !isLoaded) return;

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("razorpay-create-subscription", {
        body: {
          plan_id: selectedPlan.id,
          member_id: member.id,
        },
      });

      if (error || !data) {
        throw new Error(error?.message || "Failed to create subscription");
      }

      if (data.type === "order") {
        // Lifetime plan - one-time payment
        openPayment({
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          keyId: data.keyId,
          prefill: {
            name: member.full_name,
            email: member.email,
            contact: member.phone || undefined,
          },
          onSuccess: async (response) => {
            try {
              await supabase.functions.invoke("razorpay-verify-payment", {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  type: "lifetime",
                },
              });

              toast({
                title: "Welcome!",
                description: "Your lifetime membership is now active.",
              });

              queryClient.invalidateQueries({ queryKey: ["subscription"] });
              queryClient.invalidateQueries({ queryKey: ["payments"] });
              setShowPlanDialog(false);
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
              description: error.message,
              variant: "destructive",
            });
          },
        });
      } else {
        // Subscription plan
        openSubscription({
          subscriptionId: data.subscriptionId,
          keyId: data.keyId,
          prefill: {
            name: member.full_name,
            email: member.email,
            contact: member.phone || undefined,
          },
          onSuccess: async () => {
            toast({
              title: "Welcome!",
              description: "Your subscription is now active.",
            });

            queryClient.invalidateQueries({ queryKey: ["subscription"] });
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            setShowPlanDialog(false);
            setIsProcessing(false);
          },
          onError: (error) => {
            setIsProcessing(false);
            toast({
              title: "Subscription failed",
              description: error.message,
              variant: "destructive",
            });
          },
        });
      }
    } catch (err: any) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      if (!subscription) throw new Error("No subscription found");

      const { error } = await supabase.functions.invoke("razorpay-cancel-subscription", {
        body: { subscription_id: subscription.id },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Subscription cancelled",
        description:
          "Your subscription has been cancelled and will end at the end of the billing period.",
      });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      setShowCancelDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "expired":
        return <Badge variant="outline">Expired</Badge>;
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="py-16 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Welcome, {member?.full_name || "Member"}
              </h1>
              <p className="text-muted-foreground">{member?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Active Membership Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Active Membership
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : subscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {subscription.membership_plans.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {subscription.membership_plans.description}
                        </p>
                      </div>
                      {getStatusBadge(subscription.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {subscription.start_date && (
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">
                            {format(new Date(subscription.start_date), "MMM dd, yyyy")}
                          </p>
                        </div>
                      )}
                      {subscription.next_billing_date &&
                        subscription.membership_plans.type !== "lifetime" && (
                          <div>
                            <p className="text-sm text-muted-foreground">Next Billing</p>
                            <p className="font-medium">
                              {format(new Date(subscription.next_billing_date), "MMM dd, yyyy")}
                            </p>
                          </div>
                        )}
                    </div>

                    {subscription.status === "active" &&
                      subscription.membership_plans.type !== "lifetime" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowCancelDialog(true)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Subscription
                        </Button>
                      )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      You don't have an active membership
                    </p>
                    <Button onClick={() => setShowPlanDialog(true)}>
                      <Crown className="mr-2 h-4 w-4" />
                      Choose a Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!subscription && (
                  <Button className="w-full" onClick={() => setShowPlanDialog(true)}>
                    <Crown className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </Button>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <a href="/donate">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make a Donation
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Payment History
              </CardTitle>
              <CardDescription>View all your past payments and download receipts</CardDescription>
            </CardHeader>
            <CardContent>
              {payments && payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {format(new Date(payment.created_at), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {payment.payment_reference || "-"}
                        </TableCell>
                        <TableCell>{payment.membership_plans?.name || "-"}</TableCell>
                        <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                        <TableCell>
                          {payment.payment_status === "success" && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No payment history found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Plan Selection Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a Membership Plan</DialogTitle>
            <DialogDescription>
              Select a plan that suits you best. Monthly and yearly plans include AutoPay.
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-4 py-4">
            {plans?.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-2xl font-bold">
                    ₹{plan.price.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.type === "monthly" ? "/mo" : plan.type === "yearly" ? "/yr" : ""}
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="text-sm space-y-1">
                    {(plan.features as string[]).slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubscribe} disabled={!selectedPlan || isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              {selectedPlan?.type === "lifetime" ? "Pay Now" : "Subscribe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until the end of the current billing period. You
              won't be charged again after cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelSubscription.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelSubscription.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
