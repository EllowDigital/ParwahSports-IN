import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { CTASection } from "@/components/home/CTASection";
import { AnnouncementsBanner } from "@/components/home/AnnouncementsBanner";
import { FeaturedEventsSection } from "@/components/home/FeaturedEventsSection";
import { LatestNewsSection } from "@/components/home/LatestNewsSection";
import { RecentBlogsSection } from "@/components/home/RecentBlogsSection";

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Parwah Sports Charitable Trust | Sports Academy & Athletic Training India"
        description="India's trusted sports charitable trust offering professional cricket, football & athletic training, coaching academies, youth tournaments, and community fitness programs. Join Parwah Sports today."
        path="/"
        keywords="sports academy India, cricket academy, football training, athletic coaching, youth sports, fitness training, sports events, Parwah Sports, Saharanpur sports"
      />
      <AnnouncementsBanner />
      <HeroSection />
      <WhatWeDoSection />
      <FeaturedEventsSection />
      <LatestNewsSection />
      <ImpactSection />
      <RecentBlogsSection />
      <PartnersSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
