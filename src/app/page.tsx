import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SocialProofSection />
      <CtaSection />
    </>
  );
}
