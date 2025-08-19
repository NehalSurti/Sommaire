import BgGradient from "@/components/common/Bg-Gradient";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <section className="min-h-screen">
      <BgGradient></BgGradient>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div>
          <Badge>
            <Sparkles></Sparkles>
            <span>AI-Powered Content Creation</span>
          </Badge>
          <h1>Start Uploading your PDF's</h1>
          <p>Upload your PDF and let our AI do the magic!</p>
        </div>
      </div>
    </section>
  );
}
