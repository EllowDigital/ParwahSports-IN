import { Layout } from "@/components/layout/Layout";
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
