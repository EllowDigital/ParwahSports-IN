import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function ShippingPolicy() {
  useEffect(() => {
    document.title = "Shipping Policy | Parwah Sports";
  }, []);

  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Shipping Policy
            </h1>
            <p className="mt-4 text-muted-foreground">Last updated: January 16, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="border-border/50">
              <CardContent className="p-6 lg:p-10 space-y-5">
                <p className="text-foreground">
                  Parwah Sports Charitable Trust is a non-profit NGO. We do not sell any physical
                  products on this website.
                </p>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">No shipping required</h2>
                  <p className="text-muted-foreground">
                    Since no physical goods are sold, there is no shipping or delivery involved.
                    Payments made on this website are donations only.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="font-medium text-foreground">Shipping is not applicable.</p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Questions</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about a donation or payment on our website, please
                    reach out via the contact page.
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
