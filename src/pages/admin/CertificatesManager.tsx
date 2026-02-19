import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Award, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Certificate {
  id: string;
  student_id: string;
  competition_id: string | null;
  participation_id: string | null;
  title: string;
  description: string | null;
  certificate_url: string;
  issue_date: string;
  created_at: string;
  students: { name: string; email: string } | null;
  competitions: { name: string } | null;
}
interface Student {
  id: string;
  name: string;
  email: string;
}
interface Competition {
  id: string;
  name: string;
}

export default function CertificatesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    student_id: "",
    competition_id: "",
    title: "",
    description: "",
    issue_date: format(new Date(), "yyyy-MM-dd"),
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select(`*, students:student_id(name, email), competitions:competition_id(name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Certificate[];
    },
  });

  const { data: students } = useQuery({
    queryKey: ["students-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("id, name, email")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as Student[];
    },
  });
  const { data: competitions } = useQuery({
    queryKey: ["competitions-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("competitions").select("id, name").order("name");
      if (error) throw error;
      return data as Competition[];
    },
  });

  const filteredCertificates =
    certificates?.filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.students?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const uploadCertificate = async (file: File, studentId: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${studentId}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("certificates")
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("certificates").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!certificateFile) throw new Error("Please select a certificate file");
      const certificate_url = await uploadCertificate(certificateFile, data.student_id);
      const { error } = await supabase.from("certificates").insert([
        {
          student_id: data.student_id,
          competition_id: data.competition_id || null,
          title: data.title,
          description: data.description || null,
          certificate_url,
          issue_date: data.issue_date,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast({ title: "Certificate uploaded" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      let certificate_url = editingItem?.certificate_url;
      if (certificateFile)
        certificate_url = await uploadCertificate(certificateFile, data.student_id);
      const { error } = await supabase
        .from("certificates")
        .update({
          student_id: data.student_id,
          competition_id: data.competition_id || null,
          title: data.title,
          description: data.description || null,
          certificate_url,
          issue_date: data.issue_date,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast({ title: "Certificate updated" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast({ title: "Certificate deleted" });
      setDeleteTarget(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      student_id: "",
      competition_id: "",
      title: "",
      description: "",
      issue_date: format(new Date(), "yyyy-MM-dd"),
    });
    setEditingItem(null);
    setCertificateFile(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Certificate) => {
    setEditingItem(item);
    setFormData({
      student_id: item.student_id,
      competition_id: item.competition_id || "",
      title: item.title,
      description: item.description || "",
      issue_date: item.issue_date,
    });
    setIsDialogOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) updateMutation.mutate({ id: editingItem.id, data: formData });
    else createMutation.mutate(formData);
  };

  const exportToCSV = () => {
    if (!certificates) return;
    const headers = [
      "Student",
      "Title",
      "Competition",
      "Issue Date",
      "Certificate URL",
      "Created At",
    ];
    const csvData = certificates.map((item) => [
      item.students?.name || "",
      item.title,
      item.competitions?.name || "",
      item.issue_date,
      item.certificate_url,
      format(new Date(item.created_at), "yyyy-MM-dd HH:mm"),
    ]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificates-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Certificates"
          description="Upload and manage student certificates"
          searchPlaceholder="Search certificates..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onExport={exportToCSV}
          onAdd={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          addLabel="Upload Certificate"
        />

        <div className="bg-card rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredCertificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No matching certificates" : "No certificates found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCertificates.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-secondary" />
                        {item.students?.name || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.competitions?.name || "-"}</TableCell>
                    <TableCell>{format(new Date(item.issue_date), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={item.certificate_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(item)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Certificate" : "Upload Certificate"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Student *</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => setFormData({ ...formData, student_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Winner Certificate - State Championship"
              />
            </div>
            <div>
              <Label>Competition (Optional)</Label>
              <Select
                value={formData.competition_id}
                onValueChange={(value) => setFormData({ ...formData, competition_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a competition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {competitions?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="certificate">
                Certificate File (PDF/Image) {!editingItem && "*"}
              </Label>
              <Input
                id="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                required={!editingItem}
              />
              {editingItem && (
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to keep existing file
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? "Update" : "Upload"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Certificate"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </AdminLayout>
  );
}
