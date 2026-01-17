import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Download, Trophy, LogOut } from "lucide-react";
import { format } from "date-fns";

export default function StudentDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate("/student/login");
  }, [user, navigate]);

  const { data: student } = useQuery({
    queryKey: ["student-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error) throw error;
      setStudentId(data.id);
      return data;
    },
    enabled: !!user,
  });

  const { data: certificates } = useQuery({
    queryKey: ["student-certificates", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*, competitions:competition_id(name)")
        .eq("student_id", studentId!)
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });

  const { data: participations } = useQuery({
    queryKey: ["student-participations", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("participations")
        .select("*, competitions:competition_id(name, event_date)")
        .eq("student_id", studentId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/student/login");
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {student?.name || "Student"}</h1>
            <p className="text-muted-foreground">
              View your certificates and participation history
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" /> Certificates
              </CardTitle>
              <CardDescription>{certificates?.length || 0} certificates earned</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" /> Participations
              </CardTitle>
              <CardDescription>
                {participations?.length || 0} competitions participated
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            {certificates?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No certificates yet</p>
            ) : (
              <div className="space-y-4">
                {certificates?.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.competitions?.name && `${cert.competitions.name} • `}
                        Issued: {format(new Date(cert.issue_date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participation History</CardTitle>
          </CardHeader>
          <CardContent>
            {participations?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No participations yet</p>
            ) : (
              <div className="space-y-4">
                {participations?.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{p.competitions?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {p.competitions?.event_date &&
                          format(new Date(p.competitions.event_date), "MMM d, yyyy")}
                        {p.position && ` • Position: ${p.position}`}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${p.status === "winner" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}
                    >
                      {p.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
