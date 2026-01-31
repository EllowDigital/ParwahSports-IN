import { useState, useMemo, useRef } from "react";
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
import { FileText, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface BlogItem {
  id: string;
  title: string;
  content: string | null;
  featured_image_url: string | null;
  author: string | null;
  publish_date: string;
  status: string;
  created_at: string;
}

export default function BlogsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    publish_date: format(new Date(), "yyyy-MM-dd"),
    status: "draft",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blogs, isLoading, refetch } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogItem[];
    },
  });

  const filteredItems = useMemo(() => {
    if (!blogs) return [];
    if (!searchQuery) return blogs;
    const query = searchQuery.toLowerCase();
    return blogs.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.author?.toLowerCase().includes(query)
    );
  }, [blogs, searchQuery]);

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let featured_image_url = null;
      if (imageFile) {
        setIsUploading(true);
        featured_image_url = await uploadImage(imageFile);
        setIsUploading(false);
      }
      const { error } = await supabase.from("blogs").insert([{ ...data, featured_image_url }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({ title: "Blog created successfully" });
      resetForm();
    },
    onError: (error) => {
      setIsUploading(false);
      toast({ title: "Error creating blog", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      let featured_image_url = editingItem?.featured_image_url || null;
      if (imageFile) {
        setIsUploading(true);
        featured_image_url = await uploadImage(imageFile);
        setIsUploading(false);
      }
      const { error } = await supabase
        .from("blogs")
        .update({ ...data, featured_image_url })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({ title: "Blog updated successfully" });
      resetForm();
    },
    onError: (error) => {
      setIsUploading(false);
      toast({ title: "Error updating blog", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({ title: "Blog deleted successfully" });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({ title: "Error deleting blog", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      author: "",
      publish_date: format(new Date(), "yyyy-MM-dd"),
      status: "draft",
    });
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: BlogItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content || "",
      author: item.author || "",
      publish_date: item.publish_date,
      status: item.status,
    });
    setImagePreview(item.featured_image_url);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
    if (!blogs) return;
    const headers = ["Title", "Author", "Status", "Publish Date", "Created At"];
    const csvData = blogs.map((item) => [
      item.title,
      item.author || "",
      item.status,
      item.publish_date,
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
    a.download = `blogs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const columns = [
    {
      key: "image",
      header: "",
      className: "w-16",
      render: (item: BlogItem) =>
        item.featured_image_url ? (
          <img
            src={item.featured_image_url}
            alt={item.title}
            className="w-12 h-12 object-cover rounded-lg"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        ),
    },
    {
      key: "title",
      header: "Blog",
      render: (item: BlogItem) => (
        <div className="max-w-[250px]">
          <p className="font-medium text-foreground truncate">{item.title}</p>
          {item.author && (
            <p className="text-xs text-muted-foreground mt-0.5">by {item.author}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: BlogItem) => <StatusBadge status={item.status} />,
    },
    {
      key: "publish_date",
      header: "Publish Date",
      className: "hidden sm:table-cell",
      render: (item: BlogItem) => (
        <span className="text-muted-foreground">
          {format(new Date(item.publish_date), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (item: BlogItem) => (
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
          title="Blogs & Articles"
          description="Manage blog posts and articles"
          searchPlaceholder="Search blogs..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={exportToCSV}
          onAdd={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          addLabel="Add Blog"
          onRefresh={() => refetch()}
          isRefreshing={isLoading}
        />

        <DataTable
          columns={columns}
          data={filteredItems}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          emptyIcon={FileText}
          emptyTitle="No blog posts yet"
          emptyDescription="Create your first blog post to get started"
          emptyActionLabel="Add Blog"
          onEmptyAction={() => setIsDialogOpen(true)}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Blog" : "Add Blog"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the blog post details" : "Create a new blog post"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog content here..."
                />
              </div>
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload image</p>
                      <p className="text-xs text-muted-foreground mt-1">Max 5MB • JPG, PNG, GIF</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
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
                  disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                >
                  {(createMutation.isPending || updateMutation.isPending || isUploading) && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {isUploading ? "Uploading..." : editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Delete Blog Post"
          description="Are you sure you want to delete this blog post? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
          isLoading={deleteMutation.isPending}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  );
}
