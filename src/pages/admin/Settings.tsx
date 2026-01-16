import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, User, Key } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {user?.email?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">Administrator</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">User ID</p>
                    <p className="font-mono text-xs text-foreground truncate">{user?.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Sign In</p>
                    <p className="text-foreground">
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>Security information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Key className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Admin Access</p>
                  <p className="text-sm text-muted-foreground">
                    You have full administrator privileges
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border text-sm text-muted-foreground">
                <p>
                  To change your password or update security settings, please contact the system
                  administrator or use the Supabase dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>About This CMS</CardTitle>
              <CardDescription>
                Content Management System for Parwah Sports Charitable Trust
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">Gallery Management</p>
                  <p className="text-muted-foreground">
                    Upload and organize photos to showcase events, activities, and achievements.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Events Calendar</p>
                  <p className="text-muted-foreground">
                    Create and manage events to keep your community informed about upcoming
                    activities.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Team Directory</p>
                  <p className="text-muted-foreground">
                    Manage team member profiles including roles, bios, and contact information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
