import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import {
  Wallet,
  Heart,
  Users,
  GraduationCap,
  MapPin,
  School,
  Target,
  Globe,
  Megaphone,
  Dumbbell,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import trainingImage from "@/assets/training-session.jpg";

const programs = [
  {
    id: "athlete-support",
    icon: Heart,
    title: "Athlete Support",
    description: "Comprehensive assistance for athletes at every stage of their journey.",
    color: "bg-secondary",
    features: [
      {
        icon: Wallet,
        title: "Financial Assistance",
        description: "Scholarships, equipment funding, travel support for competitions",
      },
      {
        icon: Heart,
        title: "Emotional Support",
        description: "Counseling, mental health resources, peer support networks",
      },
      {
        icon: Users,
        title: "Mentorship Programs",
        description: "One-on-one guidance from experienced athletes and coaches",
      },
    ],
  },
  {
    id: "training",
    icon: GraduationCap,
    title: "Training & Coaching",
    description: "World-class training programs designed to develop champions.",
    color: "bg-primary",
    features: [
      {
        icon: Users,
        title: "Certified Coaches",
        description: "Access to nationally certified and experienced coaching staff",
      },
      {
        icon: Target,
        title: "Individual Training Plans",
        description: "Customized programs based on athlete's goals and capabilities",
      },
      {
        icon: Dumbbell,
        title: "Professional Facilities",
        description: "State-of-the-art training infrastructure and equipment",
      },
    ],
  },
  {
    id: "school-collaboration",
    icon: School,
    title: "School & Academy Collaboration",
    description: "Building sports culture in educational institutions.",
    color: "bg-accent",
    features: [
      {
        icon: School,
        title: "School Partnerships",
        description: "Long-term collaborations with schools and academies",
      },
      {
        icon: GraduationCap,
        title: "Structured Programs",
        description: "Curriculum-integrated sports education programs",
      },
      {
        icon: Users,
        title: "Coach Deployment",
        description: "Placing trained coaches in partner institutions",
      },
    ],
  },
  {
    id: "talent-development",
    icon: Target,
    title: "Talent Development",
    description: "Identifying and nurturing sporting talent from grassroots to global.",
    color: "bg-secondary",
    features: [
      {
        icon: Target,
        title: "Talent Identification",
        description: "Systematic scouting and assessment programs",
      },
      {
        icon: MapPin,
        title: "Local Competitions",
        description: "District and regional level tournaments",
      },
      {
        icon: Globe,
        title: "Global Pathways",
        description: "Support for national and international competitions",
      },
    ],
  },
  {
    id: "community",
    icon: Megaphone,
    title: "Community Engagement",
    description: "Spreading the message of sports and fitness across communities.",
    color: "bg-primary",
    features: [
      {
        icon: Megaphone,
        title: "Seminars & Workshops",
        description: "Educational sessions on sports science and wellness",
      },
      {
        icon: Users,
        title: "Awareness Programs",
        description: "Campaigns promoting sports participation",
      },
      {
        icon: Dumbbell,
        title: "Fitness Campaigns",
        description: "Community fitness drives and health initiatives",
      },
    ],
  },
];

const WhatWeDo = () => {
  return (
    <Layout>
      <SEOHead
        title="What We Do - Sports Programs & Training | Parwah Sports"
        description="Explore Parwah Sports programs: professional sports training, youth development, coaching academies, fitness programs, athletic mentorship, and community sports initiatives across India."
        path="/what-we-do"
        keywords="sports programs India, youth sports development, athletic training, coaching academy, fitness programs, community sports"
      />
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
                What We Do
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Comprehensive Support for <span className="text-primary">Every Athlete</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                From financial assistance to world-class training, we provide holistic support to
                help athletes achieve their dreams. Our programs are designed to address every
                aspect of an athlete's journey.
              </p>
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <Link to="/get-involved">
                  <Heart className="h-5 w-5" />
                  Support an Athlete
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={trainingImage}
                alt="Training session"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">5</div>
                <div className="text-sm opacity-90">Core Programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      {programs.map((program, index) => (
        <section
          key={program.id}
          id={program.id}
          className={`py-16 lg:py-24 ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="flex items-start gap-6 mb-10">
                <div
                  className={`w-16 h-16 ${program.color} rounded-2xl flex items-center justify-center shrink-0`}
                >
                  <program.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {program.title}
                  </h2>
                  <p className="text-lg text-muted-foreground">{program.description}</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {program.features.map((feature, featureIndex) => (
                  <Card
                    key={featureIndex}
                    className="border-0 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              How Our Programs Work
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-12">
              A step-by-step journey from identification to achievement.
            </p>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Identification",
                  description: "Talent scouts identify promising athletes",
                },
                {
                  step: "02",
                  title: "Assessment",
                  description: "Comprehensive evaluation of skills and potential",
                },
                {
                  step: "03",
                  title: "Enrollment",
                  description: "Athletes join our support programs",
                },
                {
                  step: "04",
                  title: "Achievement",
                  description: "Compete and succeed at all levels",
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-5xl font-bold text-secondary mb-4">{item.step}</div>
                  <h3 className="font-semibold text-lg text-primary-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/70">{item.description}</p>
                  {index < 3 && (
                    <ArrowRight className="hidden md:block absolute top-6 -right-4 h-6 w-6 text-secondary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join us in our mission to empower young athletes across India.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <Link to="/get-involved">
                  <Heart className="h-5 w-5" />
                  Donate Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WhatWeDo;
