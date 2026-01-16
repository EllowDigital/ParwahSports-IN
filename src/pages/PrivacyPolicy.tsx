import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Parwah Sports";
  }, []);

  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Privacy Policy
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
                  This Privacy Policy describes how Parwah Sports Charitable Trust collects and uses
                  information when you make a donation or interact with our website.
                </p>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Information we collect</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Basic user information such as name and email.</li>
                    <li>Payment details required to process donations.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">How we use information</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>To process donations and provide payment confirmations/receipts.</li>
                    <li>To communicate with you regarding your donation or related queries.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Payment processing</h2>
                  <p className="text-muted-foreground">
                    All payments are securely processed via Razorpay. We do not store your full card
                    details on our servers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Sharing of information</h2>
                  <p className="text-muted-foreground">
                    We do not sell or share your personal data with third parties for marketing.
                    Information may be shared only as needed to process payments or comply with
                    applicable laws.
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
