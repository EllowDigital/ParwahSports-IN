import { Layout } from "@/components/layout/Layout";
import { Target, Eye, Heart, Award, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import trainingImage from "@/assets/training-session.jpg";
import communityImage from "@/assets/community-event.jpg";

const values = [
  { icon: Award, title: "Discipline", description: "Building strong character through rigorous training and commitment." },
  { icon: Shield, title: "Fair Play", description: "Promoting sportsmanship, integrity, and ethical conduct in all activities." },
  { icon: Users, title: "Inclusivity", description: "Ensuring equal opportunities regardless of background or circumstances." },
  { icon: Target, title: "Excellence", description: "Striving for the highest standards in everything we do." },
];

const milestones = [
  { year: "2015", title: "Foundation Established", description: "Khel Shakti Foundation was registered with a vision to support young athletes." },
  { year: "2016", title: "First Training Camp", description: "Organized our first sports camp with 30 athletes from rural areas." },
  { year: "2018", title: "School Partnerships", description: "Partnered with 10 schools to establish structured sports programs." },
  { year: "2020", title: "National Recognition", description: "Athletes trained by us won medals at national-level competitions." },
  { year: "2022", title: "Expanded Reach", description: "Extended programs to 10+ districts across Uttarakhand." },
  { year: "2024", title: "Digital Initiative", description: "Launched online training resources and virtual mentorship programs." },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              About Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Nurturing Champions, <span className="text-primary">Building Futures</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Khel Shakti Foundation is a non-profit organization dedicated to empowering 
              young and underprivileged athletes across India through comprehensive support, 
              training, and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-16 h-16 bg-secondary/20 rounded-full -translate-x-4 -translate-y-4" />
              <div className="relative bg-card p-8 lg:p-10 rounded-2xl shadow-lg border border-border">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-secondary-foreground" />
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To support young and underprivileged athletes emotionally, financially, and 
                  professionally. We provide world-class training, mentorship, and resources 
                  to help them achieve their full potential and represent India on national 
                  and international stages.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-full translate-x-4 -translate-y-4" />
              <div className="relative bg-card p-8 lg:p-10 rounded-2xl shadow-lg border border-border">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To create a world where every talented athlete, regardless of their background, 
                  has equal opportunities to shine at district, state, national, and international 
                  levels. We envision sports as a powerful tool for social transformation and 
                  individual empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Core Values
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Image Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Decade of Transforming Lives Through Sports
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in 2015 by a group of passionate sports enthusiasts and former athletes, 
                Khel Shakti Foundation began with a simple vision: no talented athlete should be 
                left behind due to lack of resources.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                What started as a small initiative in Dehradun has now grown into a comprehensive 
                support system reaching over 10 districts across Uttarakhand and neighboring states. 
                We have trained more than 150 athletes, many of whom have gone on to compete at 
                national and international levels.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our commitment to transparency, accountability, and excellence has earned us the 
                trust of athletes, parents, schools, and partner organizations alike.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={trainingImage} alt="Training session" className="rounded-xl shadow-lg h-48 lg:h-64 object-cover w-full" />
              <img src={communityImage} alt="Community event" className="rounded-xl shadow-lg h-48 lg:h-64 object-cover w-full mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Milestones Along the Way
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />

              {/* Timeline Items */}
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-8 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-secondary rounded-full border-4 border-background shadow -translate-x-1/2" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <span className="text-sm font-bold text-secondary">{milestone.year}</span>
                    <h3 className="font-semibold text-lg text-foreground">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-accent" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Trust & Transparency
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Khel Shakti Foundation is a registered charitable trust operating under the 
              Indian Trusts Act. We maintain complete transparency in our operations, finances, 
              and impact. All donations are eligible for tax exemption under Section 80G.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold text-foreground">Registration</p>
                <p className="text-sm text-muted-foreground">Registered Trust (2015)</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold text-foreground">Tax Exemption</p>
                <p className="text-sm text-muted-foreground">80G Certified</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold text-foreground">Annual Reports</p>
                <p className="text-sm text-muted-foreground">Publicly Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
