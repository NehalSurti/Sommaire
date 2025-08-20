import BgGradient from "@/components/common/Bg-Gradient";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <section className="min-h-screen">
      <BgGradient></BgGradient>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge
            variant={"secondary"}
            className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors"
          >
            <Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse"></Sparkles>
            <span>AI-Powered Content Creation</span>
          </Badge>
          <h1>Start Uploading your PDF's</h1>
          <p>Upload your PDF and let our AI do the magic!</p>
        </div>
      </div>
    </section>
  );
}
