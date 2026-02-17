import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Medal } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type ParticipationStatus = Database["public"]["Enums"]["participation_status"];

interface Participation { id: string; student_id: string; competition_id: string; position: string | null; status: ParticipationStatus; notes: string | null; created_at: string; students: { name: string; email: string } | null; competitions: { name: string; event_date: string } | null; }
interface Student { id: string; name: string; email: string; }
interface Competition { id: string; name: string; event_date: string; }

export default function ParticipationsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Participation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Participation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ student_id: "", competition_id: "", position: "", status: "registered" as ParticipationStatus, notes: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: participations, isLoading } = useQuery({
    queryKey: ["admin-participations"],
    queryFn: async () => { const { data, error } = await supabase.from("participations").select(`*, students:student_id(name, email), competitions:competition_id(name, event_date)`).order("created_at", { ascending: false }); if (error) throw error; return data as Participation[]; },
  });

  const { data: students } = useQuery({ queryKey: ["students-list"], queryFn: async () => { const { data, error } = await supabase.from("students").select("id, name, email").eq("is_active", true).order("name"); if (error) throw error; return data as Student[]; } });
  const { data: competitions } = useQuery({ queryKey: ["competitions-list"], queryFn: async () => { const { data, error } = await supabase.from("competitions").select("id, name, event_date").order("event_date", { ascending: false }); if (error) throw error; return data as Competition[]; } });

  const filteredParticipations = participations?.filter((p) => (p.students?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (p.competitions?.name || "").toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => { const { error } = await supabase.from("participations").insert([{ student_id: data.student_id, competition_id: data.competition_id, position: data.position || null, status: data.status, notes: data.notes || null }]); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-participations"] }); toast({ title: "Participation created" }); resetForm(); },
    onError: (error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => { const { error } = await supabase.from("participations").update({ student_id: data.student_id, competition_id: data.competition_id, position: data.position || null, status: data.status, notes: data.notes || null }).eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-participations"] }); toast({ title: "Participation updated" }); resetForm(); },
    onError: (error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("participations").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-participations"] }); toast({ title: "Participation deleted" }); setDeleteTarget(null); },
    onError: (error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const resetForm = () => { setFormData({ student_id: "", competition_id: "", position: "", status: "registered", notes: "" }); setEditingItem(null); setIsDialogOpen(false); };

  const handleEdit = (item: Participation) => { setEditingItem(item); setFormData({ student_id: item.student_id, competition_id: item.competition_id, position: item.position || "", status: item.status, notes: item.notes || "" }); setIsDialogOpen(true); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (editingItem) updateMutation.mutate({ id: editingItem.id, data: formData }); else createMutation.mutate(formData); };

  const exportToCSV = () => {
    if (!participations) return;
    const headers = ["Student", "Competition", "Position", "Status", "Notes", "Created At"];
    const csvData = participations.map((item) => [item.students?.name || "", item.competitions?.name || "", item.position || "", item.status, item.notes || "", format(new Date(item.created_at), "yyyy-MM-dd HH:mm")]);
    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" }); const url = window.URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `participations-${format(new Date(), "yyyy-MM-dd")}.csv`; a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Participations" description="Manage student participations in competitions" searchPlaceholder="Search by student or competition..." searchValue={searchTerm} onSearchChange={setSearchTerm} onExport={exportToCSV} onAdd={() => { resetForm(); setIsDialogOpen(true); }} addLabel="Add Participation" />

        <div className="bg-card rounded-lg border border-border">
          <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Competition</TableHead><TableHead>Position</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? [...Array(3)].map((_, i) => (<TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>))
              : filteredParticipations.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{searchTerm ? "No matching participations" : "No participations found"}</TableCell></TableRow>
              ) : filteredParticipations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.students?.name || "Unknown"}</TableCell>
                  <TableCell><div><div>{item.competitions?.name || "Unknown"}</div>{item.competitions?.event_date && <div className="text-xs text-muted-foreground">{format(new Date(item.competitions.event_date), "MMM d, yyyy")}</div>}</div></TableCell>
                  <TableCell>{item.position ? <span className="flex items-center gap-1"><Medal className="w-4 h-4 text-secondary" />{item.position}</span> : "-"}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(item)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingItem ? "Edit Participation" : "Add Participation"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Student *</Label><Select value={formData.student_id} onValueChange={(value) => setFormData({ ...formData, student_id: value })}><SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger><SelectContent>{students?.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name} ({s.email})</SelectItem>))}</SelectContent></Select></div>
            <div><Label>Competition *</Label><Select value={formData.competition_id} onValueChange={(value) => setFormData({ ...formData, competition_id: value })}><SelectTrigger><SelectValue placeholder="Select a competition" /></SelectTrigger><SelectContent>{competitions?.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name} ({format(new Date(c.event_date), "MMM d, yyyy")})</SelectItem>))}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="position">Position</Label><Input id="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} placeholder="e.g., 1st, 2nd" /></div>
              <div><Label>Status</Label><Select value={formData.status} onValueChange={(value: ParticipationStatus) => setFormData({ ...formData, status: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="registered">Registered</SelectItem><SelectItem value="participated">Participated</SelectItem><SelectItem value="winner">Winner</SelectItem><SelectItem value="runner_up">Runner Up</SelectItem><SelectItem value="disqualified">Disqualified</SelectItem></SelectContent></Select></div>
            </div>
            <div><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} /></div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={resetForm}>Cancel</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editingItem ? "Update" : "Create"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete Participation" description="Are you sure you want to delete this participation record?" onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)} />
    </AdminLayout>
  );
}
