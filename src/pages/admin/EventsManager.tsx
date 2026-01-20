import { useCallback, useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Calendar, MapPin, Clock, Upload, X } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  status: string | null;
  created_at: string;
}

const statusOptions = [
  { value: "upcoming", label: "Upcoming", color: "bg-blue-500" },
  { value: "ongoing", label: "Ongoing", color: "bg-green-500" },
  { value: "completed", label: "Completed", color: "bg-gray-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    image_url: "",
    is_featured: false,
    status: "upcoming",
  });

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({ title: "Error", description: "Failed to load events", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      start_time: "",
      end_time: "",
      location: "",
      image_url: "",
      is_featured: false,
      status: "upcoming",
    });
    setEditingEvent(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date,
      start_time: event.start_time || "",
      end_time: event.end_time || "",
      location: event.location || "",
      image_url: event.image_url || "",
      is_featured: event.is_featured || false,
      status: event.status || "upcoming",
    });
    setPreviewUrl(event.image_url);
    setIsDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("event-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = formData.image_url || null;

      if (selectedFile) {
        setIsUploading(true);
        imageUrl = await uploadToStorage(selectedFile);
        setIsUploading(false);
      }

      const payload = {
        ...formData,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        image_url: imageUrl,
      };

      if (editingEvent) {
        const { error } = await supabase.from("events").update(payload).eq("id", editingEvent.id);

        if (error) throw error;
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        const { error } = await supabase.from("events").insert([payload]);

        if (error) throw error;
        toast({ title: "Success", description: "Event created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({ title: "Error", description: "Failed to save event", variant: "destructive" });
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Event deleted successfully" });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const option = statusOptions.find((s) => s.value === status) || statusOptions[0];
    return (
      <Badge variant="secondary" className={`${option.color} text-white`}>
        {option.label}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Events Manager</h1>
            <p className="text-muted-foreground mt-1">Manage your events and calendar</p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
                <DialogDescription>
                  {editingEvent
                    ? "Update the event details below"
                    : "Fill in the details for the new event"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Date *</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      required
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
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Event venue or address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setPreviewUrl(null);
                            setSelectedFile(null);
                            setFormData((prev) => ({ ...prev, image_url: "" }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
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
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                  />
                  <Label htmlFor="is_featured">Featured Event</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setIsDialogOpen(false); resetForm(); }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving || isUploading} className="flex-1">
                    {(isSaving || isUploading) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {isUploading ? "Uploading..." : editingEvent ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No events yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Create your first event</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {event.image_url && (
                    <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          {getStatusBadge(event.status)}
                          {event.is_featured && (
                            <Badge variant="outline" className="border-primary text-primary">
                              Featured
                            </Badge>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(event.event_date), "MMM d, yyyy")}
                          </div>
                          {event.start_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.start_time}
                              {event.end_time && ` - ${event.end_time}`}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(event)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
