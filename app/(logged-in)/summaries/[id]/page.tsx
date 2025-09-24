import { getPdfSummaryById } from "@/actions/pdfSummaryActions";
import { Metadata } from "next";
import React from "react";
import { notFound, redirect } from "next/navigation";
import BgGradient from "@/components/common/Bg-Gradient";
import SummaryHeader from "@/components/summaries/summary-header";
import SourceInfo from "@/components/summaries/source-info";

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

  if (!result.success || !result.data) {
    notFound();
  }

  const { title, fileName } = result.data;

  return (
    <div className="relative isolate min-h-screen bg-linear-to-b from-rose-50/40 to-white">
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <div className="flex flex-col">
            <SummaryHeader title={title}></SummaryHeader>
          </div>
          {fileName && <SourceInfo fileName={fileName}></SourceInfo>}
        </div>
      </div>
    </div>
  );
}
