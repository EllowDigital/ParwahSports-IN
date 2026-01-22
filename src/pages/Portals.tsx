import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Users, ArrowRight, ShieldCheck } from "lucide-react";

export default function Portals() {
  return (
    <Layout>
      <section className="bg-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShieldCheck className="h-4 w-4" />
              Member & Student Access
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Portals
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the right portal to access memberships, certificates, and participation records.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Member Portal</CardTitle>
                    <CardDescription>
                      Become a member, manage your subscription, and view payment history.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="gap-2">
                    <Link to="/member/login">
                      Member Login <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="gap-2">
                    <Link to="/membership">View Membership Plans</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  New member? Choose a plan first, then create your account.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Student Portal</CardTitle>
                    <CardDescription>
                      Students can view certificates and participation records securely.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="gap-2">
                  <Link to="/student/login">
                    Student Login <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Students receive login credentials from the Parwah Sports team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
