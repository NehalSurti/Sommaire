import { getPdfSummaryById } from "@/actions/pdfSummaryActions";
import { Metadata } from "next";
import React from "react";
import { notFound, redirect } from "next/navigation";
import BgGradient from "@/components/common/Bg-Gradient";

interface SummaryPageProps {
  params: {
    id: string;
  };
}

// Metadata generation for SEO
export async function generateMetadata({
  params,
}: SummaryPageProps): Promise<Metadata> {
  return {
    title: `Summary: ${params.id}`,
  };
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { id } = params;

  const result = await getPdfSummaryById(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="relative isolate min-h-screen bg-linear-to-b from-rose-50/40 to-white">
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
      <div>
        <div></div>
      </div>
    </div>
  );
}
