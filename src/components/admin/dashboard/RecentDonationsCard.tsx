import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IndianRupee, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentDonation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  payment_status: string | null;
  created_at: string;
}

interface RecentDonationsCardProps {
  donations: RecentDonation[];
  isLoading: boolean;
}

const statusColor: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  failed: "bg-red-500/10 text-red-700 border-red-200",
  refunded: "bg-violet-500/10 text-violet-700 border-violet-200",
};

export function RecentDonationsCard({ donations, isLoading }: RecentDonationsCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" />
              Recent Donations
            </CardTitle>
            <CardDescription className="text-xs mt-1">Latest donation transactions</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
            <Link to="/admin/donations">View all <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <IndianRupee className="w-7 h-7 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No donations yet</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-medium">Donor</TableHead>
                  <TableHead className="text-xs font-medium text-right">Amount</TableHead>
                  <TableHead className="text-xs font-medium text-center">Status</TableHead>
                  <TableHead className="text-xs font-medium text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((d) => (
                  <TableRow key={d.id} className="hover:bg-accent/30">
                    <TableCell className="py-2.5">
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[140px]">{d.donor_name}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{d.donor_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 text-right">
                      <span className="text-sm font-bold text-foreground">
                        ₹{Number(d.amount).toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 text-center">
                      <Badge variant="outline" className={`text-[10px] ${statusColor[d.payment_status || "pending"] || ""}`}>
                        {d.payment_status || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5 text-right">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(d.created_at), "MMM d")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
