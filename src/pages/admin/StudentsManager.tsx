import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Download, GraduationCap, Key } from "lucide-react";
import { format } from "date-fns";

interface Student {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  student_id: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export default function StudentsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    student_id: "",
    phone: "",
    is_active: true,
    create_account: false,
    password: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Student[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let user_id = null;

      // Create auth account if requested
      if (data.create_account && data.password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.name,
            },
          },
        });
        if (authError) throw authError;
        user_id = authData.user?.id;

        // Add student role
        if (user_id) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert([{ user_id, role: "student" }]);
          if (roleError) console.error("Error adding student role:", roleError);
        }
      }

      const { error } = await supabase.from("students").insert([
        {
          name: data.name,
          email: data.email,
          student_id: data.student_id || null,
          phone: data.phone || null,
          is_active: data.is_active,
          user_id,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast({ title: "Student created successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error creating student",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("students")
        .update({
          name: data.name,
          email: data.email,
          student_id: data.student_id || null,
          phone: data.phone || null,
          is_active: data.is_active,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast({ title: "Student updated successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error updating student",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast({ title: "Student deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting student",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      student_id: "",
      phone: "",
      is_active: true,
      create_account: false,
      password: "",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Student) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      email: item.email,
      student_id: item.student_id || "",
      phone: item.phone || "",
      is_active: item.is_active,
      create_account: false,
      password: "",
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
    if (!students) return;
    const headers = ["Name", "Email", "Student ID", "Phone", "Active", "Has Account", "Created At"];
    const csvData = students.map((item) => [
      item.name,
      item.email,
      item.student_id || "",
      item.phone || "",
      item.is_active ? "Yes" : "No",
      item.user_id ? "Yes" : "No",
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
    a.download = `students-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground">Manage students and their accounts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" /> Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Student" : "Add Student"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student_id">Student ID</Label>
                      <Input
                        id="student_id"
                        value={formData.student_id}
                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: checked })
                      }
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  {!editingItem && (
                    <>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="create_account"
                          checked={formData.create_account}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, create_account: checked })
                          }
                        />
                        <Label htmlFor="create_account">Create Login Account</Label>
                      </div>
                      {formData.create_account && (
                        <div>
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={formData.create_account}
                            minLength={6}
                          />
                          <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingItem ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
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
              ) : students?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.student_id || "-"}</TableCell>
                    <TableCell>
                      {item.user_id ? (
                        <span className="flex items-center gap-1 text-primary">
                          <Key className="w-3 h-3" /> Has Account
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No Account</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.is_active
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(item.id)}
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
    </AdminLayout>
  );
}
