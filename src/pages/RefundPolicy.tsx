import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function RefundPolicy() {
  useEffect(() => {
    document.title = "Refund Policy | Parwah Sports";
  }, []);

  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Cancellation &amp; Refund Policy
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
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    Donations are non-refundable
                  </h2>
                  <p className="text-muted-foreground">
                    Donations made on this website are generally non-refundable.
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Exceptions</h2>
                  <p className="text-muted-foreground">
                    Refunds may be considered only in the following cases:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Duplicate payment for the same donation.</li>
                    <li>Technical error that results in an incorrect charge.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">How to request a review</h2>
                  <p className="text-muted-foreground">
                    If you believe you qualify for a refund, please contact our support within
                    <span className="font-medium text-foreground"> 7 days</span> of the transaction.
                    We will review the request and respond after verification.
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
