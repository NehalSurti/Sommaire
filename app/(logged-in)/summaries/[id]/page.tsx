import { getPdfSummaryById } from "@/actions/pdfSummaryActions";
import { Metadata } from "next";
import React from "react";
import { notFound, redirect } from "next/navigation";
import BgGradient from "@/components/common/Bg-Gradient";
import SummaryHeader from "@/components/summaries/summary-header";
import SourceInfo from "@/components/summaries/source-info";
import { FileText } from "lucide-react";
import SummaryViewer from "@/components/summaries/summary-viewer";

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

function countWords(summaryText: string) {
  // Trim leading/trailing spaces and split by whitespace
  const words = summaryText.trim().split(/\s+/);

  // Handle case of empty string
  return summaryText.trim() === "" ? 0 : words.length;
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { id } = params;

  const result = await getPdfSummaryById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const Summary = result.data;

  const wordCount = countWords(Summary.summaryText);
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="relative isolate min-h-screen bg-linear-to-b from-rose-50/40 to-white">
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <div className="flex flex-col">
            {
              <SummaryHeader
                title={Summary.title}
                createdAt={Summary.createdAt}
                readingTime={readingTime}
              ></SummaryHeader>
            }
          </div>
          {Summary.fileName && Summary.title && (
            <SourceInfo
              title={Summary.title}
              fileName={Summary.fileName}
              originalFileUrl={Summary.originalFileUrl}
              createdAt={Summary.createdAt}
              summaryText={Summary.summaryText}
            ></SourceInfo>
          )}
          <div className="relative mt-4 sm:mt-8 lg:mt-16">
            <div className="relative p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover:shadow-2xl hover:bg-white/90 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-rose-50/50 via-orange-50/30 to-transparent opacity-50 rounded-2xl sm:rounded-3xl">
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400"></FileText>
                  {wordCount} words
                </div>
                <div className="relative mt-8 sm:mt-6 flex justify-center">
                  <SummaryViewer
                    summaryText={Summary.summaryText}
                  ></SummaryViewer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
