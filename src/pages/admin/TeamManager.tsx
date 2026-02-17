import { useCallback, useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Users, Mail, Phone, Linkedin, Twitter, Upload, X } from "lucide-react";

interface TeamMember {
  id: string; name: string; role: string; bio: string | null; image_url: string | null;
  email: string | null; phone: string | null; public_email: string | null; public_phone: string | null;
  linkedin_url: string | null; twitter_url: string | null; display_order: number | null; is_active: boolean | null; created_at: string;
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "", role: "", bio: "", image_url: "", email: "", phone: "",
    public_email: "", public_phone: "", linkedin_url: "", twitter_url: "",
    display_order: 0, is_active: true,
  });

  const fetchMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("team_members").select("*, team_member_private_contacts(email, phone)").order("display_order", { ascending: true });
      if (error) throw error;
      const normalized = (data || []).map((m: TeamMember & { team_member_private_contacts: { email: string | null; phone: string | null } | null }) => ({
        ...m, email: m.team_member_private_contacts?.email ?? null, phone: m.team_member_private_contacts?.phone ?? null,
      }));
      setMembers(normalized);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({ title: "Error", description: "Failed to load team members", variant: "destructive" });
    } finally { setIsLoading(false); }
  }, [toast]);

  useEffect(() => { void fetchMembers(); }, [fetchMembers]);

  const filteredMembers = members.filter(
    (m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({ name: "", role: "", bio: "", image_url: "", email: "", phone: "", public_email: "", public_phone: "", linkedin_url: "", twitter_url: "", display_order: 0, is_active: true });
    setEditingMember(null); setSelectedFile(null); setPreviewUrl(null);
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({ name: member.name, role: member.role, bio: member.bio || "", image_url: member.image_url || "", email: member.email || "", phone: member.phone || "", public_email: member.public_email || "", public_phone: member.public_phone || "", linkedin_url: member.linkedin_url || "", twitter_url: member.twitter_url || "", display_order: member.display_order || 0, is_active: member.is_active ?? true });
    setPreviewUrl(member.image_url); setIsDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Error", description: "Please select an image file", variant: "destructive" }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Error", description: "Image must be less than 5MB", variant: "destructive" }); return; }
    setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("team-images").upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("team-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    try {
      let imageUrl = formData.image_url || null;
      if (selectedFile) { setIsUploading(true); imageUrl = await uploadToStorage(selectedFile); setIsUploading(false); }
      const payload = { ...formData, image_url: imageUrl, email: null, phone: null, public_email: formData.public_email || null, public_phone: formData.public_phone || null, linkedin_url: formData.linkedin_url || null, twitter_url: formData.twitter_url || null, bio: formData.bio || null };
      if (editingMember) {
        const { error } = await supabase.from("team_members").update(payload).eq("id", editingMember.id);
        if (error) throw error;
        const { error: privateError } = await supabase.from("team_member_private_contacts").upsert({ team_member_id: editingMember.id, email: formData.email || null, phone: formData.phone || null });
        if (privateError) throw privateError;
        toast({ title: "Success", description: "Team member updated successfully" });
      } else {
        const { data: inserted, error } = await supabase.from("team_members").insert([payload]).select("id").single();
        if (error) throw error;
        if (inserted?.id) {
          const { error: privateError } = await supabase.from("team_member_private_contacts").upsert({ team_member_id: inserted.id, email: formData.email || null, phone: formData.phone || null });
          if (privateError) throw privateError;
        }
        toast({ title: "Success", description: "Team member added successfully" });
      }
      setIsDialogOpen(false); resetForm(); fetchMembers();
    } catch (error) {
      console.error("Error saving team member:", error);
      toast({ title: "Error", description: "Failed to save team member", variant: "destructive" });
    } finally { setIsSaving(false); setIsUploading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from("team_members").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      toast({ title: "Success", description: "Team member deleted successfully" }); fetchMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({ title: "Error", description: "Failed to delete team member", variant: "destructive" });
    } finally { setDeleteTarget(null); }
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Team Manager"
          description={`${members.length} team members`}
          searchPlaceholder="Search by name or role..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onAdd={() => { resetForm(); setIsDialogOpen(true); }}
          addLabel="Add Member"
          onRefresh={() => { setIsLoading(true); fetchMembers(); }}
          isRefreshing={isLoading}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}><CardHeader className="pb-3"><div className="flex items-center gap-3"><Skeleton className="w-12 h-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></div></CardHeader></Card>
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card className="border-dashed">
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">{searchTerm ? "No matching members" : "No team members yet"}</h3>
              <p className="text-muted-foreground text-sm">{searchTerm ? "Try a different search" : "Add your first team member"}</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className={`overflow-hidden ${!member.is_active ? "opacity-60" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.image_url || undefined} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(member)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(member)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {member.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{member.bio}</p>}
                  <div className="flex flex-wrap gap-2">
                    {member.email && <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Mail className="w-3 h-3" />Email</a>}
                    {member.phone && <a href={`tel:${member.phone}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Phone className="w-3 h-3" />Phone</a>}
                    {member.linkedin_url && <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Linkedin className="w-3 h-3" />LinkedIn</a>}
                    {member.twitter_url && <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Twitter className="w-3 h-3" />Twitter</a>}
                  </div>
                  {!member.is_active && <p className="text-xs text-destructive mt-2">Inactive</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Member" : "Add New Member"}</DialogTitle>
            <DialogDescription>{editingMember ? "Update the member details below" : "Fill in the details for the new team member"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="role">Role *</Label><Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Coach, Manager" required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} /></div>
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    <Button type="button" size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => { setPreviewUrl(null); setSelectedFile(null); setFormData((prev) => ({ ...prev, image_url: "" })); }}><X className="w-4 h-4" /></Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload photo</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB • JPG, PNG</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="email">Private Email (admin-only)</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="phone">Private Phone (admin-only)</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="public_email">Public Email</Label><Input id="public_email" type="email" value={formData.public_email} onChange={(e) => setFormData({ ...formData, public_email: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="public_phone">Public Phone</Label><Input id="public_phone" value={formData.public_phone} onChange={(e) => setFormData({ ...formData, public_phone: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="linkedin_url">LinkedIn URL</Label><Input id="linkedin_url" value={formData.linkedin_url} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="twitter_url">Twitter URL</Label><Input id="twitter_url" value={formData.twitter_url} onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="display_order">Display Order</Label><Input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-2 pt-6"><Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} /><Label htmlFor="is_active">Active</Label></div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={isSaving || isUploading} className="flex-1">
                {(isSaving || isUploading) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isUploading ? "Uploading..." : editingMember ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete Team Member" description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} onConfirm={handleDelete} />
    </AdminLayout>
  );
}
