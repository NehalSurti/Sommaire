import HeroSection from "@/components/home/hero-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="relative w-full">
        <HeroSection></HeroSection>
        {/* <DemoSection></DemoSection>
        <HowItWorksSection></HowItWorksSection>
        <PricingSection></PricingSection>
        <CTASection></CTASection> */}
      </div>
    </>
  );
}
