import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import { Bell, AlertTriangle, AlertCircle, Info, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type AnnouncementPriority = Database["public"]["Enums"]["announcement_priority"];

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

const priorityIcons = {
  normal: Info,
  important: AlertCircle,
  urgent: AlertTriangle,
};

export default function AnnouncementsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "normal" as AnnouncementPriority,
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: announcements,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Announcement[];
    },
  });

  const filteredItems = useMemo(() => {
    if (!announcements) return [];
    if (!searchQuery) return announcements;
    const query = searchQuery.toLowerCase();
    return announcements.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.message.toLowerCase().includes(query),
    );
  }, [announcements, searchQuery]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const insertData = {
        ...data,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
      };
      const { error } = await supabase.from("announcements").insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
      queryClient.invalidateQueries({ queryKey: ["active-announcements"] });
      toast({ title: "Announcement created successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error creating announcement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const updateData = {
        ...data,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
      };
      const { error } = await supabase.from("announcements").update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
      queryClient.invalidateQueries({ queryKey: ["active-announcements"] });
      toast({ title: "Announcement updated successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error updating announcement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
      queryClient.invalidateQueries({ queryKey: ["active-announcements"] });
      toast({ title: "Announcement deleted successfully" });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting announcement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      priority: "normal",
      start_date: "",
      end_date: "",
      is_active: true,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      message: item.message,
      priority: item.priority,
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const exportToCSV = () => {
    if (!announcements) return;
    const headers = [
      "Title",
      "Message",
      "Priority",
      "Active",
      "Start Date",
      "End Date",
      "Created At",
    ];
    const csvData = announcements.map((item) => [
      item.title,
      item.message,
      item.priority,
      item.is_active ? "Yes" : "No",
      item.start_date || "",
      item.end_date || "",
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
    a.download = `announcements-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const columns = [
    {
      key: "title",
      header: "Announcement",
      render: (item: Announcement) => {
        const PriorityIcon = priorityIcons[item.priority];
        return (
          <div className="flex items-start gap-3 max-w-[300px]">
            <div className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5">
              <PriorityIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{item.message}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "priority",
      header: "Priority",
      className: "hidden md:table-cell",
      render: (item: Announcement) => <StatusBadge status={item.priority} />,
    },
    {
      key: "status",
      header: "Status",
      render: (item: Announcement) => (
        <StatusBadge status={item.is_active ? "active" : "inactive"} />
      ),
    },
    {
      key: "date_range",
      header: "Date Range",
      className: "hidden lg:table-cell",
      render: (item: Announcement) => (
        <span className="text-sm text-muted-foreground">
          {item.start_date || item.end_date
            ? `${item.start_date ? format(new Date(item.start_date), "MMM d") : "..."} - ${item.end_date ? format(new Date(item.end_date), "MMM d, yyyy") : "..."}`
            : "Always"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (item: Announcement) => (
        <ActionButtons onEdit={() => handleEdit(item)} onDelete={() => setDeleteId(item.id)} />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Announcements"
          description="Manage notices and alerts displayed to users"
          searchPlaceholder="Search announcements..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={exportToCSV}
          onAdd={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          addLabel="Add Announcement"
          onRefresh={() => refetch()}
          isRefreshing={isLoading}
        />

        <DataTable
          columns={columns}
          data={filteredItems}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          emptyIcon={Bell}
          emptyTitle="No announcements yet"
          emptyDescription="Create your first announcement to notify users"
          emptyActionLabel="Add Announcement"
          onEmptyAction={() => setIsDialogOpen(true)}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Announcement" : "Add Announcement"}</DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the announcement details"
                  : "Create a new announcement for your users"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="The main announcement message"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: AnnouncementPriority) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date (Optional)</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <div>
                  <Label htmlFor="is_active" className="cursor-pointer">
                    Active
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Active announcements are displayed to users
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Delete Announcement"
          description="Are you sure you want to delete this announcement? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
          isLoading={deleteMutation.isPending}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  );
}
