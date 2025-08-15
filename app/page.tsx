import BgGradient from "@/components/common/Bg-Gradient";
import CTASection from "@/components/home/cta-section";
import DemoSection from "@/components/home/demo-section";
import HeroSection from "@/components/home/hero-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import PricingSection from "@/components/home/pricing-section";

export default function Home() {
  return (
    <>
      <div className="relative w-full">
        <BgGradient></BgGradient>
        <div className="flex flex-col">
          <HeroSection></HeroSection>
          <DemoSection></DemoSection>
          <HowItWorksSection></HowItWorksSection>
          <PricingSection></PricingSection>
          <CTASection></CTASection>
        </div>
      </div>
    </>
  );
}
