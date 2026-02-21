import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Award, Clock, Check, Loader2 } from "lucide-react";
import victoryImage from "@/assets/victory-moment.jpg";

const volunteerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  city: z.string().optional(),
  area_of_interest: z.string().min(1, "Please select an area of interest"),
  message: z.string().optional(),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

const areasOfInterest = [
  { value: "volunteer", label: "Volunteer" },
  { value: "coach", label: "Coach" },
  { value: "mentor", label: "Mentor" },
  { value: "support", label: "Administrative Support" },
];

const benefits = [
  {
    icon: Heart,
    title: "Make an Impact",
    description: "Help young athletes achieve their dreams",
  },
  {
    icon: Users,
    title: "Join a Community",
    description: "Connect with like-minded individuals",
  },
  {
    icon: Award,
    title: "Develop Skills",
    description: "Gain experience in coaching and mentoring",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Contribute on your own schedule",
  },
];

const volunteerFaqs = [
  {
    question: "What kind of volunteer roles are available?",
    answer:
      "We offer roles in coaching, mentoring, event management, administrative support, and social media outreach. Choose what matches your skills and interests.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "There's no fixed time commitment. You can help at a single event or volunteer regularly — it's completely flexible based on your availability.",
  },
  {
    question: "Do I need any qualifications to volunteer?",
    answer:
      "No formal qualifications required. A passion for sports and helping young athletes is all you need. We provide any necessary training.",
  },
  {
    question: "Will I receive a certificate for volunteering?",
    answer:
      "Yes, all volunteers receive a certificate of appreciation. Regular volunteers may also receive recommendation letters and references.",
  },
  {
    question: "Can I volunteer remotely?",
    answer:
      "Yes! We have remote opportunities in social media management, content creation, fundraising support, and administrative tasks.",
  },
];

const volunteerFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: volunteerFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Volunteer() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      city: "",
      area_of_interest: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      const { error } = await supabase.from("volunteers").insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          city: data.city || null,
          area_of_interest: data.area_of_interest,
          message: data.message || null,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll be in touch soon!",
      });

      // Fire-and-forget confirmation email
      void supabase.functions
        .invoke("volunteer-confirmation-email", {
          body: { email: variables.email, full_name: variables.full_name },
        })
        .catch((e) => console.warn("Volunteer confirmation email failed:", e));
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VolunteerFormData) => {
    mutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center py-16">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your volunteer application has been submitted successfully. Our team will review
                your application and get back to you soon.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Volunteer With Us - Join Parwah Sports"
        description="Volunteer with Parwah Sports Charitable Trust. Help empower athletes, coach youth sports, organize events, and make a difference in sports development across India."
        path="/volunteer"
        keywords="sports volunteer India, volunteer opportunities, sports NGO volunteer, youth coaching volunteer, Parwah Sports volunteer"
        jsonLd={volunteerFaqJsonLd}
      />
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={victoryImage} alt="Volunteers" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/60" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Join Our Team
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6">
              Become a <span className="text-secondary">Volunteer</span>
            </h1>
            <p className="text-xl text-background/80 leading-relaxed">
              Share your skills, time, and passion to make a difference in the lives of young
              athletes. Join our volunteer network today.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Why Volunteer With Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Volunteering is more than giving time—it's about making a lasting impact
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-border/50">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Volunteer Application Form</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get in touch with you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="area_of_interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area of Interest *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your area of interest" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {areasOfInterest.map((area) => (
                                <SelectItem key={area.value} value={area.value}>
                                  {area.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Why do you want to volunteer? (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself and why you'd like to volunteer..."
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Volunteer FAQs</h2>
              <p className="text-muted-foreground">
                Have questions about volunteering? We've got answers.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {volunteerFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </Layout>
  );
}
