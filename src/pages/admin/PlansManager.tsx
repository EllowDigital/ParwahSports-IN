import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Crown, Plus, Edit, Trash2, Loader2, Check, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";

interface MembershipPlan {
  id: string;
  name: string;
  description: string | null;
  type: "monthly" | "yearly" | "lifetime";
  price: number;
  features: string[];
  is_active: boolean;
  razorpay_plan_id: string | null;
}

const planSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["monthly", "yearly", "lifetime"]),
  price: z.number().min(1, "Price must be at least ₹1"),
  features: z.string(),
  is_active: z.boolean(),
});

type PlanFormData = z.infer<typeof planSchema>;

export default function PlansManager() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "monthly",
      price: 0,
      features: "",
      is_active: true,
    },
  });

  const { data: plans, isLoading } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("membership_plans").select("*").order("price");

      if (error) throw error;
      return data as MembershipPlan[];
    },
  });

  const savePlan = useMutation({
    mutationFn: async (data: PlanFormData) => {
      const features = data.features.split("\n").filter((f) => f.trim());
      const planData = {
        name: data.name,
        description: data.description,
        type: data.type,
        price: data.price,
        features,
        is_active: data.is_active,
      };

      if (editingPlan) {
        const { error } = await supabase
          .from("membership_plans")
          .update(planData)
          .eq("id", editingPlan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("membership_plans").insert(planData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: editingPlan ? "Plan updated" : "Plan created",
        description: "Membership plan has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      handleCloseDialog();
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("membership_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Plan deleted",
        description: "Membership plan has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      setPlanToDelete(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    },
  });

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    form.reset({
      name: plan.name,
      description: plan.description || "",
      type: plan.type,
      price: Number(plan.price),
      features: (plan.features as string[]).join("\n"),
      is_active: plan.is_active,
    });
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingPlan(null);
    form.reset({
      name: "",
      description: "",
      type: "monthly",
      price: 0,
      features: "",
      is_active: true,
    });
  };

  const onSubmit = (data: PlanFormData) => {
    savePlan.mutate(data);
  };

  const getPlanTypeBadge = (type: string) => {
    switch (type) {
      case "monthly":
        return <Badge variant="secondary">Monthly</Badge>;
      case "yearly":
        return <Badge variant="default">Yearly</Badge>;
      case "lifetime":
        return <Badge className="bg-amber-500">Lifetime</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Membership Plans</h1>
            <p className="text-muted-foreground">Create and manage membership plans</p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans?.map((plan) => (
              <Card key={plan.id} className={!plan.is_active ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      {getPlanTypeBadge(plan.type)}
                      <CardTitle className="mt-2">{plan.name}</CardTitle>
                    </div>
                    {!plan.is_active && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  <p className="text-2xl font-bold">
                    ₹{Number(plan.price).toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.type === "monthly" ? "/month" : plan.type === "yearly" ? "/year" : ""}
                    </span>
                  </p>
                </CardHeader>
                <CardContent>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  )}
                  <ul className="space-y-2 mb-4">
                    {(plan.features as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPlanToDelete(plan)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Update the membership plan details"
                : "Create a new membership plan for your members"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Monthly Membership" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the plan..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (one per line)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Monthly newsletter&#10;Event updates&#10;Member badge"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={savePlan.isPending}>
                  {savePlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingPlan ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{planToDelete?.name}" plan. Existing subscriptions
              will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => planToDelete && deletePlan.mutate(planToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
