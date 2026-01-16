import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsAndConditions() {
  useEffect(() => {
    document.title = "Terms and Conditions | Parwah Sports";
  }, []);

  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Terms and Conditions
            </h1>
            <p className="mt-4 text-muted-foreground">Last updated: January 16, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="border-border/50">
              <CardContent className="p-6 lg:p-10 space-y-6">
                <p className="text-muted-foreground">
                  By accessing and using this website, you agree to the terms and conditions below.
                  If you do not agree, please do not use the website.
                </p>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Donations</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Donations made on this website are voluntary.</li>
                    <li>
                      Donations are intended to support the activities and initiatives of Parwah
                      Sports Charitable Trust.
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Website updates</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      The content on this website and these policies may be updated at any time
                      without prior notice.
                    </li>
                    <li>
                      Continued use of the website after updates implies acceptance of the revised
                      terms.
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Acceptance of terms</h2>
                  <p className="text-muted-foreground">
                    Use of this website implies that you have read, understood, and accepted these
                    Terms and Conditions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
