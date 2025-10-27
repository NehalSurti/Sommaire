import React from "react";
import BgGradient from "./Bg-Gradient";
import { ArrowRight, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UpgradeRequired() {
  return (
    <div className="relative min-h-[50vh]">
      <BgGradient className="from-rose-100 via-rose-50 to-white"></BgGradient>
      <div className="container px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-8 text-center max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-rose-500">
            <Sparkle className="h-6 w-6"></Sparkle>
            <span className="text-sm font-medium uppercase tracking-wider">
              Premium Feature
            </span>
          </div>

          <h1>Subscription Required</h1>
          <p>
            You need to upgrade to a Basic Plan or the Pro Plan to access this
            feature💖.
          </p>
          <Button
            asChild
            className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white"
          >
            <Link href="/#pricing" className="flex gap-2 items-center">
              View Pricing Plans<ArrowRight className="w-4 h-4"></ArrowRight>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
