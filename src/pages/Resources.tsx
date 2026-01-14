import { Layout } from "@/components/layout/Layout";
import { FileText, Download, BookOpen, ClipboardList, Award, FileCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    title: "Training Materials",
    icon: BookOpen,
    description: "Comprehensive guides for athletes and coaches",
    resources: [
      { name: "Basic Training Guide", type: "PDF", size: "2.5 MB" },
      { name: "Taekwondo Techniques Manual", type: "PDF", size: "5.2 MB" },
      { name: "Nutrition Guide for Athletes", type: "PDF", size: "1.8 MB" },
      { name: "Mental Conditioning Handbook", type: "PDF", size: "3.1 MB" },
    ],
  },
  {
    title: "Coaching Resources",
    icon: ClipboardList,
    description: "Professional development materials for coaches",
    resources: [
      { name: "Coaching Certification Syllabus", type: "PDF", size: "4.0 MB" },
      { name: "Training Session Templates", type: "DOC", size: "1.2 MB" },
      { name: "Athlete Assessment Forms", type: "PDF", size: "0.8 MB" },
      { name: "Safety Guidelines", type: "PDF", size: "1.5 MB" },
    ],
  },
  {
    title: "Event Reports",
    icon: FileCheck,
    description: "Documentation of our events and programs",
    resources: [
      { name: "Annual Report 2023", type: "PDF", size: "8.5 MB" },
      { name: "Championship Summary 2023", type: "PDF", size: "3.2 MB" },
      { name: "Impact Assessment Report", type: "PDF", size: "4.7 MB" },
      { name: "Summer Camp Report 2024", type: "PDF", size: "2.9 MB" },
    ],
  },
  {
    title: "Technical Documents",
    icon: FileText,
    description: "Rules, regulations, and technical specifications",
    resources: [
      { name: "Competition Rules & Regulations", type: "PDF", size: "2.1 MB" },
      { name: "Equipment Standards Guide", type: "PDF", size: "1.6 MB" },
      { name: "Grading System Document", type: "PDF", size: "0.9 MB" },
      { name: "Anti-Doping Guidelines", type: "PDF", size: "1.3 MB" },
    ],
  },
];

const publications = [
  {
    title: "Annual Impact Report 2023",
    description: "Comprehensive overview of our achievements, financials, and impact throughout the year.",
    date: "December 2023",
    featured: true,
  },
  {
    title: "State Championship Analysis",
    description: "Detailed analysis of athlete performances in state-level competitions.",
    date: "October 2023",
    featured: false,
  },
  {
    title: "Community Outreach Summary",
    description: "Report on our rural sports development initiatives and their outcomes.",
    date: "August 2023",
    featured: false,
  },
];

const Resources = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Resources
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Training Materials & Publications
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Access our comprehensive library of training guides, coaching materials, 
              and publications to support your athletic journey.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <category.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.resources.map((resource, resourceIndex) => (
                      <div
                        key={resourceIndex}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground text-sm">{resource.name}</p>
                            <p className="text-xs text-muted-foreground">{resource.type} • {resource.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Publications
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Latest Reports & Publications
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {publications.map((pub, index) => (
              <Card key={index} className={`border-0 shadow-lg ${pub.featured ? "ring-2 ring-secondary" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={pub.featured ? "default" : "secondary"} className={pub.featured ? "bg-secondary text-secondary-foreground" : ""}>
                      {pub.featured ? "Featured" : "Report"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{pub.date}</span>
                  </div>
                  <CardTitle className="text-lg">{pub.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{pub.description}</CardDescription>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Access Library */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Need More Resources?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our complete resource library is available to registered athletes and coaches. 
              Contact us to get access to exclusive training materials and development programs.
            </p>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Request Access
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Resources;
