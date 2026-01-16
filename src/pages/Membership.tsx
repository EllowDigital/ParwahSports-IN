import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Crown, Check, Loader2, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  type: "monthly" | "yearly" | "lifetime";
  price: number;
  features: string[];
  is_active: boolean;
}

export default function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: plans, isLoading } = useQuery({
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

  const handleSelectPlan = (plan: MembershipPlan) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or create an account to become a member.",
      });
      navigate("/member/login", { state: { planId: plan.id } });
      return;
    }
    navigate("/member/dashboard", { state: { selectedPlanId: plan.id } });
  };

  const getPlanBadge = (type: string) => {
    switch (type) {
      case "monthly":
        return <Badge variant="secondary">Monthly</Badge>;
      case "yearly":
        return <Badge variant="default">Best Value</Badge>;
      case "lifetime":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Premium</Badge>;
      default:
        return null;
    }
  };

  const getPlanPrice = (plan: MembershipPlan) => {
    switch (plan.type) {
      case "monthly":
        return (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        );
      case "yearly":
        return (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
            <span className="text-muted-foreground">/year</span>
          </div>
        );
      case "lifetime":
        return (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
            <span className="text-muted-foreground">one-time</span>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Crown className="h-4 w-4" />
              Become a Member
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Membership Plans
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community and support young athletes while enjoying exclusive benefits.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans?.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.type === "yearly" ? "border-primary shadow-lg scale-105" : ""
                  }`}
                >
                  {plan.type === "yearly" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className="mb-2">{getPlanBadge(plan.type)}</div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">{getPlanPrice(plan)}</div>
                    <ul className="space-y-3 text-left">
                      {(plan.features as string[]).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.type === "yearly" ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {plan.type === "lifetime" ? "Get Lifetime Access" : "Subscribe Now"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Already a member */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Already a member?{" "}
              <Link to="/member/login" className="text-primary hover:underline font-medium">
                Login to your dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
