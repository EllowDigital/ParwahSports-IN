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
import { Newspaper, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  description: string | null;
  publish_date: string;
  status: string;
  created_at: string;
}

export default function NewsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publish_date: format(new Date(), "yyyy-MM-dd"),
    status: "draft",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: newsItems, isLoading, refetch } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as NewsItem[];
    },
  });

  const filteredItems = useMemo(() => {
    if (!newsItems) return [];
    if (!searchQuery) return newsItems;
    const query = searchQuery.toLowerCase();
    return newsItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [newsItems, searchQuery]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("news").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast({ title: "News article created successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error creating news", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("news").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast({ title: "News article updated successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error updating news", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast({ title: "News article deleted successfully" });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({ title: "Error deleting news", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      publish_date: format(new Date(), "yyyy-MM-dd"),
      status: "draft",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      publish_date: item.publish_date,
      status: item.status,
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
    if (!newsItems) return;
    const headers = ["Title", "Description", "Publish Date", "Status", "Created At"];
    const csvData = newsItems.map((item) => [
      item.title,
      item.description || "",
      item.publish_date,
      item.status,
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
    a.download = `news-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (item: NewsItem) => (
        <div className="max-w-[250px]">
          <p className="font-medium text-foreground truncate">{item.title}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: NewsItem) => <StatusBadge status={item.status} />,
    },
    {
      key: "publish_date",
      header: "Publish Date",
      className: "hidden sm:table-cell",
      render: (item: NewsItem) => (
        <span className="text-muted-foreground">
          {format(new Date(item.publish_date), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (item: NewsItem) => (
        <ActionButtons
          onEdit={() => handleEdit(item)}
          onDelete={() => setDeleteId(item.id)}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="News & Updates"
          description="Manage news articles and updates"
          searchPlaceholder="Search news..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={exportToCSV}
          onAdd={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          addLabel="Add News"
          onRefresh={() => refetch()}
          isRefreshing={isLoading}
        />

        <DataTable
          columns={columns}
          data={filteredItems}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          emptyIcon={Newspaper}
          emptyTitle="No news articles yet"
          emptyDescription="Create your first news article to get started"
          emptyActionLabel="Add News"
          onEmptyAction={() => setIsDialogOpen(true)}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit News" : "Add News"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the news article details" : "Create a new news article"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter news title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the news"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publish_date">Publish Date</Label>
                  <Input
                    id="publish_date"
                    type="date"
                    value={formData.publish_date}
                    onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
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
          title="Delete News Article"
          description="Are you sure you want to delete this news article? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
          isLoading={deleteMutation.isPending}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  );
}
