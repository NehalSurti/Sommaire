import BgGradient from "@/components/common/Bg-Gradient";
import DemoSection from "@/components/home/demo-section";
import HeroSection from "@/components/home/hero-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="relative w-full">
        <BgGradient></BgGradient>
        <div className="flex flex-col">
          <HeroSection></HeroSection>
          <DemoSection></DemoSection>
        </div>
        {/* 
        <HowItWorksSection></HowItWorksSection>
        <PricingSection></PricingSection>
        <CTASection></CTASection> */}
      </div>
    </>
  );
}
