import BgGradient from "@/components/common/Bg-Gradient";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200"></BgGradient>
      <div className="container mx-auto flex flex-col gap-4">
        <h1>Your Summaries</h1>
        <p>Transform your PDFs into concise, actionable insights</p>

        <Button
          variant={"link"}
          className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:scale-105 transition-all duration-300 hover:no-underline"
        >
          <Link href="/upload" className="flex items-center text-white">
            <Plus className="w-5 h-5 mr-2"></Plus>New Summary
          </Link>
        </Button>
      </div>
    </main>
  );
}
