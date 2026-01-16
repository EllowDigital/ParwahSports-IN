import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Heart,
  Search,
  Download,
  Eye,
  Loader2,
  Calendar,
  IndianRupee,
} from "lucide-react";
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

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  donor_address: string | null;
  amount: number;
  payment_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_reference: string | null;
  notes: string | null;
  created_at: string;
}

export default function DonationsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const { data: donations, isLoading } = useQuery({
    queryKey: ["admin-donations", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("payment_status", statusFilter as "pending" | "success" | "failed" | "refunded");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Donation[];
    },
  });

  const filteredDonations = donations?.filter(
    (d) =>
      d.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDonations = filteredDonations?.reduce((sum, d) => 
    d.payment_status === "success" ? sum + Number(d.amount) : sum, 0
  ) || 0;

  const successfulCount = filteredDonations?.filter(d => d.payment_status === "success").length || 0;

  const exportToCSV = () => {
    if (!filteredDonations) return;

    const headers = [
      "Reference",
      "Donor Name",
      "Email",
      "Phone",
      "Amount",
      "Status",
      "Razorpay Payment ID",
      "Date",
    ];

    const rows = filteredDonations.map((d) => [
      d.payment_reference || "",
      d.donor_name,
      d.donor_email,
      d.donor_phone || "",
      d.amount.toString(),
      d.payment_status,
      d.razorpay_payment_id || "",
      format(new Date(d.created_at), "yyyy-MM-dd HH:mm"),
    ]);

    const csvContent =
      [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Donations</h1>
            <p className="text-muted-foreground">Manage and track all donations</p>
          </div>
          <Button onClick={exportToCSV} disabled={!filteredDonations?.length}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From successful payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Successful Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successfulCount}</div>
              <p className="text-xs text-muted-foreground">Completed payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredDonations?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All donation attempts</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or reference..."
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
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Donations Table */}
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
                    <TableHead>Reference</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations?.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-mono text-sm">
                        {donation.payment_reference || "-"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{donation.donor_name}</p>
                          <p className="text-sm text-muted-foreground">{donation.donor_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{Number(donation.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(donation.payment_status)}</TableCell>
                      <TableCell>
                        {format(new Date(donation.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredDonations?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No donations found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Donation Details Dialog */}
      <Dialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Reference: {selectedDonation?.payment_reference}
            </DialogDescription>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Donor Name</p>
                  <p className="font-medium">{selectedDonation.donor_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedDonation.donor_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedDonation.donor_phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-lg">
                    ₹{Number(selectedDonation.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedDonation.payment_status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedDonation.created_at), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
              {selectedDonation.donor_address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedDonation.donor_address}</p>
                </div>
              )}
              {selectedDonation.razorpay_payment_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Razorpay Payment ID</p>
                  <p className="font-mono text-sm">{selectedDonation.razorpay_payment_id}</p>
                </div>
              )}
              {selectedDonation.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{selectedDonation.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
