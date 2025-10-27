import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";
import { DatabaseStatus } from "@/components/database-status";

export default function LandingPage() {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <DatabaseStatus />
      </div>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SocialProofSection />
      <CtaSection />
    </>
  );
}
