import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { Eye, Trash2, Download, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  area_of_interest: string;
  message: string | null;
  status: string;
  created_at: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500/10 text-yellow-600" },
  { value: "contacted", label: "Contacted", color: "bg-blue-500/10 text-blue-600" },
  { value: "approved", label: "Approved", color: "bg-green-500/10 text-green-600" },
  { value: "rejected", label: "Rejected", color: "bg-red-500/10 text-red-600" },
];

export default function VolunteersManager() {
  const [viewingVolunteer, setViewingVolunteer] = useState<Volunteer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: volunteers, isLoading } = useQuery({
    queryKey: ["admin-volunteers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Volunteer[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("volunteers").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-volunteers"] });
      toast({ title: "Status updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("volunteers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-volunteers"] });
      toast({ title: "Volunteer application deleted" });
    },
    onError: (error) => {
      toast({ title: "Error deleting", description: error.message, variant: "destructive" });
    },
  });

  const exportToCSV = () => {
    if (!volunteers) return;
    const headers = ["Name", "Email", "Phone", "City", "Area of Interest", "Status", "Date"];
    const csvData = volunteers.map((v) => [
      v.full_name,
      v.email,
      v.phone || "",
      v.city || "",
      v.area_of_interest,
      v.status,
      format(new Date(v.created_at), "yyyy-MM-dd"),
    ]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((s) => s.value === status) || statusOptions[0];
    return <span className={`px-2 py-1 rounded-full text-xs ${option.color}`}>{option.label}</span>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Volunteer Applications</h1>
            <p className="text-muted-foreground">Manage volunteer submissions</p>
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : volunteers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No volunteer applications yet
                  </TableCell>
                </TableRow>
              ) : (
                volunteers?.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">{volunteer.full_name}</TableCell>
                    <TableCell>{volunteer.email}</TableCell>
                    <TableCell className="capitalize">{volunteer.area_of_interest}</TableCell>
                    <TableCell>
                      <Select
                        value={volunteer.status}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({ id: volunteer.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue>{getStatusBadge(volunteer.status)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {format(new Date(volunteer.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingVolunteer(volunteer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this application?")) {
                            deleteMutation.mutate(volunteer.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!viewingVolunteer} onOpenChange={() => setViewingVolunteer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Volunteer Application Details</DialogTitle>
          </DialogHeader>
          {viewingVolunteer && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{viewingVolunteer.full_name}</h3>
                {getStatusBadge(viewingVolunteer.status)}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${viewingVolunteer.email}`} className="hover:text-primary">
                    {viewingVolunteer.email}
                  </a>
                </div>
                {viewingVolunteer.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${viewingVolunteer.phone}`} className="hover:text-primary">
                      {viewingVolunteer.phone}
                    </a>
                  </div>
                )}
                {viewingVolunteer.city && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {viewingVolunteer.city}
                  </div>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Area of Interest</p>
                <Badge variant="secondary" className="capitalize">
                  {viewingVolunteer.area_of_interest}
                </Badge>
              </div>

              {viewingVolunteer.message && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">Message</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {viewingVolunteer.message}
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Submitted on {format(new Date(viewingVolunteer.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
