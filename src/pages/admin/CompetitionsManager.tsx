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
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Trophy } from "lucide-react";
import { format } from "date-fns";

interface Competition { id: string; name: string; description: string | null; event_date: string; is_participation_open: boolean; cover_image_url: string | null; created_at: string; }

export default function CompetitionsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Competition | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Competition | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "", event_date: format(new Date(), "yyyy-MM-dd"), is_participation_open: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: competitions, isLoading } = useQuery({
    queryKey: ["admin-competitions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("competitions").select("*").order("event_date", { ascending: false });
      if (error) throw error;
      return data as Competition[];
    },
  });

  const filteredCompetitions = competitions?.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("competition-images").upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("competition-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let cover_image_url = null;
      if (imageFile) cover_image_url = await uploadImage(imageFile);
      const { error } = await supabase.from("competitions").insert([{ ...data, cover_image_url }]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-competitions"] }); toast({ title: "Competition created successfully" }); resetForm(); },
    onError: (error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      let cover_image_url = editingItem?.cover_image_url || null;
      if (imageFile) cover_image_url = await uploadImage(imageFile);
      const { error } = await supabase.from("competitions").update({ ...data, cover_image_url }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-competitions"] }); toast({ title: "Competition updated successfully" }); resetForm(); },
    onError: (error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("competitions").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-competitions"] }); toast({ title: "Competition deleted successfully" }); setDeleteTarget(null); },
    onError: (error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const resetForm = () => { setFormData({ name: "", description: "", event_date: format(new Date(), "yyyy-MM-dd"), is_participation_open: true }); setEditingItem(null); setImageFile(null); setImagePreview(null); setIsDialogOpen(false); };

  const handleEdit = (item: Competition) => { setEditingItem(item); setFormData({ name: item.name, description: item.description || "", event_date: item.event_date, is_participation_open: item.is_participation_open }); setImagePreview(item.cover_image_url); setIsDialogOpen(true); };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); } };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (editingItem) updateMutation.mutate({ id: editingItem.id, data: formData }); else createMutation.mutate(formData); };

  const exportToCSV = () => {
    if (!competitions) return;
    const headers = ["Name", "Description", "Event Date", "Participation Open", "Created At"];
    const csvData = competitions.map((item) => [item.name, item.description || "", item.event_date, item.is_participation_open ? "Yes" : "No", format(new Date(item.created_at), "yyyy-MM-dd HH:mm")]);
    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `competitions-${format(new Date(), "yyyy-MM-dd")}.csv`; a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Competitions" description="Manage sports competitions and events" searchPlaceholder="Search competitions..." searchValue={searchTerm} onSearchChange={setSearchTerm} onExport={exportToCSV} onAdd={() => { resetForm(); setIsDialogOpen(true); }} addLabel="Add Competition" />

        <div className="bg-card rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Event Date</TableHead><TableHead>Participation</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? [...Array(3)].map((_, i) => (<TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell></TableRow>))
              : filteredCompetitions.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{searchTerm ? "No matching competitions" : "No competitions found"}</TableCell></TableRow>
              ) : filteredCompetitions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.cover_image_url ? <img src={item.cover_image_url} alt={item.name} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-muted rounded flex items-center justify-center"><Trophy className="w-6 h-6 text-muted-foreground" /></div>}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{format(new Date(item.event_date), "MMM d, yyyy")}</TableCell>
                  <TableCell><StatusBadge status={item.is_participation_open ? "open" : "closed"} /></TableCell>
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
          <DialogHeader><DialogTitle>{editingItem ? "Edit Competition" : "Add Competition"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} /></div>
            <div><Label htmlFor="event_date">Event Date *</Label><Input id="event_date" type="date" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} required /></div>
            <div><Label htmlFor="image">Cover Image</Label><Input id="image" type="file" accept="image/*" onChange={handleImageChange} />{imagePreview && <div className="mt-2 relative w-full h-40"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" /></div>}</div>
            <div className="flex items-center gap-2"><Switch id="is_participation_open" checked={formData.is_participation_open} onCheckedChange={(checked) => setFormData({ ...formData, is_participation_open: checked })} /><Label htmlFor="is_participation_open">Participation Open</Label></div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={resetForm}>Cancel</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editingItem ? "Update" : "Create"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete Competition" description={`Are you sure you want to delete "${deleteTarget?.name}"?`} onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)} />
    </AdminLayout>
  );
}
