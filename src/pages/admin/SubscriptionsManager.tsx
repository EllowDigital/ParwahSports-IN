import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CreditCard, Search, Download, Eye, Loader2, Calendar, Crown } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Subscription {
  id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  next_billing_date: string | null;
  razorpay_subscription_id: string | null;
  created_at: string;
  members: {
    full_name: string;
    email: string;
  };
  membership_plans: {
    name: string;
    type: string;
    price: number;
  };
}

export default function SubscriptionsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["admin-subscriptions", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("subscriptions")
        .select(
          `
          *,
          members (
            full_name,
            email
          ),
          membership_plans (
            name,
            type,
            price
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq(
          "status",
          statusFilter as "active" | "cancelled" | "expired" | "pending" | "paused",
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Subscription[];
    },
  });

  const filteredSubscriptions = subscriptions?.filter(
    (s) =>
      s.members.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.members.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeCount = subscriptions?.filter((s) => s.status === "active").length || 0;
  const autoPayCount =
    subscriptions?.filter((s) => s.status === "active" && s.razorpay_subscription_id).length || 0;

  const exportToCSV = () => {
    if (!filteredSubscriptions) return;

    const headers = [
      "Member Name",
      "Email",
      "Plan",
      "Status",
      "Start Date",
      "Next Billing",
      "Razorpay ID",
    ];

    const rows = filteredSubscriptions.map((s) => [
      s.members.full_name,
      s.members.email,
      s.membership_plans.name,
      s.status,
      s.start_date ? format(new Date(s.start_date), "yyyy-MM-dd") : "",
      s.next_billing_date ? format(new Date(s.next_billing_date), "yyyy-MM-dd") : "",
      s.razorpay_subscription_id || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscriptions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "expired":
        return <Badge variant="outline">Expired</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
            <p className="text-muted-foreground">View and manage all subscriptions</p>
          </div>
          <Button onClick={exportToCSV} disabled={!filteredSubscriptions?.length}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptions?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">AutoPay Active</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{autoPayCount}</div>
              <p className="text-xs text-muted-foreground">Recurring payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by member name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscriptions Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>AutoPay</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions?.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{subscription.members.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {subscription.members.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscription.membership_plans.name}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        {subscription.next_billing_date
                          ? format(new Date(subscription.next_billing_date), "MMM dd, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {subscription.razorpay_subscription_id ? (
                          <Badge className="bg-blue-500">Active</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSubscription(subscription)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSubscriptions?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No subscriptions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Details Dialog */}
      <Dialog open={!!selectedSubscription} onOpenChange={() => setSelectedSubscription(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>{selectedSubscription?.membership_plans.name}</DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Member</p>
                  <p className="font-medium">{selectedSubscription.members.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedSubscription.members.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">{selectedSubscription.membership_plans.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    ₹{selectedSubscription.membership_plans.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedSubscription.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">
                    {selectedSubscription.membership_plans.type}
                  </p>
                </div>
                {selectedSubscription.start_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedSubscription.start_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                )}
                {selectedSubscription.next_billing_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Next Billing</p>
                    <p className="font-medium">
                      {format(new Date(selectedSubscription.next_billing_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                )}
              </div>
              {selectedSubscription.razorpay_subscription_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Razorpay Subscription ID</p>
                  <p className="font-mono text-sm">
                    {selectedSubscription.razorpay_subscription_id}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
